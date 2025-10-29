import { useEffect } from 'react';
import { useChatsStore } from '@/shared/stores/chatsStore';
import { countUnreadChats, getUnreadChatIds } from '../utils/unreadCounter';
import type { Chat } from '../data/types';

/**
 * Hook to sync chat data with global unread count store
 * This should be used in the main chats component to keep the global state updated
 */
export const useChatUnreadSync = (chats: Chat[]) => {
  const { initializeUnreadChats, updateUnreadCount, isInitialized } = useChatsStore();

  useEffect(() => {
    if (!chats || chats.length === 0) return;

    const unreadCount = countUnreadChats(chats);
    const unreadChatIds = getUnreadChatIds(chats);

    if (!isInitialized) {
      // First time initialization
      initializeUnreadChats(unreadChatIds);
    } else {
      // Only update if the count is different to prevent double counting
      // This prevents conflicts with useGlobalChatSync and new chat additions
      const currentStore = useChatsStore.getState();
      if (currentStore.unreadCount !== unreadCount) {
        updateUnreadCount(unreadCount);
      }
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
