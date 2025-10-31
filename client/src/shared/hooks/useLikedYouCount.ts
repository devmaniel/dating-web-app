import { useEffect, useCallback } from 'react';
import { onLikeReceived, offLikeReceived, onLikeRejected, offLikeRejected, isSocketReady } from '@/shared/services/socket';
import type { LikeReceivedEvent, LikeRejectedEvent } from '@/shared/services/socket';
import { getReceivedLikesCount } from '@/api/likes';
import { useLikedYouCountStore } from '@/shared/stores/likedYouCountStore';
import { useAuthStore } from '@/shared/stores/authStore';

/**
 * Hook to manage liked_you count with real-time updates
 * Uses Zustand store to prevent re-fetching on every component render
 * Only fetches COUNT once, then uses store + real-time socket updates
 */
export function useLikedYouCount() {
  const { count, isLoading, isInitialized, setCount, incrementCount, decrementCount, setLoading } = useLikedYouCountStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch initial count from backend (lightweight query)
  const fetchCount = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReceivedLikesCount();
      
      if (response.success) {
        setCount(response.count);
      }
    } catch (error) {
      console.error('Failed to fetch liked you count:', error);
    }
  }, [setCount, setLoading]);

  // Setup real-time listener for new likes and rejections
  // Only set up listeners when authenticated and Socket is ready
  useEffect(() => {
    if (!isAuthenticated || !isSocketReady()) {
      return; // Wait for auth and Socket to be ready
    }

    const handleLikeReceived = (event: LikeReceivedEvent) => {
      console.log('📨 New like received via Socket.IO:', event);
      // Increment count without fetching full data
      incrementCount();
    };

    const handleLikeRejected = (event: LikeRejectedEvent) => {
      console.log('❌ Like rejected via Socket.IO:', event);
      // Decrement count when someone rejects your pending like
      decrementCount();
    };

    // Listen for new likes and rejections
    onLikeReceived(handleLikeReceived);
    onLikeRejected(handleLikeRejected);

    // Cleanup
    return () => {
      offLikeReceived(handleLikeReceived);
      offLikeRejected(handleLikeRejected);
    };
  }, [isAuthenticated, incrementCount, decrementCount]);

  // Fetch initial count only once when authenticated and not initialized
  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      fetchCount();
    }
  }, [isAuthenticated, isInitialized, fetchCount]);

  return {
    count,
    isLoading,
    refetch: fetchCount,
  };
}
