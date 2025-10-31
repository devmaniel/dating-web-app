import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import Index from '@/features/match/Index';
import { SwipeProvider } from '@/features/match/contexts/SwipeContext';
import { useMatchProfiles } from '@/features/match/hooks';
import { mapMatchProfilesToProfiles } from '@/features/match/utils/profileMapper';
import { ProtectedLayout } from '@/shared/layouts';
import { ActionButtons } from '@/shared/components/match-or-liked-you/actions/ActionButtons';
import type { FilterSettings } from '@/features/match/contexts/SwipeContext';

export const Route = createFileRoute('/match')({
  component: MatchPage,
});

function MatchPage() {
  const { profiles, isLoading, error, refetch } = useMatchProfiles();
  
  // Handle filter changes from ActionButtons
  const handleFilterChange = useCallback((newFilters: FilterSettings) => {
    console.log('[MatchPage] Filters changed, refetching profiles:', newFilters);
    refetch({
      genderPreferences: newFilters.genderPreferences,
      purposes: newFilters.purposes,
      ageRange: newFilters.ageRange,
      distanceRange: newFilters.distanceRange
    });
  }, [refetch]);

  // Only use API data, no fallback to sample profiles
  const displayProfiles = profiles.length > 0 
    ? mapMatchProfilesToProfiles(profiles) 
    : [];

  console.log('[MatchPage] Profiles from API:', profiles.length);
  console.log('[MatchPage] Display profiles:', displayProfiles.length);
  console.log('[MatchPage] isLoading:', isLoading);
  console.log('[MatchPage] Using:', profiles.length > 0 ? 'API data' : 'no data');
  if (displayProfiles.length > 0) {
    console.log('[MatchPage] First profile:', displayProfiles[0]);
  }

  const actionButtons = (
    <ActionButtons onFilterChange={handleFilterChange} />
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <ProtectedLayout actionButtons={actionButtons}>
      <SwipeProvider profiles={displayProfiles}>
        <Index isLoading={isLoading} />
      </SwipeProvider>
    </ProtectedLayout>
  );
}
