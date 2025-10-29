import { useState, useEffect, useRef } from 'react';
import { mockMessages } from '../data';
import type { Message } from '../data/types';
import { mockChats } from '../data/mockChats';
import { useNewChatsStore } from '@/shared/stores/newChatsStore';

export const useMessages = (chatId: number) => {
  const { getNewChats } = useNewChatsStore();
  const [messages, setMessages] = useState<Message[]>(
    mockMessages.filter((m: Message) => m.chatId === chatId)
  );
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;
    
    // Check if chat is archived or unmatched
    let chat = mockChats.find(c => c.id === chatId);
    
    // If not found in mock chats, check new chats
    if (!chat) {
      const newChats = getNewChats();
      chat = newChats.find(c => c.id === chatId);
    }
    
    if (chat?.isArchived || chat?.isUnmatched) return;

    const newMessage: Message = {
      id: Date.now(),
      chatId,
      sender: 'me',
      content: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // TODO: Send message to API
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    messagesEndRef,
    handleSendMessage,
  };
};
