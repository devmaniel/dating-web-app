import { SwipeableCardStack } from '@/shared/components/match-or-liked-you';
import { useSwipe } from './contexts/SwipeContext';

const Index = () => {
  return (
    <div className="w-full mt-4">
      <div className="py-10">
        <SwipeableCardStack useSwipe={useSwipe} />
      </div>
    </div>
  );
};

export default Index