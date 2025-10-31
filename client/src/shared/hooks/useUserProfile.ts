import { useState, useEffect } from 'react';
import { getUserProfile, type UserProfileData } from '@/api/profile';

export interface UseUserProfileReturn {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage current user's profile data
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getUserProfile();

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch profile');
      }

      setProfile(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const refetch = async () => {
    await fetchProfile();
  };

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
};
