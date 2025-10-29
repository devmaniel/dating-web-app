import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MatchState {
  newMatches: Set<number>;
  matchedProfileIds: Set<number>;
  isInitialized: boolean;
  addNewMatch: (profileId: number) => void;
  removeNewMatch: (profileId: number) => void;
  hasNewMatch: (profileId: number) => boolean;
  clearNewMatches: () => void;
  initializeMatches: (matchedIds: number[]) => void;
  resetMatches: () => void;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      newMatches: new Set<number>(),
      matchedProfileIds: new Set<number>(),
      isInitialized: false,

      addNewMatch: (profileId: number) => {
        const { newMatches, matchedProfileIds } = get();
        const newNewMatches = new Set(newMatches);
        const newMatchedIds = new Set(matchedProfileIds);
        
        newNewMatches.add(profileId);
        newMatchedIds.add(profileId);
        
        set({
          newMatches: newNewMatches,
          matchedProfileIds: newMatchedIds,
        });
      },

      removeNewMatch: (profileId: number) => {
        const { newMatches } = get();
        if (newMatches.has(profileId)) {
          const newNewMatches = new Set(newMatches);
          newNewMatches.delete(profileId);
          set({ newMatches: newNewMatches });
        }
      },

      hasNewMatch: (profileId: number) => {
        const { newMatches } = get();
        return newMatches.has(profileId);
      },

      clearNewMatches: () => {
        set({ newMatches: new Set<number>() });
      },

      initializeMatches: (matchedIds: number[]) => {
        const newMatchedIds = new Set(matchedIds);
        set({
          matchedProfileIds: newMatchedIds,
          isInitialized: true,
        });
      },

      resetMatches: () => {
        set({
          newMatches: new Set<number>(),
          matchedProfileIds: new Set<number>(),
          isInitialized: false,
        });
      },
    }),
    {
      name: 'match-storage',
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              newMatches: new Set(state.newMatches || []),
              matchedProfileIds: new Set(state.matchedProfileIds || []),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              newMatches: Array.from(value.state.newMatches),
              matchedProfileIds: Array.from(value.state.matchedProfileIds),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
