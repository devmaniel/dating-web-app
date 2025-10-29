import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@/shared/layouts';
import Index from '@/features/match/Index';
import { ActionButtons } from '@/features/match/components/ActionButtons';
import { useSwipe, SwipeProvider } from '@/features/match/contexts/SwipeContext';
import { sampleProfiles } from '@/features/match/data/profiles';

export const Route = createFileRoute('/match')({
  component: MatchPage,
});

function MatchPage() {
  return (
    <SwipeProvider profiles={sampleProfiles}>
      <MainLayout actionButtons={<ActionButtonsWithUndo />}>  
        <Index />
      </MainLayout>
    </SwipeProvider>
  );
}

const ActionButtonsWithUndo = () => {
  const { handleUndo, setFilters } = useSwipe();
  
  return <ActionButtons onUndo={handleUndo} onFilterChange={setFilters} />;
};
