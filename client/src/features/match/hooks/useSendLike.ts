import { useState } from 'react';
import { sendLike } from '@/api/likes';

/**
 * Hook for sending likes to backend
 */
export function useSendLike() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (receiverId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendLike({ receiver_id: receiverId });
      console.log('✅ Like sent successfully:', response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send like';
      const errorCode = err.response?.data?.error;
      
      console.error('❌ Failed to send like:', errorMessage, errorCode);
      setError(errorMessage);
      
      // Don't throw for duplicate likes - it's not a critical error
      if (errorCode === 'like_already_exists') {
        console.log('Like already exists, continuing...');
        return null;
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    send,
    isLoading,
    error,
  };
}
