import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { MainLayout } from '@/shared/layouts';
import Index from '@/features/liked_you/Index';
import { ActionButtons } from '@/features/liked_you/components/ActionButtons';
import { useSwipe, SwipeProvider } from '@/features/liked_you/contexts/SwipeContext';
import { sampleProfiles } from '@/features/liked_you/data/profiles';
import { useLikedYouStore } from '@/shared/stores/likedYouStore';

export const Route = createFileRoute('/liked_you')({
  component: LikedYouPage,
});

function LikedYouPage() {
  const { initializePending, isInitialized } = useLikedYouStore();

  // Initialize pending profiles on mount (only once)
  useEffect(() => {
    // Only initialize if store has never been initialized
    if (!isInitialized) {
      const profileIds = sampleProfiles.map(profile => profile.id);
      initializePending(profileIds);
    }
  }, [initializePending, isInitialized]);

  return (
    <SwipeProvider profiles={sampleProfiles}>
      <MainLayout actionButtons={<ActionButtonsWithUndo />}>  
        <Index />
      </MainLayout>
    </SwipeProvider>
  );
}

const ActionButtonsWithUndo = () => {
  const { handleUndo } = useSwipe();
  
  return <ActionButtons onUndo={handleUndo} />;
};
