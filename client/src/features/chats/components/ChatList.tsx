import type { CategorizedChats } from '../hooks/useChats';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { UnmatchDialog } from './UnmatchDialog';
import { ProfileDialog } from '@/shared/components/profile-dialog';
import { mockChatProfiles } from '../data';
import { formatMatchTimestamp } from '../utils/formatMatchTimestamp';

interface ChatListProps {
  categorizedChats: CategorizedChats[];
  onUnmatch: (chatId: number) => void;
  onRestore?: (chatId: number) => void;
  activeTab?: 'active' | 'archived';
}

export const ChatList = ({ categorizedChats, onUnmatch, onRestore, activeTab = 'active' }: ChatListProps) => {
  const allChats = categorizedChats.flatMap(cat => cat.chats);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, chatId: number} | null>(null);
  const [showUnmatchDialog, setShowUnmatchDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, chatId: number) => {
    e.preventDefault();
    
    // Don't show context menu for unmatched chats
    // Don't show context menu for archived chats in inactive tab
    const chat = allChats.find(c => c.id === chatId);
    if (chat?.isUnmatched || (activeTab === 'archived' && chat?.isArchived)) return;
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      chatId
    });
  };

  const handleUnmatchClick = () => {
    if (contextMenu) {
      setSelectedChatId(contextMenu.chatId);
      setShowUnmatchDialog(true);
      setContextMenu(null);
    }
  };

  const handleViewProfileClick = () => {
    if (contextMenu) {
      setSelectedChatId(contextMenu.chatId);
      setShowProfileDialog(true);
      setContextMenu(null);
    }
  };

  const handleConfirmUnmatch = () => {
    if (selectedChatId !== null) {
      onUnmatch(selectedChatId);
      setSelectedChatId(null);
    }
  };

  const selectedChat = allChats.find(chat => chat.id === selectedChatId);
  const selectedProfile = mockChatProfiles.find(profile => profile.id === selectedChatId);

  // Helper to get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recent':
        return 'text-pink-600 bg-pink-50';
      case 'days':
        return 'text-blue-600 bg-blue-50';
      case 'weeks':
        return 'text-purple-600 bg-purple-50';
      case 'months':
        return 'text-orange-600 bg-orange-50';
      case 'years':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {categorizedChats.map((category) => (
        <div key={category.category}>
          {/* Category Header */}
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground">{category.label}</h2>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(category.category)}`}>
              {category.chats.length}
            </span>
          </div>
          
          {/* Chats in this category */}
          <div className="space-y-1">
            {category.chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${activeTab === 'active' 
                  ? `text-foreground hover:text-white ${chat.isUnmatched ? 'text-primary' : 'hover:bg-muted-foreground'}` 
                  : 'text-muted-foreground hover:bg-muted'}
                `}
                onContextMenu={(e) => handleContextMenu(e, chat.id)}
                onClick={() => navigate({ to: '/chats/$chatId', params: { chatId: String(chat.id) } })}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>
                  {!chat.isRead && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm t truncate">
                      {chat.name}
                    </h3>
                    {chat.isUnmatched ? (
                      <span className="text-xs text-red-500 font-medium">(Unmatched)</span>
                    ) : null}
                    <span className="text-xs  flex-shrink-0">{formatMatchTimestamp(chat)}</span>
                  </div>
                  <p className={`text-xs truncate ${activeTab === 'active' 
                    ? `${chat.isRead ? 'text-foreground group-hover:text-white' : 'text-foreground font-medium group-hover:text-white'}` 
                    : 'text-muted-foreground'}
                  `}>
                    {chat.lastMessage || 'Start a conversation...'}
                  </p>
                </div>
                {activeTab === 'active' && !chat.isRead && (
                  <button
                    className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full transition-colors flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: '/chats/$chatId', params: { chatId: String(chat.id) } });
                    }}
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Context Menu */}
      {contextMenu && (
        <div 
          ref={menuRef}
          className="fixed bg-white rounded-lg shadow-lg border py-2 z-50"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          {onRestore ? (
            <>
              <button
                onClick={handleViewProfileClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-muted-foreground"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  if (contextMenu) {
                    onRestore(contextMenu.chatId);
                    setContextMenu(null);
                  }
                }}
                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
              >
                Restore
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleViewProfileClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                View Profile
              </button>
              {/* Only show Unmatch option for active chats, not for archived chats in inactive tab */}
              {activeTab === 'active' && (
                <button
                  onClick={handleUnmatchClick}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  disabled={selectedChat?.isUnmatched}
                >
                  {selectedChat?.isUnmatched ? 'Unmatched' : 'Unmatch'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {selectedChat && (
        <UnmatchDialog
          open={showUnmatchDialog}
          onOpenChange={setShowUnmatchDialog}
          onConfirm={handleConfirmUnmatch}
          userName={selectedChat.name}
        />
      )}

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        profile={selectedProfile || null}
      />
    </div>
  );
};
