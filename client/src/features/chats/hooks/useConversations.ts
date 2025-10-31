import { useState, useEffect, useMemo } from 'react';
import { getConversations, type Conversation } from '@/api/conversation';
import { 
  onNewMessage, 
  onConversationUnmatched,
  onMessagesRead,
  offNewMessage, 
  offConversationUnmatched,
  offMessagesRead,
  type NewMessageEvent,
  type ConversationUnmatchedEvent,
  type MessagesReadEvent
} from '@/shared/services/socket';
import type { Chat } from '../data/types';

/**
 * Hook to fetch and manage conversations from the API
 * Converts API Conversation format to Chat format for compatibility
 */
export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Performance optimization: Operation queue and cached tracking
  const [operationQueue, setOperationQueue] = useState<Promise<void>>(Promise.resolve());
  const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set());
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());

  // Queue operations to prevent race conditions
  const queueOperation = async (operationId: string, operation: () => Promise<void> | void): Promise<void> => {
    if (pendingOperations.has(operationId)) {
      await operationQueue;
      return;
    }

    const newPendingOps = new Set(pendingOperations);
    newPendingOps.add(operationId);
    setPendingOperations(newPendingOps);
    
    const newQueue = operationQueue.then(async () => {
      try {
        await operation();
      } finally {
        setPendingOperations(prev => {
          const updated = new Set(prev);
          updated.delete(operationId);
          return updated;
        });
      }
    });

    setOperationQueue(newQueue);
    await newQueue;
  };

  // Performance-optimized unread count update
  const updateTotalUnreadCount = (delta: number) => {
    setTotalUnreadCount(prev => Math.max(0, prev + delta));
    setLastUpdateTimestamp(Date.now());
    console.log(`📊 Total unread conversations updated: ${delta > 0 ? '+' : ''}${delta}`);
  };

  // Sync cached count with actual conversations
  const syncUnreadCount = () => {
    const actualCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
    if (totalUnreadCount !== actualCount) {
      console.log(`🔄 Syncing unread count: cached(${totalUnreadCount}) → actual(${actualCount})`);
      setTotalUnreadCount(actualCount);
    }
    setLastUpdateTimestamp(Date.now());
  };

  // Fetch conversations from API (performance optimized)
  const fetchConversations = async () => {
    return queueOperation('fetchConversations', async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getConversations(); // Gets all conversations (active + unmatched)
        setConversations(data);
        
        // Sync unread count after fetching
        syncUnreadCount();
        console.log('✅ Conversations fetched and synced:', data.length);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleNewMessage = (event: NewMessageEvent) => {
      const { conversationId, message } = event.data;
      
      queueOperation(`newMessage-${conversationId}`, () => {
        // Get current user ID to check if message is from them
        const currentUserId = localStorage.getItem('auth_user') 
          ? JSON.parse(localStorage.getItem('auth_user')!).id 
          : null;
        
        const shouldIncrementUnread = message.sender_id !== currentUserId;
        
        // Performance optimization: Update count directly if incrementing
        if (shouldIncrementUnread) {
          updateTotalUnreadCount(+1);
        }
        
        // Update conversation with new message
        setConversations(prev => 
          prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                last_message_at: message.created_at,
                messages: [message],
                unreadCount: shouldIncrementUnread ? (conv.unreadCount || 0) + 1 : conv.unreadCount,
              };
            }
            return conv;
          })
        );
        
        console.log(`📨 New message handled for conversation ${conversationId}`);
      });
    };

    const handleConversationUnmatched = (event: ConversationUnmatchedEvent) => {
      const { conversationId } = event.data;
      
      queueOperation(`unmatch-${conversationId}`, () => {
        // Find conversation to check if it had unread messages
        const conversation = conversations.find(conv => conv.id === conversationId);
        const hadUnreadMessages = conversation && (conversation.unreadCount || 0) > 0;
        
        // Performance optimization: Decrement total count if conversation had unread messages
        if (hadUnreadMessages) {
          updateTotalUnreadCount(-(conversation!.unreadCount || 0));
        }
        
        // Update conversation status to unmatched
        setConversations(prev =>
          prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                status: 'unmatched' as const,
                unreadCount: 0, // Clear unread count for unmatched conversations
              };
            }
            return conv;
          })
        );
        
        console.log(`💔 Conversation ${conversationId} unmatched`);
      });
    };

    const handleMessagesRead = (event: MessagesReadEvent) => {
      const { conversationId } = event.data;
      
      queueOperation(`messagesRead-${conversationId}`, () => {
        // Find conversation to check current unread count
        const conversation = conversations.find(conv => conv.id === conversationId);
        const currentUnreadCount = conversation?.unreadCount || 0;
        
        // Performance optimization: Decrement total count by current unread amount
        if (currentUnreadCount > 0) {
          updateTotalUnreadCount(-currentUnreadCount);
        }
        
        // Reset unread count for this conversation
        setConversations(prev =>
          prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                unreadCount: 0, // Reset unread count when messages are read
              };
            }
            return conv;
          })
        );
        
        console.log(`✅ Messages read for conversation ${conversationId}, cleared ${currentUnreadCount} unread`);
      });
    };

    onNewMessage(handleNewMessage);
    onConversationUnmatched(handleConversationUnmatched);
    onMessagesRead(handleMessagesRead);

    return () => {
      offNewMessage(handleNewMessage);
      offConversationUnmatched(handleConversationUnmatched);
      offMessagesRead(handleMessagesRead);
    };
  }, []);

  // Convert Conversation to Chat format
  const chats = useMemo((): Chat[] => {
    return conversations.map(conv => {
      // Determine which participant is the other user
      const currentUserId = localStorage.getItem('auth_user') 
        ? JSON.parse(localStorage.getItem('auth_user')!).id 
        : null;
      
      const otherParticipant = 
        conv.participantOne.id === currentUserId 
          ? conv.participantTwo 
          : conv.participantOne;

      const profile = otherParticipant.Profile;
      const lastMessage = conv.messages?.[0];

      // Calculate age from birthdate
      const calculateAge = (birthdate: string): number => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };

      return {
        id: parseInt(conv.id.replace(/-/g, '').substring(0, 15), 16), // Convert UUID to number for compatibility
        conversationId: conv.id, // Keep original UUID for API calls
        otherUserId: otherParticipant.id, // Add other participant's user ID for profile fetching
        name: `${profile.first_name} ${profile.last_name}`,
        age: calculateAge(profile.birthdate),
        school: profile.school || '',
        avatar: otherParticipant.UserPhotos?.find(photo => photo.type === 'profile_picture')?.img_link || otherParticipant.UserAlbums?.[0]?.img_link,
        lastMessage: lastMessage?.content || 'Start a conversation!',
        timestamp: lastMessage?.created_at 
          ? new Date(lastMessage.created_at).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : '',
        isRead: conv.unreadCount === 0,
        isArchived: false,
        isUnmatched: conv.status === 'unmatched',
        isNewlyMatched: false, // Could check if created_at is within last 24 hours
        matchedAt: conv.created_at,
        lastResponseAt: conv.last_message_at || undefined,
        unreadCount: conv.unreadCount || 0, // Add unread count
      } as Chat & { conversationId: string; otherUserId: string };
    });
  }, [conversations]);

  // Check if there are active unread conversations (updated recently)
  const hasActiveUnread = () => {
    const isRecent = Date.now() - lastUpdateTimestamp < 5000; // 5 seconds
    return totalUnreadCount > 0 && isRecent;
  };

  return {
    chats,
    conversations,
    isLoading,
    error,
    refetch: fetchConversations,
    // Performance metrics and active status
    totalUnreadCount,
    hasActiveUnread: hasActiveUnread(),
    lastUpdateTimestamp,
    pendingOperationsCount: pendingOperations.size,
  };
};
