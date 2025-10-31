import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

/**
 * Like API Types
 */

export interface SendLikePayload {
  receiver_id: string;
  status?: 'pending' | 'rejected'; // Optional: defaults to 'pending' if not provided
}

export interface SendLikeResponse {
  success: boolean;
  data: {
    id: string;
    sender_id: string;
    receiver_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
  };
  message: string;
}

export interface LikeWithProfile {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    email: string;
    Profile: {
      first_name: string;
      last_name: string;
      gender: string;
      birthdate: string;
      location: string;
      school: string;
      program: string;
      looking_for: string;
      interests: string[];
      music: string[];
      about_me: string | null;
    };
  };
}

export interface GetReceivedLikesResponse {
  success: boolean;
  data: LikeWithProfile[];
  count: number;
}

export interface UpdateLikeStatusPayload {
  status: 'accepted' | 'rejected';
}

export interface UpdateLikeStatusResponse {
  success: boolean;
  data: {
    id: string;
    sender_id: string;
    receiver_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    updated_at: string;
  };
  message: string;
}

/**
 * Like API Functions
 */

/**
 * Send a like to another user
 * 
 * @param payload - { receiver_id: string }
 * @returns Promise with like data
 */
export async function sendLike(payload: SendLikePayload): Promise<SendLikeResponse> {
  const response = await apiClient.post<SendLikeResponse>(
    API_ENDPOINTS.LIKES.SEND,
    payload
  );
  return response.data;
}

/**
 * Get count of pending likes received (lightweight)
 * 
 * @returns Promise with count
 */
export async function getReceivedLikesCount(): Promise<{ success: boolean; count: number }> {
  const response = await apiClient.get<{ success: boolean; count: number }>(
    `${API_ENDPOINTS.LIKES.RECEIVED}/count`
  );
  return response.data;
}

/**
 * Get all likes received by authenticated user (pending only)
 * 
 * @returns Promise with array of likes with sender profiles
 */
export async function getReceivedLikes(): Promise<GetReceivedLikesResponse> {
  const response = await apiClient.get<GetReceivedLikesResponse>(
    API_ENDPOINTS.LIKES.RECEIVED
  );
  return response.data;
}

/**
 * Get all likes sent by authenticated user
 * 
 * @returns Promise with array of sent likes
 */
export async function getSentLikes(): Promise<GetReceivedLikesResponse> {
  const response = await apiClient.get<GetReceivedLikesResponse>(
    API_ENDPOINTS.LIKES.SENT
  );
  return response.data;
}

/**
 * Update like status (accept or reject)
 * 
 * @param likeId - UUID of the like
 * @param payload - { status: 'accepted' | 'rejected' }
 * @returns Promise with updated like data
 */
export async function updateLikeStatus(
  likeId: string,
  payload: UpdateLikeStatusPayload
): Promise<UpdateLikeStatusResponse> {
  const response = await apiClient.patch<UpdateLikeStatusResponse>(
    `${API_ENDPOINTS.LIKES.UPDATE}/${likeId}`,
    payload
  );
  return response.data;
}
