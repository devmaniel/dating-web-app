import { createContext, useContext, useState, useMemo } from 'react';
import type { Profile } from '../data/profiles';
import { useLikes } from '@/shared/contexts/LikeContext';
import { useLikedYouStore } from '@/shared/stores/likedYouStore';
import { useMatchCreation } from '../hooks/useMatchCreation';

export interface FilterSettings {
  genderPreferences: Array<'male' | 'female' | 'nonbinary'>;
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
}

interface SwipeContextType {
  currentIndex: number;
  swipeDecisions: Array<'left' | 'right'>;
  swipedProfiles: Map<number, 'left' | 'right'>;
  handleSwipe: (direction: 'left' | 'right') => void;
  handleUndo: () => void;
  resetSwipeState: () => void;
  profiles: Profile[];
  setFilters: (filters: FilterSettings) => void;
  filters: FilterSettings;
}

const SwipeContext = createContext<SwipeContextType | undefined>(undefined);

interface SwipeProviderProps {
  children: React.ReactNode;
  profiles: Profile[];
}

export const SwipeProvider = ({ children, profiles }: SwipeProviderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDecisions, setSwipeDecisions] = useState<Array<'left' | 'right'>>([]);
  const [swipedProfiles, setSwipedProfiles] = useState<Map<number, 'left' | 'right'>>(new Map());
  const [filters, setFilters] = useState<FilterSettings>({
    genderPreferences: ['male', 'female', 'nonbinary'],
    purposes: ['study-buddy', 'date', 'bizz']
  });
  const { addLike, removeLike } = useLikes();
  const { markAsViewed } = useLikedYouStore();
  const { handleSwipeRight } = useMatchCreation();

  // Filter profiles based on current filter settings
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      // Check if profile gender matches preferences
      const matchesGender = filters.genderPreferences.includes(profile.gender);
      
      // Check if profile has at least one matching purpose
      const hasMatchingPurpose = profile.purposes.some(purpose => 
        filters.purposes.includes(purpose)
      );
      
      return matchesGender && hasMatchingPurpose;
    });
  }, [profiles, filters]);

  const handleSwipe = (direction: 'left' | 'right') => {
    // Record which profile was swiped with what decision
    const currentProfile = filteredProfiles[currentIndex];
    const profileId = currentProfile.id;
    setSwipedProfiles(prev => new Map(prev).set(profileId, direction));
    
    // Mark profile as viewed in the store (decrements pending count)
    markAsViewed(profileId);
    
    // Update global like context and handle match creation
    if (direction === 'right') {
      addLike(profileId);
      
      // Check for match and create conversation if mutual like
      const isMatch = handleSwipeRight(currentProfile);
      
      if (isMatch) {
        // Match created! But still continue to next profile
        console.log(`🎉 Match created with ${currentProfile.name}!`);
        // Don't return early - let the user continue swiping
      }
    } else {
      removeLike(profileId);
    }
    
    setCurrentIndex(prev => prev + 1);
    setSwipeDecisions(prev => [...prev, direction]);
  };

  const handleFilterChange = (newFilters: FilterSettings) => {
    setFilters(newFilters);
    // Reset to beginning when filters change
    setCurrentIndex(0);
    setSwipeDecisions([]);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      // Don't remove from swipedProfiles - keep it to show the indicator
      // Only update the index and decisions array
      setSwipeDecisions(prev => prev.slice(0, -1));
      setCurrentIndex(prev => prev - 1);
    }
  };

  const resetSwipeState = () => {
    setCurrentIndex(0);
    setSwipeDecisions([]);
    setSwipedProfiles(new Map());
  };

  return (
    <SwipeContext.Provider 
      value={{ 
        currentIndex, 
        swipeDecisions, 
        swipedProfiles,
        handleSwipe, 
        handleUndo, 
        resetSwipeState,
        profiles: filteredProfiles,
        setFilters: handleFilterChange,
        filters
      }}
    >
      {children}
    </SwipeContext.Provider>
  );
};

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (context === undefined) {
    throw new Error('useSwipe must be used within a SwipeProvider');
  }
  return context;
};
