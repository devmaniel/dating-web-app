import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import Chat type from chats feature
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

interface NewChatsState {
  newChats: Chat[];
  isInitialized: boolean;
  addNewChat: (chat: Chat) => void;
  getNewChats: () => Chat[];
  clearNewChats: () => void;
  removeNewChat: (chatId: number) => void;
}

export const useNewChatsStore = create<NewChatsState>()(
  persist(
    (set, get) => ({
      newChats: [],
      isInitialized: false,

      addNewChat: (chat: Chat) => {
        const { newChats } = get();
        // Check if chat already exists
        const exists = newChats.some(existingChat => existingChat.id === chat.id);
        if (!exists) {
          set({
            newChats: [chat, ...newChats],
            isInitialized: true,
          });
        }
      },

      getNewChats: () => {
        const { newChats } = get();
        return newChats;
      },

      clearNewChats: () => {
        set({
          newChats: [],
        });
      },

      removeNewChat: (chatId: number) => {
        const { newChats } = get();
        const filteredChats = newChats.filter(chat => chat.id !== chatId);
        set({
          newChats: filteredChats,
        });
      },
    }),
    {
      name: 'new-chats-storage',
    }
  )
);
