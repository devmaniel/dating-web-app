import { EmptyState } from './components/EmptyState';
import { ChatList } from './components/ChatList';
import { useConversations } from './hooks';
import { useChatUnreadSync } from './hooks/useChatUnreadSync';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { unmatchConversation } from '@/api/conversation';
import type { Chat } from './data/types';

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
  
  if (daysSinceMatch <= 1) return 'recent';
  if (daysSinceMatch <= 6) return 'days';
  if (daysSinceMatch <= 30) return 'weeks';
  if (daysSinceMatch <= 365) return 'months';
  return 'years';
};

export const IndexPage = () => {
  const { chats, isLoading, refetch } = useConversations();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  // Filter chats based on search term and active tab
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'active') {
        return matchesSearch && !chat.isArchived && !chat.isUnmatched;
      } else {
        return matchesSearch && chat.isUnmatched;
      }
    });
  }, [chats, searchTerm, activeTab]);

  // Categorize chats
  const categorizedChats = useMemo((): CategorizedChats[] => {
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

    categories.forEach(category => {
      category.chats.sort((a, b) => {
        if (a.isNewlyMatched && !b.isNewlyMatched) return -1;
        if (!a.isNewlyMatched && b.isNewlyMatched) return 1;
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime();
      });
    });

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

  const handleUnmatch = async (chatId: number) => {
    try {
      // Find the chat to get the conversationId
      const chat = chats.find(c => c.id === chatId) as Chat & { conversationId?: string };
      if (chat?.conversationId) {
        await unmatchConversation(chat.conversationId);
        // Refetch conversations to update UI
        refetch();
      }
    } catch (error) {
      console.error('Failed to unmatch conversation:', error);
    }
  };

  // Sync unread counts with global store
  useChatUnreadSync(chats);

  return (
    <div className="w-full mt-5">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-4">Messages</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'active' ? 'border-b-2 border-black text-foreground' : 'text-gray-500'}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeChatsCount})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'archived' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('archived')}
          >
            Inactive ({archivedChatsCount})
          </button>
        </div>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-black" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 text-black rounded-full border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      ) : chats.length > 0 ? (
        <ChatList 
          categorizedChats={categorizedChats}
          onUnmatch={handleUnmatch}
          activeTab={activeTab}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};