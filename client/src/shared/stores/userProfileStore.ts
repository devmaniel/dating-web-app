import { create } from 'zustand';
import type { UserProfileData } from '@/api/profile';

interface UserProfileState {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  setProfile: (profile: UserProfileData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

/**
 * Global user profile store
 * Prevents re-fetching profile data on every component render
 * Initialized once at app startup
 */
export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  setProfile: (profile) => {
    set({
      profile,
      isLoading: false,
      error: null,
      isInitialized: true,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({
      error,
      isLoading: false,
      isInitialized: true,
    });
  },

  setInitialized: (initialized) => {
    set({ isInitialized: initialized });
  },

  reset: () => {
    set({
      profile: null,
      isLoading: false,
      error: null,
      isInitialized: false,
    });
  },
}));
