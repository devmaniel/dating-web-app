/**
 * Skeleton loader for card content
 * Shows while profile data is loading
 */
export const CardSkeleton = () => {
  return (
    <div className="w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-[450px] bg-gray-300 dark:bg-gray-600" />
      
      {/* Info skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
      </div>
    </div>
  );
};
