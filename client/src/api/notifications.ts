import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

/**
 * Notification API Types
 */

export interface Notification {
  id: string;
  user_id: string;
  type: 'user_liked_you' | 'message_received' | 'mutual_match';
  title: string;
  message: string;
  data?: {
    sender_id?: string;
    like_id?: string;
    message_id?: string;
    conversation_id?: string;
    matched_user_id?: string;
    action_type?: string;
  };
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: Notification[];
  count: number;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export interface GetUnreadCountResponse {
  success: boolean;
  count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  data: Notification;
  message: string;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  updated_count: number;
  message: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: {
    user_liked_you?: number;
    message_received?: number;
    mutual_match?: number;
  };
}

export interface GetStatsResponse {
  success: boolean;
  data: NotificationStats;
}

/**
 * Notification API Functions
 */

/**
 * Get notifications for authenticated user
 * 
 * @param options - Query options
 * @param options.limit - Number of notifications to return (max 50)
 * @param options.offset - Offset for pagination
 * @param options.unread_only - Only return unread notifications
 * @returns Promise with notifications data
 */
export async function getNotifications(options: {
  limit?: number;
  offset?: number;
  unread_only?: boolean;
} = {}): Promise<GetNotificationsResponse> {
  const { limit = 20, offset = 0, unread_only = false } = options;
  
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    unread_only: unread_only.toString(),
  });

  const response = await apiClient.get<GetNotificationsResponse>(
    `${API_ENDPOINTS.NOTIFICATIONS.GET}?${params}`
  );
  return response.data;
}

/**
 * Get unread notification count
 * 
 * @returns Promise with unread count
 */
export async function getUnreadCount(): Promise<GetUnreadCountResponse> {
  const response = await apiClient.get<GetUnreadCountResponse>(
    API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
  );
  return response.data;
}

/**
 * Mark specific notification as read
 * 
 * @param notificationId - UUID of the notification
 * @returns Promise with updated notification data
 */
export async function markAsRead(notificationId: string): Promise<MarkAsReadResponse> {
  const response = await apiClient.patch<MarkAsReadResponse>(
    `${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}/${notificationId}/read`
  );
  return response.data;
}

/**
 * Mark all notifications as read
 * 
 * @returns Promise with updated count
 */
export async function markAllAsRead(): Promise<MarkAllAsReadResponse> {
  const response = await apiClient.patch<MarkAllAsReadResponse>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
  );
  return response.data;
}

/**
 * Get notification statistics
 * 
 * @returns Promise with notification statistics
 */
export async function getNotificationStats(): Promise<GetStatsResponse> {
  const response = await apiClient.get<GetStatsResponse>(
    API_ENDPOINTS.NOTIFICATIONS.STATS
  );
  return response.data;
}
