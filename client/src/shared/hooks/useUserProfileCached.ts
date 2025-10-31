import { useEffect } from 'react';
import { getUserProfile } from '@/api/profile';
import { useUserProfileStore } from '@/shared/stores/userProfileStore';
import { useAuthStore } from '@/shared/stores/authStore';

/**
 * Hook to access cached user profile data
 * Fetches only once on first use, then uses Zustand store
 * Prevents flickering and unnecessary API calls
 */
export const useUserProfileCached = () => {
  const { profile, isLoading, error, isInitialized, setProfile, setLoading, setError } = useUserProfileStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch profile only if authenticated and not already initialized
  useEffect(() => {
    if (!isAuthenticated || isInitialized) {
      return; // Not authenticated or already fetched, skip
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getUserProfile();

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch profile');
        }

        setProfile(response.data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error fetching user profile:', err);
      }
    };

    fetchProfile();
  }, [isAuthenticated, isInitialized, setProfile, setLoading, setError]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile();

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch profile');
      }

      setProfile(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error refetching user profile:', err);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
};
