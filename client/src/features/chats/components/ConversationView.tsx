import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/features/chats/data/types';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { UnmatchDialog } from './UnmatchDialog';
import { ProfileDialog } from '@/shared/components/profile-dialog';
import { useNavigate } from '@tanstack/react-router';
import { useChat, useMessages } from '../hooks';
import { useDemoMessages } from '../hooks/useDemoMessages';
import { useChats } from '../hooks/useChats';
import { mockChatProfiles } from '../data';
import { formatMatchTimestamp } from '../utils/formatMatchTimestamp';
import { 
  getRandomNewlyMatchedMessage, 
  getRandomNewlyMatchedDescription,
  isNewlyMatched 
} from '../data/newlyMatchedData';

interface ConversationViewProps {
  chatId: number;
}

export const ConversationView = ({ chatId }: ConversationViewProps) => {
  const { chat } = useChat(chatId);
  const { markChatAsRead, handleUnmatch: handleUnmatchChat } = useChats();
  
  // Call both hooks unconditionally to satisfy React hooks rules
  const demoMessages = useDemoMessages(chatId);
  const regularMessages = useMessages(chatId);
  
  // Select which messages hook to use based on chatId
  const {
    messages,
    messageInput,
    setMessageInput,
    messagesEndRef,
    handleSendMessage: originalHandleSendMessage,
  } = chatId === 6 ? demoMessages : regularMessages;

  const [showMenu, setShowMenu] = useState(false);
  const [showUnmatchDialog, setShowUnmatchDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [newlyMatchedMessage, setNewlyMatchedMessage] = useState('');
  const [newlyMatchedDescription, setNewlyMatchedDescription] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const chatProfile = mockChatProfiles.find(profile => profile.id === chatId);

  // Mark chat as read when component mounts
  useEffect(() => {
    if (chatId) {
      markChatAsRead(chatId);
    }
  }, [chatId, markChatAsRead]);

  // Prevent sending messages to archived or unmatched chats
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't send message if chat is archived or unmatched
    if (chat?.isArchived || chat?.isUnmatched) return;
    
    originalHandleSendMessage(e);
  };

  // Generate random messages once when component mounts or when chat changes
  useEffect(() => {
    if (chat && isNewlyMatched(chat)) {
      setNewlyMatchedMessage(getRandomNewlyMatchedMessage());
      setNewlyMatchedDescription(getRandomNewlyMatchedDescription(chat.name));
    } else {
      // Reset messages if not newly matched
      setNewlyMatchedMessage('');
      setNewlyMatchedDescription('');
    }
  }, [chat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  const handleUnmatch = () => {
    if (chat) {
      handleUnmatchChat(chat.id);
      navigate({ to: '/chats' });
    }
  };

  if (!chat) {
    return (
      <div className="max-w-2xl mx-auto mt-5">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/chats" className="p-2 -ml-2 rounded-full text-foreground hover:text-background hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold">Conversation</h1>
        </div>
        <div className="text-sm text-gray-500">Chat not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-5">
      {/* Unmatched chat banner */}
      {chat?.isUnmatched && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 text-sm mb-1">Conversation Inactive</h3>
              <p className="text-sm text-red-700">You unmatched with {chat.name}. Conversation is permanently inactive.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Archived chat banner */}
      {chat?.isArchived && !chat?.isUnmatched && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-800 text-sm mb-1">Conversation Inactive</h3>
              <p className="text-sm text-yellow-700">Since either you unmatched or one of you started it, this conversation will no longer continue.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="sticky top-0  z-10">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/chats" className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-black hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate">{chat.name}</div>
            <div className="text-xs text-gray-500 truncate">
              {chat.isNewlyMatched ? `Studied at ${chat.school}` : `Matched ${formatMatchTimestamp(chat)}`}
            </div>
          </div>
          {!chat?.isArchived && (
            <div className="relative" ref={menuRef}>
              <button 
                className="p-2 rounded-full text-foreground hover:text-black hover:bg-gray-100"
                onClick={() => setShowMenu(!showMenu)}
                disabled={chat?.isArchived || chat?.isUnmatched}
              >
                <BsThreeDotsVertical size={20}  />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowProfileDialog(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  {!chat?.isArchived && !chat?.isUnmatched && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowUnmatchDialog(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Unmatch
                    </button>
                  )}
                  {chat?.isArchived && !chat?.isUnmatched && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        // TODO: Implement restore functionality
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                      disabled
                    >
                      Restore (Coming Soon)
                    </button>
                  )}
                  
                  {chat?.isUnmatched && (
                    <div className="block w-full text-left px-4 py-2 text-sm text-gray-400">
                      No actions available
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 pb-24 min-h-[calc(100vh-200px)]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {isNewlyMatched(chat) ? (
              <>
                <h3 className="font-semibold text-lg mb-1">{newlyMatchedMessage}</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-4">
                  {newlyMatchedDescription}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-1">Start a conversation</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-4">
                  You matched {formatMatchTimestamp(chat).toLowerCase()}. Send a message to get to know {chat.name} better!
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {messages.map((m: Message) => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    m.sender === 'me'
                      ? 'bg-gray-700 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  <div className={`text-[10px] mt-1 ${m.sender === 'me' ? 'text-gray-300' : 'text-gray-500'}`}>{m.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {!(chat?.isArchived || chat?.isUnmatched) && (
        <div className="fixed left-0 right-0 bottom-0 border-t bg-background">
          <div className="max-w-2xl mx-auto p-3">
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${chat?.name}`}
                className="flex-1 px-4 py-3 pr-12 bg-gray-100 text-black rounded-full border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="absolute right-2 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {chat && (
        <UnmatchDialog
          open={showUnmatchDialog}
          onOpenChange={setShowUnmatchDialog}
          onConfirm={handleUnmatch}
          userName={chat.name}
        />
      )}

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        profile={chatProfile || null}
      />
    </div>
  );
};
