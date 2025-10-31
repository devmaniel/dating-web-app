import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessages, sendMessage, markMessagesAsRead } from '@/api/message';
import { onNewMessage, offNewMessage, type NewMessageEvent } from '@/shared/services/socket';
import type { Message } from '../data/types';

/**
 * Hook to fetch and manage messages for a specific conversation
 * Converts API Message format to local Message format for compatibility
 */
export const useChatMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user ID
  const currentUserId = localStorage.getItem('auth_user') 
    ? JSON.parse(localStorage.getItem('auth_user')!).id 
    : null;

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMessages(conversationId, 50, 0);
      
      // Convert API messages to local format
      const formattedMessages: Message[] = data.reverse().map(msg => ({
        id: parseInt(msg.id.replace(/-/g, '').substring(0, 15), 16),
        chatId: parseInt(conversationId.replace(/-/g, '').substring(0, 15), 16),
        sender: msg.sender_id === currentUserId ? 'me' : 'them',
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      }));

      setMessages(formattedMessages);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, currentUserId]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Listen for new messages in real-time
  useEffect(() => {
    const handleNewMessage = (event: NewMessageEvent) => {
      const { message, conversationId: msgConvId } = event.data;
      
      // Only add message if it's for this conversation
      if (msgConvId === conversationId) {
        const newMessage: Message = {
          id: parseInt(message.id.replace(/-/g, '').substring(0, 15), 16),
          chatId: parseInt(conversationId.replace(/-/g, '').substring(0, 15), 16),
          sender: message.sender_id === currentUserId ? 'me' : 'them',
          content: message.content,
          timestamp: new Date(message.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        };

        setMessages(prev => [...prev, newMessage]);

        // Auto-mark as read if we're viewing this conversation and it's from the other user
        if (message.sender_id !== currentUserId) {
          markMessagesAsRead(conversationId);
        }
      }
    };

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage(handleNewMessage);
    };
  }, [conversationId, currentUserId]);

  // Auto-scroll to latest message
  useEffect(() => {
    // Use instant scroll on initial load, smooth on updates
    const behavior = messages.length > 0 && !isLoading ? 'smooth' : 'auto';
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [messages, isLoading]);

  // Mark messages as read when user focuses on the page/tab
  useEffect(() => {
    const handleFocus = () => {
      // Mark messages as read when user focuses back on the page
      markMessagesAsRead(conversationId);
    };

    const handleVisibilityChange = () => {
      // Mark messages as read when page becomes visible
      if (!document.hidden) {
        markMessagesAsRead(conversationId);
      }
    };

    // Add event listeners for focus and visibility changes
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [conversationId]);

  // Scroll to bottom immediately when component mounts
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [isLoading]);

  // Mark messages as read when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Mark messages as read when leaving the conversation
      markMessagesAsRead(conversationId);
    };
  }, [conversationId]);

  // Send message handler
  // Sends via REST API, receives updates via Socket.IO for real-time delivery
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || isSending) return;

    const content = messageInput.trim();
    
    try {
      setIsSending(true);
      
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        id: Date.now(),
        chatId: parseInt(conversationId.replace(/-/g, '').substring(0, 15), 16),
        sender: 'me',
        content,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setMessageInput('');

      // Send to API (backend will emit Socket.IO event to recipient)
      const sentMessage = await sendMessage(conversationId, content);

      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id 
            ? {
                ...msg,
                id: parseInt(sentMessage.id.replace(/-/g, '').substring(0, 15), 16),
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
      
      // Restore message input
      setMessageInput(content);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    messagesEndRef,
    handleSendMessage,
    isLoading,
    isSending,
    error,
    refetch: fetchMessages,
  };
};
