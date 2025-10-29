import { EmptyState } from './components/EmptyState';
import { ChatList } from './components/ChatList';
import { useChats } from './hooks';
import { useChatUnreadSync } from './hooks/useChatUnreadSync';
import { Search } from 'lucide-react';

export const IndexPage = () => {
  const {
    chats,
    categorizedChats,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    activeChatsCount,
    archivedChatsCount, // Note: This now includes both archived and unmatched chats
    handleUnmatch,
  } = useChats();

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
      
      {chats.length > 0 ? (
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