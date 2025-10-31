import { create } from 'zustand';
import { getReceivedLikes, type LikeWithProfile } from '@/api/likes';

interface LikedYouProfilesState {
  profiles: LikeWithProfile[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetchTime: number | null;
  
  // Actions
  setProfiles: (profiles: LikeWithProfile[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  fetchProfiles: () => Promise<void>;
  refetch: () => Promise<void>;
  removeProfile: (likeId: string) => void;
  reset: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useLikedYouProfilesStore = create<LikedYouProfilesState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  lastFetchTime: null,

  setProfiles: (profiles) => set({ 
    profiles, 
    error: null, 
    isLoading: false,
    isInitialized: true,
    lastFetchTime: Date.now()
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  fetchProfiles: async () => {
    const state = get();
    
    // Check if we have cached data and it's still fresh
    const now = Date.now();
    const isCacheValid = state.lastFetchTime && 
                        (now - state.lastFetchTime) < CACHE_DURATION;
    
    if (state.isInitialized && isCacheValid && state.profiles.length > 0) {
      console.log('[LikedYouProfilesStore] Using cached data');
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      console.log('[LikedYouProfilesStore] Fetching liked you profiles');
      const response = await getReceivedLikes();

      if (response.success && response.data) {
        set({ 
          profiles: response.data, 
          error: null, 
          isLoading: false,
          isInitialized: true,
          lastFetchTime: now
        });
      } else {
        throw new Error('Failed to fetch liked you profiles');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('[LikedYouProfilesStore] Error fetching profiles:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  refetch: async () => {
    // Force refetch by clearing cache
    set({ lastFetchTime: null });
    await get().fetchProfiles();
  },

  removeProfile: (likeId) => {
    const state = get();
    const updatedProfiles = state.profiles.filter(profile => profile.id !== likeId);
    set({ profiles: updatedProfiles });
  },

  reset: () => set({
    profiles: [],
    isLoading: false,
    error: null,
    isInitialized: false,
    lastFetchTime: null
  })
}));
