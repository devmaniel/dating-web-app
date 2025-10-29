import { createContext, useContext, useState, useMemo } from 'react';
import type { Profile } from '../data/profiles';
import { useLikes } from '@/shared/contexts/LikeContext';

export interface FilterSettings {
  genderPreferences: Array<'male' | 'female' | 'nonbinary'>;
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
  ageRange: { min: number; max: number };
  maxDistance: number;
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
    purposes: ['study-buddy', 'date', 'bizz'],
    ageRange: { min: 18, max: 99 },
    maxDistance: 100
  });
  const { addLike, removeLike } = useLikes();

  // Filter profiles based on current filter settings
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      // Check if profile gender matches preferences
      const matchesGender = filters.genderPreferences.includes(profile.gender);
      
      // Check if profile has at least one matching purpose
      const hasMatchingPurpose = profile.purposes.some(purpose => 
        filters.purposes.includes(purpose)
      );
      
      // Check if profile age is within range
      const matchesAge = profile.age >= filters.ageRange.min && profile.age <= filters.ageRange.max;
      
      // Check if profile distance is within max distance
      const matchesDistance = profile.distanceKm <= filters.maxDistance;
      
      return matchesGender && hasMatchingPurpose && matchesAge && matchesDistance;
    });
  }, [profiles, filters]);

  const handleSwipe = (direction: 'left' | 'right') => {
    // Record which profile was swiped with what decision
    const profileId = filteredProfiles[currentIndex].id;
    setSwipedProfiles(prev => new Map(prev).set(profileId, direction));
    
    // Update global like context
    if (direction === 'right') {
      addLike(profileId);
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
