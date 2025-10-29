import { useEffect } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { useChatsStore } from '../stores/chatsStore';

/**
 * Global hook to sync match state between features
 * This hook should be used in App.tsx to ensure match state is synchronized
 * across the liked_you and chats features
 */
export const useMatchSync = () => {
  const { newMatches, clearNewMatches } = useMatchStore();
  const { newChatIds, removeNewChat } = useChatsStore();

  // Sync match creation with chat creation
  useEffect(() => {
    if (newMatches.size > 0) {
      console.log(`🎉 ${newMatches.size} new matches created!`);
      
      // In a real app, you might want to:
      // 1. Show match notification/animation
      // 2. Play sound effect
      // 3. Send analytics event
      // 4. Update user's match count in profile
    }
  }, [newMatches]);

  // Handle cleanup of new chat indicators after user views them
  useEffect(() => {
    // Auto-remove new chat indicators after 24 hours
    const cleanup = setTimeout(() => {
      if (newChatIds.size > 0) {
        newChatIds.forEach(chatId => {
          removeNewChat(chatId);
        });
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearTimeout(cleanup);
  }, [newChatIds, removeNewChat]);

  // Provide methods for manual cleanup
  const clearAllNewMatches = () => {
    clearNewMatches();
  };

  const clearNewChatIndicator = (chatId: number) => {
    removeNewChat(chatId);
  };

  return {
    newMatchesCount: newMatches.size,
    newChatsCount: newChatIds.size,
    clearAllNewMatches,
    clearNewChatIndicator,
  };
};
