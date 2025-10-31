import { useEffect } from 'react';
import { useChatsStore } from '@/shared/stores/chatsStore';
import { countUnreadChats, getUnreadChatIds } from '../utils/unreadCounter';
import type { Chat } from '../data/types';

/**
 * Hook to sync chat data with global unread count store
 * This should be used in the main chats component to keep the global state updated
 * Listens to real-time changes in chat unread counts via WebSocket
 */
export const useChatUnreadSync = (chats: Chat[]) => {
  const { initializeUnreadChats, updateUnreadCount, isInitialized } = useChatsStore();

  useEffect(() => {
    if (!chats || chats.length === 0) {
      // Reset count if no chats
      updateUnreadCount(0);
      return;
    }

    const unreadCount = countUnreadChats(chats);
    const unreadChatIds = getUnreadChatIds(chats);

    if (!isInitialized) {
      // First time initialization
      initializeUnreadChats(unreadChatIds);
    } else {
      // Always update to reflect real-time changes from WebSocket
      updateUnreadCount(unreadCount);
    }
  }, [chats, initializeUnreadChats, updateUnreadCount, isInitialized]);

  // Return utility functions for manual updates
  return {
    syncUnreadCount: () => {
      const unreadCount = countUnreadChats(chats);
      updateUnreadCount(unreadCount);
    },
  };
};
