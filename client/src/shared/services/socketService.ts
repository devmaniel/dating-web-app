import { io, Socket } from 'socket.io-client';
import { notificationService } from './notificationService';
import type { Notification } from '@/api/notifications';

/**
 * Socket.IO client service for real-time communication
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize socket connection
   * @param token - JWT token for authentication
   */
  public connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect socket
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('Socket disconnected');
    }
  }

  /**
   * Check if socket is connected
   */
  public get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    // Notification events
    this.socket.on('notification:new', (data) => {
      console.log('🔔 Socket received notification:new event:', data);
      if (data.data) {
        console.log('📨 Passing notification to service:', data.data);
        notificationService.handleNewNotification(data.data as Notification);
      } else {
        console.warn('⚠️ Notification event received but no data:', data);
      }
    });

    this.socket.on('notification:read', (data) => {
      console.log('✓ Notification read status updated:', data);
      if (data.data) {
        notificationService.handleNotificationRead(data.data);
      }
    });

    // Like events (for backward compatibility)
    this.socket.on('like:received', (data) => {
      console.log('💖 Like received:', data);
      // This will be handled by the new notification system
    });

    this.socket.on('like:status_update', (data) => {
      console.log('💖 Like status updated:', data);
      // This will be handled by the new notification system
    });

    this.socket.on('match:created', (data) => {
      console.log('🎉 Match created:', data);
      // This will be handled by the new notification system
    });

    // Message events
    this.socket.on('new_message', (data) => {
      console.log('💬 New message received:', data);
      // This will be handled by the new notification system
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Emit an event to the server
   * @param event - Event name
   * @param data - Event data
   */
  public emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  /**
   * Join a room
   * @param room - Room name
   */
  public joinRoom(room: string) {
    this.emit('join_room', { room });
  }

  /**
   * Leave a room
   * @param room - Room name
   */
  public leaveRoom(room: string) {
    this.emit('leave_room', { room });
  }

  /**
   * Get socket instance (for advanced usage)
   */
  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
