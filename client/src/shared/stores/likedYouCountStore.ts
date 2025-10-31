import { create } from 'zustand';

interface LikedYouCountState {
  count: number;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setCount: (count: number) => void;
  incrementCount: () => void;
  decrementCount: () => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

/**
 * Global liked you count store
 * Manages the count of pending likes received
 * Prevents re-fetching on every component render
 */
export const useLikedYouCountStore = create<LikedYouCountState>((set) => ({
  count: 0,
  isLoading: false,
  isInitialized: false,

  setCount: (count) => {
    set({
      count,
      isLoading: false,
      isInitialized: true,
    });
  },

  incrementCount: () => {
    set((state) => ({
      count: state.count + 1,
    }));
  },

  decrementCount: () => {
    set((state) => ({
      count: Math.max(0, state.count - 1),
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setInitialized: (initialized) => {
    set({ isInitialized: initialized });
  },

  reset: () => {
    set({
      count: 0,
      isLoading: false,
      isInitialized: false,
    });
  },
}));
