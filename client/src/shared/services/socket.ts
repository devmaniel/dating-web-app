import { io, Socket } from 'socket.io-client';

/**
 * Socket.IO Client Service
 * Handles real-time communication with the server
 */

let socket: Socket | null = null;

/**
 * Socket event types
 */
export interface LikeReceivedEvent {
  type: 'like_received';
  data: {
    likeId: string;
    senderId: string;
    status: string;
    createdAt: string;
  };
  timestamp: string;
}

export interface LikeStatusUpdatedEvent {
  type: 'like_status_updated';
  data: {
    likeId: string;
    receiverId: string;
    status: string;
    updatedAt: string;
  };
  timestamp: string;
}

export interface MatchCreatedEvent {
  type: 'match_created';
  data: {
    matchId: string;
    userId: string;
    matchedUserId: string;
    createdAt: string;
  };
  timestamp: string;
}

export interface LikeRejectedEvent {
  type: 'like_rejected';
  data: {
    rejectedBy: string;
    likeId: string;
    timestamp: string;
  };
  timestamp: string;
}

export interface NewMessageEvent {
  type: 'new_message';
  data: {
    message: {
      id: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      is_read: boolean;
      created_at: string;
    };
    conversationId: string;
  };
  timestamp: string;
}

export interface ConversationUnmatchedEvent {
  type: 'conversation_unmatched';
  data: {
    conversationId: string;
    unmatchedBy: string;
  };
  timestamp: string;
}

export interface MessagesReadEvent {
  type: 'messages_read';
  data: {
    conversationId: string;
    readBy: string;
  };
  timestamp: string;
}

export interface TypingStartEvent {
  conversationId: string;
  userId: string;
}

export interface TypingStopEvent {
  conversationId: string;
  userId: string;
}

/**
 * Initialize Socket.IO connection
 * 
 * @param token - JWT authentication token
 * @returns Socket instance
 */
export function initializeSocket(token: string): Socket {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  socket = io(serverUrl, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket.IO connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.IO disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error.message);
  });

  return socket;
}

/**
 * Get current socket instance
 * 
 * @returns Socket instance or null
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Check if socket is initialized and connected
 * 
 * @returns true if socket is initialized and connected
 */
export function isSocketReady(): boolean {
  return socket !== null && socket.connected;
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
}

/**
 * Listen for like received events
 * 
 * @param callback - Function to call when event is received
 */
export function onLikeReceived(callback: (event: LikeReceivedEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('like:received', callback);
}

/**
 * Listen for like status update events
 * 
 * @param callback - Function to call when event is received
 */
export function onLikeStatusUpdated(callback: (event: LikeStatusUpdatedEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('like:status_updated', callback);
}

/**
 * Listen for match created events
 * 
 * @param callback - Function to call when event is received
 */
export function onMatchCreated(callback: (event: MatchCreatedEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('match:created', callback);
}

/**
 * Remove listener for like received events
 */
export function offLikeReceived(callback?: (event: LikeReceivedEvent) => void): void {
  if (!socket) return;
  socket.off('like:received', callback);
}

/**
 * Remove listener for like status update events
 */
export function offLikeStatusUpdated(callback?: (event: LikeStatusUpdatedEvent) => void): void {
  if (!socket) return;
  socket.off('like:status_updated', callback);
}

/**
 * Remove listener for match created events
 */
export function offMatchCreated(callback?: (event: MatchCreatedEvent) => void): void {
  if (!socket) return;
  socket.off('match:created', callback);
}

/**
 * Listen for like rejection events
 * 
 * @param callback - Function to call when event is received
 */
export function onLikeRejected(callback: (event: LikeRejectedEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('like:rejected', callback);
}

/**
 * Remove listener for like rejection events
 */
export function offLikeRejected(callback?: (event: LikeRejectedEvent) => void): void {
  if (!socket) return;
  socket.off('like:rejected', callback);
}

/**
 * Listen for new message events
 * 
 * @param callback - Function to call when event is received
 */
export function onNewMessage(callback: (event: NewMessageEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('new_message', callback);
}

/**
 * Remove listener for new message events
 */
export function offNewMessage(callback?: (event: NewMessageEvent) => void): void {
  if (!socket) return;
  socket.off('new_message', callback);
}

/**
 * Listen for conversation unmatched events
 * 
 * @param callback - Function to call when event is received
 */
export function onConversationUnmatched(callback: (event: ConversationUnmatchedEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('conversation_unmatched', callback);
}

/**
 * Remove listener for conversation unmatched events
 */
export function offConversationUnmatched(callback?: (event: ConversationUnmatchedEvent) => void): void {
  if (!socket) return;
  socket.off('conversation_unmatched', callback);
}

/**
 * Listen for messages read events
 * 
 * @param callback - Function to call when event is received
 */
export function onMessagesRead(callback: (event: MessagesReadEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('messages_read', callback);
}

/**
 * Remove listener for messages read events
 */
export function offMessagesRead(callback?: (event: MessagesReadEvent) => void): void {
  if (!socket) return;
  socket.off('messages_read', callback);
}

/**
 * Listen for typing start events
 * 
 * @param callback - Function to call when event is received
 */
export function onTypingStart(callback: (event: TypingStartEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('typing:start', callback);
}

/**
 * Remove listener for typing start events
 */
export function offTypingStart(callback?: (event: TypingStartEvent) => void): void {
  if (!socket) return;
  socket.off('typing:start', callback);
}

/**
 * Listen for typing stop events
 * 
 * @param callback - Function to call when event is received
 */
export function onTypingStop(callback: (event: TypingStopEvent) => void): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.on('typing:stop', callback);
}

/**
 * Remove listener for typing stop events
 */
export function offTypingStop(callback?: (event: TypingStopEvent) => void): void {
  if (!socket) return;
  socket.off('typing:stop', callback);
}

/**
 * Emit typing start event
 * 
 * @param conversationId - UUID of the conversation
 * @param recipientId - UUID of the recipient
 */
export function emitTypingStart(conversationId: string, recipientId: string): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.emit('typing:start', { conversationId, recipientId });
}

/**
 * Emit typing stop event
 * 
 * @param conversationId - UUID of the conversation
 * @param recipientId - UUID of the recipient
 */
export function emitTypingStop(conversationId: string, recipientId: string): void {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  socket.emit('typing:stop', { conversationId, recipientId });
}
