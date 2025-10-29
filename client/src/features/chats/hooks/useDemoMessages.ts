import { useCallback, useEffect, useState, useRef } from 'react';
import type { Message } from '../data/types';
import { mockMessages } from '../data';

interface DemoMessage {
  content: string;
  delay: number; // in seconds
}

const demoResponses: Record<number, DemoMessage[]> = {
  6: [ // Emma Thompson
    { content: "Hello", delay: 2 },
    { content: "Yeah", delay: 2 },
    { content: "Sure", delay: 2 },
  ]
};

export const useDemoMessages = (chatId: number) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize with existing mock messages for this chat
    return mockMessages.filter(m => m.chatId === chatId);
  });
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
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
  }, [chatId, messageInput]);
  
  // Handle automated responses
  useEffect(() => {
    if (demoResponses[chatId] && messages.length > 0) {
      // Check if the last message was sent by 'me' (user)
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'me') {
        // Calculate which response we should send
        const userMessageCount = messages.filter(m => m.sender === 'me').length;
        
        // Check if there's a response for this message
        if (userMessageCount <= demoResponses[chatId].length) {
          const responseIndex = userMessageCount - 1;
          const response = demoResponses[chatId][responseIndex];
          
          // Schedule the response
          const timer = setTimeout(() => {
            // Create a new message
            const newMessage: Message = {
              id: Date.now() + 1, // Ensure unique ID
              chatId,
              sender: 'them',
              content: response.content,
              timestamp: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
            };
            
            // Add the message to the existing messages
            setMessages(prev => [...prev, newMessage]);
          }, response.delay * 1000);
          
          return () => clearTimeout(timer);
        }
      }
    }
  }, [chatId, messages]);
  
  return {
    messages,
    messageInput,
    setMessageInput,
    messagesEndRef,
    handleSendMessage,
  };
};
