import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LikedYouState {
  pendingProfileIds: Set<number>;
  pendingCount: number;
  isInitialized: boolean;
  initializePending: (profileIds: number[]) => void;
  markAsViewed: (profileId: number) => void;
  resetPending: () => void;
}

export const useLikedYouStore = create<LikedYouState>()(
  persist(
    (set, get) => ({
      pendingProfileIds: new Set<number>(),
      pendingCount: 0,
      isInitialized: false,

      initializePending: (profileIds: number[]) => {
        const newPendingIds = new Set(profileIds);
        set({
          pendingProfileIds: newPendingIds,
          pendingCount: newPendingIds.size,
          isInitialized: true,
        });
      },

      markAsViewed: (profileId: number) => {
        const { pendingProfileIds } = get();
        if (pendingProfileIds.has(profileId)) {
          const newPendingIds = new Set(pendingProfileIds);
          newPendingIds.delete(profileId);
          set({
            pendingProfileIds: newPendingIds,
            pendingCount: newPendingIds.size,
          });
        }
      },

      resetPending: () => {
        set({
          pendingProfileIds: new Set<number>(),
          pendingCount: 0,
          isInitialized: false,
        });
      },
    }),
    {
      name: 'liked-you-storage',
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              pendingProfileIds: new Set(state.pendingProfileIds || []),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              pendingProfileIds: Array.from(value.state.pendingProfileIds),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
