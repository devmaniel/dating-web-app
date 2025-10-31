import { useState, useEffect, useCallback } from 'react';
import { getMatchProfiles, type MatchFilters } from '@/api/match';
import type { MatchProfile } from '@/api/match';

interface UseMatchProfilesReturn {
  profiles: MatchProfile[];
  isLoading: boolean;
  error: string | null;
  refetch: (filters?: MatchFilters) => Promise<void>;
}

/**
 * Hook to fetch match profiles for the current user
 * @returns {UseMatchProfilesReturn} Match profiles state and actions
 */
export const useMatchProfiles = (): UseMatchProfilesReturn => {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async (newFilters?: MatchFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clear old profiles immediately
      setProfiles([]);
      
      console.log('[useMatchProfiles] Fetching profiles with filters:', newFilters);
      const response = await getMatchProfiles(newFilters);
      console.log('[useMatchProfiles] Response:', response);
      
      if (response.success) {
        console.log('[useMatchProfiles] Profiles fetched:', response.data.length);
        console.log('[useMatchProfiles] Sample profile with distance:', response.data[0]);
        setProfiles(response.data);
      } else {
        console.error('[useMatchProfiles] Failed:', response.message);
        setError(response.message || 'Failed to fetch profiles');
      }
    } catch (err) {
      console.error('[useMatchProfiles] Error fetching match profiles:', err);
      setError('Failed to fetch profiles');
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies - stable function

  // Only fetch on initial mount, NOT when filters change
  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchProfiles,
  };
};
