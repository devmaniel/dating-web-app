import { useMemo } from 'react';
import { useChats } from './useChats';

export const useChat = (chatId: number) => {
  const { chats } = useChats();
  
  const chat = useMemo(() => {
    return chats.find(c => c.id === chatId);
  }, [chatId, chats]);

  return { chat };
};
