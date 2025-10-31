import apiClient from './client';

/**
 * Message API
 * Handles all message-related API calls
 */

export interface MessageSender {
  id: string;
  email: string;
  Profile: {
    first_name: string;
    last_name: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: MessageSender;
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
}

export interface MessageResponse {
  success: boolean;
  data: Message;
  message?: string;
}

export interface MarkReadResponse {
  success: boolean;
  data: {
    updatedCount: number;
  };
  message?: string;
}

/**
 * Get messages for a conversation
 * @param conversationId - UUID of the conversation
 * @param limit - Number of messages to retrieve (default: 50)
 * @param offset - Number of messages to skip (default: 0)
 */
export async function getMessages(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  const response = await apiClient.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`,
    {
      params: { limit, offset },
    }
  );
  return response.data.data;
}

/**
 * Send a message in a conversation
 * @param conversationId - UUID of the conversation
 * @param content - Message content
 */
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const response = await apiClient.post<MessageResponse>(
    `/conversations/${conversationId}/messages`,
    { content }
  );
  return response.data.data;
}

/**
 * Mark messages as read in a conversation
 * @param conversationId - UUID of the conversation
 */
export async function markMessagesAsRead(conversationId: string): Promise<number> {
  const response = await apiClient.post<MarkReadResponse>(
    `/conversations/${conversationId}/read`
  );
  return response.data.data.updatedCount;
}
