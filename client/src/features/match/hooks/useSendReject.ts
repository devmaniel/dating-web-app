import { useState } from 'react';
import { sendLike } from '@/api/likes';

/**
 * Hook for sending rejections to backend
 * Creates a like with status 'rejected' to prevent profile from appearing again
 */
export function useSendReject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = async (receiverId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send like with rejected status
      // Backend will create a liked_you record with status 'rejected'
      const response = await sendLike({ 
        receiver_id: receiverId,
        status: 'rejected' // Explicitly set as rejected
      });
      
      console.log('✅ Rejection sent to backend:', response);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send rejection')
        : 'Failed to send rejection';
      console.error('❌ Failed to send rejection:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reject,
    isLoading,
    error,
  };
}
