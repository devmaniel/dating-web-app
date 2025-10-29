import { useCallback } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { useChatsStore } from '../stores/chatsStore';
import { useNewChatsStore } from '../stores/newChatsStore';

// Chat type definition
interface Chat {
  id: number;
  name: string;
  age: number;
  school: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isArchived?: boolean;
  isUnmatched?: boolean;
  isNewlyMatched?: boolean;
  matchedAt: string;
  lastResponseAt?: string;
}

/**
 * Global hook for handling match creation that can be used across features
 * This provides a centralized way to create matches and update all relevant stores
 */
export const useGlobalMatchCreation = () => {
  const { addNewMatch } = useMatchStore();
  const { addNewChat: addNewChatId } = useChatsStore();
  const { addNewChat: addNewChatObject } = useNewChatsStore();

  const createGlobalMatch = useCallback((profileId: number, chatObject: Chat) => {
    // Add to match store (tracks new matches)
    addNewMatch(profileId);
    
    // Add to chats store (tracks new chats for unread counts)
    addNewChatId(chatObject.id);
    
    // Add to new chats store (stores the actual Chat object)
    addNewChatObject(chatObject);
    
    // DON'T navigate - let user discover the new chat naturally
    console.log(`🎉 Global match created! Profile: ${profileId}, Chat: ${chatObject.id} - Check your messages! 💬`);
  }, [addNewMatch, addNewChatId, addNewChatObject]);

  return {
    createGlobalMatch,
  };
};
