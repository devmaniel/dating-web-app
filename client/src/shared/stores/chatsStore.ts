import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatsState {
  unreadCount: number;
  unreadChatIds: Set<number>;
  newChatIds: Set<number>;
  isInitialized: boolean;
  initializeUnreadChats: (chatIds: number[]) => void;
  markChatAsRead: (chatId: number) => void;
  markChatAsUnread: (chatId: number) => void;
  updateUnreadCount: (count: number) => void;
  addNewChat: (chatId: number) => void;
  removeNewChat: (chatId: number) => void;
  resetUnreadChats: () => void;
}

export const useChatsStore = create<ChatsState>()(
  persist(
    (set, get) => ({
      unreadCount: 0,
      unreadChatIds: new Set<number>(),
      newChatIds: new Set<number>(),
      isInitialized: false,

      initializeUnreadChats: (chatIds: number[]) => {
        const newUnreadIds = new Set(chatIds);
        set({
          unreadChatIds: newUnreadIds,
          unreadCount: newUnreadIds.size,
          isInitialized: true,
        });
      },

      markChatAsRead: (chatId: number) => {
        const { unreadChatIds } = get();
        if (unreadChatIds.has(chatId)) {
          const newUnreadIds = new Set(unreadChatIds);
          newUnreadIds.delete(chatId);
          set({
            unreadChatIds: newUnreadIds,
            unreadCount: newUnreadIds.size,
          });
        }
      },

      markChatAsUnread: (chatId: number) => {
        const { unreadChatIds } = get();
        if (!unreadChatIds.has(chatId)) {
          const newUnreadIds = new Set(unreadChatIds);
          newUnreadIds.add(chatId);
          set({
            unreadChatIds: newUnreadIds,
            unreadCount: newUnreadIds.size,
          });
        }
      },

      updateUnreadCount: (count: number) => {
        set({ unreadCount: count });
      },

      addNewChat: (chatId: number) => {
        const { newChatIds, unreadChatIds } = get();
        const newNewChatIds = new Set(newChatIds);
        const newUnreadIds = new Set(unreadChatIds);
        
        newNewChatIds.add(chatId);
        newUnreadIds.add(chatId); // New chats are automatically unread
        
        set({
          newChatIds: newNewChatIds,
          unreadChatIds: newUnreadIds,
          unreadCount: newUnreadIds.size,
        });
      },

      removeNewChat: (chatId: number) => {
        const { newChatIds } = get();
        if (newChatIds.has(chatId)) {
          const newNewChatIds = new Set(newChatIds);
          newNewChatIds.delete(chatId);
          set({ newChatIds: newNewChatIds });
        }
      },

      resetUnreadChats: () => {
        set({
          unreadChatIds: new Set<number>(),
          newChatIds: new Set<number>(),
          unreadCount: 0,
          isInitialized: false,
        });
      },
    }),
    {
      name: 'chats-storage',
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              unreadChatIds: new Set(state.unreadChatIds || []),
              newChatIds: new Set(state.newChatIds || []),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              unreadChatIds: Array.from(value.state.unreadChatIds),
              newChatIds: Array.from(value.state.newChatIds),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
