import { create } from 'zustand';
import { getMatchProfiles, type MatchFilters, type MatchProfile } from '@/api/match';

interface MatchProfilesState {
  profiles: MatchProfile[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetchTime: number | null;
  currentFilters: MatchFilters | null;
  
  // Actions
  setProfiles: (profiles: MatchProfile[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  fetchProfiles: (filters?: MatchFilters) => Promise<void>;
  refetch: (filters?: MatchFilters) => Promise<void>;
  reset: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useMatchProfilesStore = create<MatchProfilesState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  lastFetchTime: null,
  currentFilters: null,

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

  fetchProfiles: async (filters) => {
    const state = get();
    
    // Check if we have cached data and it's still fresh
    const now = Date.now();
    const isCacheValid = state.lastFetchTime && 
                        (now - state.lastFetchTime) < CACHE_DURATION &&
                        JSON.stringify(state.currentFilters) === JSON.stringify(filters);
    
    if (state.isInitialized && isCacheValid && state.profiles.length > 0) {
      console.log('[MatchProfilesStore] Using cached data');
      return;
    }

    set({ isLoading: true, error: null, currentFilters: filters });
    
    try {
      console.log('[MatchProfilesStore] Fetching profiles with filters:', filters);
      const response = await getMatchProfiles(filters);

      if (response.success && response.data) {
        set({ 
          profiles: response.data, 
          error: null, 
          isLoading: false,
          isInitialized: true,
          lastFetchTime: now,
          currentFilters: filters
        });
      } else {
        throw new Error(response.message || 'Failed to fetch profiles');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('[MatchProfilesStore] Error fetching profiles:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  refetch: async (filters) => {
    // Force refetch by clearing cache
    set({ lastFetchTime: null });
    await get().fetchProfiles(filters);
  },

  reset: () => set({
    profiles: [],
    isLoading: false,
    error: null,
    isInitialized: false,
    lastFetchTime: null,
    currentFilters: null
  })
}));
