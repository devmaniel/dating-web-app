import { useState } from 'react';
import { updateLikeStatus } from '@/api/likes';

/**
 * Hook for accepting or rejecting likes
 */
export function useUpdateLikeStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (likeId: string, status: 'accepted' | 'rejected') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateLikeStatus(likeId, { status });
      console.log(`✅ Like ${status}:`, response);
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || `Failed to ${status} like`;
      console.error(`❌ Failed to ${status} like:`, errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const accept = async (likeId: string) => {
    return update(likeId, 'accepted');
  };

  const reject = async (likeId: string) => {
    return update(likeId, 'rejected');
  };

  return {
    accept,
    reject,
    isLoading,
    error,
  };
}
