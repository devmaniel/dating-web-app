const { Server } = require('socket.io');
const { verifyToken } = require('../utils/tokenManager');

/**
 * Socket.IO Configuration
 * Handles real-time communication for likes and matches
 */

let io;

/**
 * Initialize Socket.IO server
 * 
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.IO server instance
 */
function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      // Attach user info to socket
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userEmail})`);

    // Join user to their personal room for targeted notifications
    socket.join(socket.userId);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });

    // Optional: Handle client-side events
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle typing indicator
    socket.on('typing:start', (data) => {
      const { conversationId, recipientId } = data;
      io.to(recipientId).emit('typing:start', {
        conversationId,
        userId: socket.userId,
      });
    });

    socket.on('typing:stop', (data) => {
      const { conversationId, recipientId } = data;
      io.to(recipientId).emit('typing:stop', {
        conversationId,
        userId: socket.userId,
      });
    });

    // Handle direct message sending via Socket.IO (optional, faster than REST)
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, recipientId } = data;
        const messageService = require('../services/messageService');
        
        // Create message in database
        const message = await messageService.createMessage(conversationId, socket.userId, content);
        
        // Emit to recipient
        io.to(recipientId).emit('new_message', {
          type: 'new_message',
          data: {
            message: message.toJSON(),
            conversationId,
          },
          timestamp: new Date().toISOString(),
        });
        
        // Confirm to sender
        socket.emit('message_sent', {
          success: true,
          message: message.toJSON(),
        });
        
        console.log(`💬 Message sent via Socket.IO from ${socket.userId} to ${recipientId}`);
      } catch (error) {
        console.error('Error sending message via Socket.IO:', error);
        socket.emit('message_error', {
          success: false,
          error: error.message,
        });
      }
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
}

/**
 * Get Socket.IO instance
 * 
 * @returns {Object} Socket.IO server instance
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

/**
 * Emit like notification to receiver
 * 
 * @param {string} receiverId - UUID of user receiving the like
 * @param {Object} likeData - Like data to send
 */
function emitLikeReceived(receiverId, likeData) {
  if (!io) return;

  io.to(receiverId).emit('like:received', {
    type: 'like_received',
    data: likeData,
    timestamp: new Date().toISOString(),
  });

  console.log(`📨 Like notification sent to user: ${receiverId}`);
}

/**
 * Emit like status update to sender
 * 
 * @param {string} senderId - UUID of user who sent the like
 * @param {Object} updateData - Status update data
 */
function emitLikeStatusUpdate(senderId, updateData) {
  if (!io) return;

  io.to(senderId).emit('like:status_updated', {
    type: 'like_status_updated',
    data: updateData,
    timestamp: new Date().toISOString(),
  });

  console.log(`📨 Like status update sent to user: ${senderId}`);
}

/**
 * Emit match notification to both users
 * 
 * @param {string} userAId - UUID of first user
 * @param {string} userBId - UUID of second user
 * @param {Object} matchData - Match data
 */
function emitMatchCreated(userAId, userBId, matchData) {
  if (!io) return;

  // Notify both users
  io.to(userAId).emit('match:created', {
    type: 'match_created',
    data: matchData,
    timestamp: new Date().toISOString(),
  });

  io.to(userBId).emit('match:created', {
    type: 'match_created',
    data: matchData,
    timestamp: new Date().toISOString(),
  });

  console.log(`🎉 Match notification sent to users: ${userAId}, ${userBId}`);
}

/**
 * Emit rejection notification
 * Used when User A rejects User B from Match page
 * If User B had previously liked User A (pending in Liked You), notify User B
 * 
 * @param {string} rejectedUserId - UUID of user who got rejected
 * @param {Object} rejectionData - Rejection data
 */
function emitRejectionNotification(rejectedUserId, rejectionData) {
  if (!io) return;

  io.to(rejectedUserId).emit('like:rejected', {
    type: 'like_rejected',
    data: rejectionData,
    timestamp: new Date().toISOString(),
  });

  console.log(`❌ Rejection notification sent to user: ${rejectedUserId}`);
}

/**
 * Emit new message notification
 * 
 * @param {string} recipientId - UUID of user receiving the message
 * @param {Object} messageData - Message data
 */
function emitNewMessage(recipientId, messageData) {
  if (!io) return;

  io.to(recipientId).emit('new_message', {
    type: 'new_message',
    data: messageData,
    timestamp: new Date().toISOString(),
  });

  console.log(`💬 Message notification sent to user: ${recipientId}`);
}

/**
 * Emit conversation unmatched notification
 * 
 * @param {string} recipientId - UUID of user being notified
 * @param {Object} unmatchData - Unmatch data
 */
function emitConversationUnmatched(recipientId, unmatchData) {
  if (!io) return;

  io.to(recipientId).emit('conversation_unmatched', {
    type: 'conversation_unmatched',
    data: unmatchData,
    timestamp: new Date().toISOString(),
  });

  console.log(`🚫 Unmatch notification sent to user: ${recipientId}`);
}

/**
 * Emit messages read notification
 * 
 * @param {string} recipientId - UUID of user being notified
 * @param {Object} readData - Read data
 */
function emitMessagesRead(recipientId, readData) {
  if (!io) return;

  io.to(recipientId).emit('messages_read', {
    type: 'messages_read',
    data: readData,
    timestamp: new Date().toISOString(),
  });

  console.log(`✓✓ Read receipt sent to user: ${recipientId}`);
}

/**
 * Emit new notification
 * 
 * @param {string} userId - UUID of user receiving the notification
 * @param {Object} notificationData - Notification data
 */
function emitNewNotification(userId, notificationData) {
  if (!io) return;

  io.to(userId).emit('notification:new', {
    type: 'notification_new',
    data: notificationData,
    timestamp: new Date().toISOString(),
  });

  console.log(`🔔 New notification sent to user: ${userId}`);
}

/**
 * Emit notification read status update
 * 
 * @param {string} userId - UUID of user whose notification was read
 * @param {Object} readData - Read data
 */
function emitNotificationRead(userId, readData) {
  if (!io) return;

  io.to(userId).emit('notification:read', {
    type: 'notification_read',
    data: readData,
    timestamp: new Date().toISOString(),
  });

  console.log(`✓ Notification read status sent to user: ${userId}`);
}

module.exports = {
  initializeSocket,
  getIO,
  emitLikeReceived,
  emitLikeStatusUpdate,
  emitMatchCreated,
  emitRejectionNotification,
  emitNewMessage,
  emitConversationUnmatched,
  emitMessagesRead,
  emitNewNotification,
  emitNotificationRead,
};
