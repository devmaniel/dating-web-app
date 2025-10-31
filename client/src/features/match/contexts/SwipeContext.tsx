import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { Profile } from '../data/profiles';
import { useLikes } from '@/shared/contexts/LikeContext';
import { useSendLike } from '../hooks/useSendLike';
import { useSendReject } from '../hooks/useSendReject';
import { useAuthStore } from '@/shared/stores/authStore';

export interface FilterSettings {
  genderPreferences: Array<'male' | 'female' | 'nonbinary'>;
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
  ageRange: { min: number; max: number };
  distanceRange: { min: number; max: number };
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
    ageRange: { min: 18, max: 25 },
    distanceRange: { min: 0, max: 100 }
  });
  const { addLike, removeLike } = useLikes();
  const { send: sendLikeToBackend } = useSendLike();
  const { reject: sendRejectToBackend } = useSendReject();
  const { user } = useAuthStore();

  // Reset swipe state when profiles change (e.g., when API data loads)
  useEffect(() => {
    console.log('[SwipeContext] Profiles changed, resetting state. Count:', profiles.length);
    setCurrentIndex(0);
    setSwipeDecisions([]);
    setSwipedProfiles(new Map());
  }, [profiles.length]);

  // Filter profiles based on current filter settings
  // Filters by: gender, age, and distance (age is client-side only, not in DB)
  const filteredProfiles = useMemo(() => {
    const filtered = profiles.filter(profile => {
      // Check if profile gender matches preferences
      const matchesGender = filters.genderPreferences.includes(profile.gender);
      
      // Check if profile age is within range (client-side filtering)
      const matchesAge = profile.age >= filters.ageRange.min && profile.age <= filters.ageRange.max;
      
      // Check if profile distance is within range (min and max)
      const matchesDistance = profile.distanceKm >= filters.distanceRange.min && 
                             profile.distanceKm <= filters.distanceRange.max;
      
      return matchesGender && matchesAge && matchesDistance;
    });
    
    console.log('[SwipeContext] Total profiles:', profiles.length);
    console.log('[SwipeContext] Filtered profiles:', filtered.length);
    console.log('[SwipeContext] First filtered profile:', filtered[0]);
    
    return filtered;
  }, [profiles, filters]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    // Record which profile was swiped with what decision
    const profile = filteredProfiles[currentIndex];
    const profileId = profile.id;
    setSwipedProfiles(prev => new Map(prev).set(profileId, direction));
    
    // Update global like context
    if (direction === 'right') {
      addLike(profileId);
      
      // Send like to backend if user is authenticated
      if (user?.id && profile.userId) {
        try {
          await sendLikeToBackend(profile.userId);
          console.log('✅ Like sent to backend for profile:', profileId);
        } catch (error) {
          console.error('❌ Failed to send like to backend:', error);
          // Don't block the UI - like is still recorded locally
        }
      }
    } else {
      removeLike(profileId);
      
      // Send rejection to backend if user is authenticated
      // This prevents the profile from appearing again in Match page
      if (user?.id && profile.userId) {
        try {
          await sendRejectToBackend(profile.userId);
          console.log('✅ Rejection sent to backend for profile:', profileId);
        } catch (error) {
          console.error('❌ Failed to send rejection to backend:', error);
          // Don't block the UI - rejection is still recorded locally
        }
      }
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
