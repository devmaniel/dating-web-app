import { useEffect } from 'react';
import { useChatsStore } from '@/shared/stores/chatsStore';

// Import the mock data to initialize unread counts
import { mockChats } from '@/features/chats/data/mockChats';
import { countUnreadChats, getUnreadChatIds } from '@/features/chats/utils/unreadCounter';

/**
 * Global hook to initialize chat unread counts on app startup
 * This should be used in the root App component to ensure counts are available immediately
 */
export const useGlobalChatSync = () => {
  const { initializeUnreadChats, updateUnreadCount, isInitialized } = useChatsStore();

  useEffect(() => {
    // Initialize unread counts from mock data on app startup
    const unreadCount = countUnreadChats(mockChats);
    const unreadChatIds = getUnreadChatIds(mockChats);

    if (!isInitialized) {
      // First time initialization
      initializeUnreadChats(unreadChatIds);
    } else {
      // Update existing state with current data
      updateUnreadCount(unreadCount);
    }
  }, [initializeUnreadChats, updateUnreadCount, isInitialized]);
};
