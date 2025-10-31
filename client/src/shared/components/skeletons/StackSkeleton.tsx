import { CardSkeleton } from './CardSkeleton';

/**
 * Skeleton loader for card stack
 * Shows 3 stacked skeleton cards while loading
 */
export const StackSkeleton = () => {
  return (
    <div className="relative w-full mx-auto">
      <div className="relative h-[450px] mb-10">
        {/* Show 3 stacked skeletons */}
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-300 ${
              index === 1 ? 'scale-95 translate-y-2' :
              index === 2 ? 'scale-90 translate-y-4' :
              ''
            }`}
            style={{
              zIndex: 10 - index,
            }}
          >
            <CardSkeleton />
          </div>
        ))}
      </div>

      {/* Skeleton buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
      </div>
    </div>
  );
};
