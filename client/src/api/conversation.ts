import apiClient from './client';

/**
 * Conversation API
 * Handles all conversation-related API calls
 */

export interface ConversationParticipant {
  id: string;
  email: string;
  Profile: {
    first_name: string;
    last_name: string;
    gender: string;
    birthdate: string;
    location?: string;
    school?: string;
    program?: string;
    about_me?: string;
  };
  UserPhotos?: Array<{
    img_link: string;
    type: string;
  }>;
  UserAlbums?: Array<{
    img_link: string;
    position: number;
  }>;
}

export interface LastMessage {
  id: string;
  content: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  status: 'active' | 'unmatched';
  liked_you_id: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  participantOne: ConversationParticipant;
  participantTwo: ConversationParticipant;
  messages?: LastMessage[];
  unreadCount?: number;
}

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

export interface ConversationResponse {
  success: boolean;
  data: Conversation;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

/**
 * Get all conversations for the authenticated user
 * @param status - Filter by status: 'active' or 'unmatched'
 */
export async function getConversations(status?: 'active' | 'unmatched'): Promise<Conversation[]> {
  const params = status ? { status } : {};
  const response = await apiClient.get<ConversationsResponse>('/conversations', { params });
  return response.data.data;
}

/**
 * Get a specific conversation by ID
 * @param conversationId - UUID of the conversation
 */
export async function getConversationById(conversationId: string): Promise<Conversation> {
  const response = await apiClient.get<ConversationResponse>(`/conversations/${conversationId}`);
  return response.data.data;
}

/**
 * Unmatch a conversation
 * @param conversationId - UUID of the conversation
 */
export async function unmatchConversation(conversationId: string): Promise<Conversation> {
  const response = await apiClient.post<ConversationResponse>(
    `/conversations/${conversationId}/unmatch`
  );
  return response.data.data;
}

/**
 * Get total unread message count
 */
export async function getTotalUnreadCount(): Promise<number> {
  const response = await apiClient.get<UnreadCountResponse>('/conversations/unread/count');
  return response.data.data.count;
}
