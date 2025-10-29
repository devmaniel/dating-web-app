import { useState, useMemo, useEffect } from 'react';
import { mockChats } from '../data';
import type { Chat } from '../data/types';
import { useChatsStore } from '@/shared/stores/chatsStore';
import { useNewChatsStore } from '@/shared/stores/newChatsStore';

export type MatchCategory = 'recent' | 'days' | 'weeks' | 'months' | 'years';

export interface CategorizedChats {
  category: MatchCategory;
  label: string;
  chats: Chat[];
}

// Helper function to categorize a chat based on match date
const categorizeChat = (chat: Chat): MatchCategory => {
  const now = new Date();
  const matchedDate = new Date(chat.matchedAt);
  const daysSinceMatch = Math.floor((now.getTime() - matchedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Recent: 0-1 days since match
  if (daysSinceMatch <= 1) {
    return 'recent';
  }
  
  // Days: 2-6 days since match
  if (daysSinceMatch <= 6) {
    return 'days';
  }
  
  // Weeks: 7-30 days since match
  if (daysSinceMatch <= 30) {
    return 'weeks';
  }
  
  // Months: 31-365 days since match
  if (daysSinceMatch <= 365) {
    return 'months';
  }
  
  // Years: older than 365 days
  return 'years';
};

// Helper function to load chats from localStorage with fallback to mockChats
const loadChatsFromStorage = (): Chat[] => {
  try {
    const storedChats = localStorage.getItem('dating-app-chats');
    if (storedChats) {
      return JSON.parse(storedChats);
    }
  } catch (error) {
    console.warn('Failed to load chats from localStorage:', error);
  }
  return mockChats;
};

// Helper function to save chats to localStorage
const saveChatsToStorage = (chats: Chat[]) => {
  try {
    localStorage.setItem('dating-app-chats', JSON.stringify(chats));
  } catch (error) {
    console.warn('Failed to save chats to localStorage:', error);
  }
};

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>(loadChatsFromStorage);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const { newChatIds } = useChatsStore();
  const { getNewChats } = useNewChatsStore();

  // Save chats to localStorage whenever chats state changes
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  // Add new chats from the global store when they're created
  useEffect(() => {
    const newChats = getNewChats();
    if (newChats.length > 0) {
      // Add new chats to the local state if they don't already exist
      setChats(prevChats => {
        const existingIds = new Set(prevChats.map(chat => chat.id));
        const chatsToAdd = newChats.filter(newChat => !existingIds.has(newChat.id));
        
        if (chatsToAdd.length > 0) {
          console.log(`📬 Adding ${chatsToAdd.length} new chats to the list!`);
          return [...chatsToAdd, ...prevChats];
        }
        return prevChats;
      });
    }
  }, [newChatIds, getNewChats]);

  // Filter chats based on search term and active tab
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'active') {
        // Active tab: only non-archived and non-unmatched chats
        return matchesSearch && !chat.isArchived && !chat.isUnmatched;
      } else {
        // Inactive tab: only unmatched chats (all inactive data = unmatched)
        return matchesSearch && chat.isUnmatched;
      }
    });
  }, [chats, searchTerm, activeTab]);

  // Categorize chats by time-based categories
  const categorizedChats = useMemo(() => {
    const categories: CategorizedChats[] = [
      { category: 'recent', label: 'Recent', chats: [] },
      { category: 'days', label: 'Days Ago', chats: [] },
      { category: 'weeks', label: 'Weeks Ago', chats: [] },
      { category: 'months', label: 'Months Ago', chats: [] },
      { category: 'years', label: 'Years Ago', chats: [] },
    ];

    filteredChats.forEach(chat => {
      const category = categorizeChat(chat);
      const categoryObj = categories.find(c => c.category === category);
      if (categoryObj) {
        categoryObj.chats.push(chat);
      }
    });

    // Sort chats within each category by most recent first, with newly matched chats prioritized
    categories.forEach(category => {
      category.chats.sort((a, b) => {
        // First priority: newly matched chats go to the top
        if (a.isNewlyMatched && !b.isNewlyMatched) return -1;
        if (!a.isNewlyMatched && b.isNewlyMatched) return 1;
        
        // Second priority: unread chats go above read chats
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        
        // Third priority: sort by matchedAt date, most recent first
        return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime();
      });
    });

    // Only return categories that have chats
    return categories.filter(cat => cat.chats.length > 0);
  }, [filteredChats]);

  const activeChatsCount = useMemo(
    () => chats.filter(chat => !chat.isArchived && !chat.isUnmatched).length,
    [chats]
  );

  const archivedChatsCount = useMemo(
    () => chats.filter(chat => chat.isUnmatched).length,
    [chats]
  );

  const handleUnmatch = (chatId: number) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, isUnmatched: true, isArchived: true } : chat
      )
    );
  };

  const handleRestore = (chatId: number) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, isArchived: false, isUnmatched: false } : chat
      )
    );
  };

  const markChatAsRead = (chatId: number) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, isRead: true } : chat
      )
    );
  };

  const addNewChat = (newChat: Chat) => {
    setChats(prevChats => [newChat, ...prevChats]);
  };

  const resetChatsToDefault = () => {
    setChats(mockChats);
    localStorage.removeItem('dating-app-chats');
  };

  return {
    chats,
    filteredChats,
    categorizedChats,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    activeChatsCount,
    archivedChatsCount,
    handleUnmatch,
    handleRestore,
    markChatAsRead,
    addNewChat,
    resetChatsToDefault,
  };
};
