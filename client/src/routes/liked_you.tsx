import { createFileRoute } from '@tanstack/react-router';
import Index from '@/features/liked_you/Index';
import { SwipeProvider } from '@/features/liked_you/contexts/SwipeContext';
import { useReceivedLikes } from '@/features/liked_you/hooks/useReceivedLikes';
import { ProtectedLayout } from '@/shared/layouts';

export const Route = createFileRoute('/liked_you')({
  component: LikedYouPage,
});

function LikedYouPage() {
  const { profiles, isLoading, error, removeProfile } = useReceivedLikes();

  console.log('[LikedYouPage] Profiles from API:', profiles.length);
  console.log('[LikedYouPage] Display profiles:', profiles.length);
  console.log('[LikedYouPage] isLoading:', isLoading);
  if (profiles.length > 0) {
    console.log('[LikedYouPage] First profile:', profiles[0]);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <SwipeProvider profiles={profiles} removeProfile={removeProfile}>
        <Index isLoading={isLoading} />
      </SwipeProvider>
    </ProtectedLayout>
  );
}
