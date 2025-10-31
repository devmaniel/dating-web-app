import { SwipeableCardStack } from '@/shared/components/match-or-liked-you';
import { useSwipe } from './contexts/SwipeContext';

interface IndexProps {
  isLoading?: boolean;
}

const Index = ({ isLoading = false }: IndexProps) => {
  return (
    <div className="w-full mt-4">
      <div className="py-10">
        <SwipeableCardStack useSwipe={useSwipe} isLoading={isLoading} variant="match" />
      </div>
    </div>
  );
};

export default Index