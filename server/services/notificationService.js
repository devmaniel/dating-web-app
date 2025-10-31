const { Notification, User, Profile } = require('../models/index_sequelize');
const { Op } = require('sequelize');

/**
 * Notification Service
 * Business logic for handling user notifications
 */

/**
 * Notification type constants
 */
const NOTIFICATION_TYPES = {
  USER_LIKED_YOU: 'user_liked_you',
  MESSAGE_RECEIVED: 'message_received',
  MUTUAL_MATCH: 'mutual_match',
};

/**
 * Create a new notification
 * 
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.user_id - User ID to send notification to
 * @param {string} notificationData.type - Notification type
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {Object} [notificationData.data] - Additional data
 * @returns {Promise<Object>} Created notification record
 * @throws {Error} If user doesn't exist or validation fails
 */
async function createNotification(notificationData) {
  const { user_id, type, title, message, data } = notificationData;

  // Validate notification type
  if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
    const error = new Error(`Invalid notification type: ${type}`);
    error.code = 'INVALID_NOTIFICATION_TYPE';
    throw error;
  }

  // Check if user exists
  const user = await User.findByPk(user_id);
  if (!user) {
    const error = new Error('User not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // Create notification
  const notification = await Notification.create({
    user_id,
    type,
    title,
    message,
    data: data || null,
    is_read: false,
  });

  return notification;
}

/**
 * Create "User Liked You" notification
 * 
 * @param {string} receiverId - User who received the like
 * @param {string} senderId - User who sent the like
 * @param {string} senderName - Name of the user who sent the like
 * @param {string} likeId - ID of the like record
 * @returns {Promise<Object>} Created notification
 */
async function createUserLikedYouNotification(receiverId, senderId, senderName, likeId) {
  return await createNotification({
    user_id: receiverId,
    type: NOTIFICATION_TYPES.USER_LIKED_YOU,
    title: 'Someone liked you!',
    message: `${senderName} liked you`,
    data: {
      sender_id: senderId,
      like_id: likeId,
      action_type: 'like_received',
    },
  });
}

/**
 * Create "Mutual Match" notification
 * 
 * @param {string} userId - User to notify
 * @param {string} matchedUserId - User they matched with
 * @param {string} matchedUserName - Name of the matched user
 * @param {string} conversationId - ID of the created conversation
 * @returns {Promise<Object>} Created notification
 */
async function createMutualMatchNotification(userId, matchedUserId, matchedUserName, conversationId) {
  return await createNotification({
    user_id: userId,
    type: NOTIFICATION_TYPES.MUTUAL_MATCH,
    title: 'It\'s a match!',
    message: `You and ${matchedUserName} liked each other. Start chatting now!`,
    data: {
      matched_user_id: matchedUserId,
      conversation_id: conversationId,
      action_type: 'mutual_match',
    },
  });
}

/**
 * Create "Message Received" notification
 * 
 * @param {string} receiverId - User who received the message
 * @param {string} senderId - User who sent the message
 * @param {string} senderName - Name of the message sender
 * @param {string} messageId - ID of the message
 * @param {string} conversationId - ID of the conversation
 * @param {boolean} isFirstMessage - Whether this is the first message in conversation
 * @returns {Promise<Object>} Created notification
 */
async function createMessageReceivedNotification(receiverId, senderId, senderName, messageId, conversationId, isFirstMessage = false) {
  const title = isFirstMessage ? 'First message!' : 'New message';
  const message = isFirstMessage 
    ? `${senderName} sent you their first message` 
    : `${senderName} sent you a message`;

  return await createNotification({
    user_id: receiverId,
    type: NOTIFICATION_TYPES.MESSAGE_RECEIVED,
    title,
    message,
    data: {
      sender_id: senderId,
      message_id: messageId,
      conversation_id: conversationId,
      action_type: isFirstMessage ? 'first_message' : 'message_received',
      is_first_message: isFirstMessage,
    },
  });
}

/**
 * Get notifications for a user
 * 
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} [options.limit=20] - Limit number of results
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {boolean} [options.unreadOnly=false] - Only return unread notifications
 * @returns {Promise<Object[]>} User notifications
 */
async function getUserNotifications(userId, options = {}) {
  const { limit = 20, offset = 0, unreadOnly = false } = options;
  
  const whereClause = { user_id: userId };
  if (unreadOnly) {
    whereClause.is_read = false;
  }

  const notifications = await Notification.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return notifications;
}

/**
 * Get unread notification count for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<number>} Unread notification count
 */
async function getUnreadCount(userId) {
  const count = await Notification.count({
    where: {
      user_id: userId,
      is_read: false,
    },
  });

  return count;
}

/**
 * Mark all notifications as read for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of updated notifications
 */
async function markAllAsRead(userId) {
  const [updatedCount] = await Notification.update(
    { is_read: true },
    {
      where: {
        user_id: userId,
        is_read: false,
      },
    }
  );

  return updatedCount;
}

/**
 * Mark specific notification as read
 * 
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID (for security)
 * @returns {Promise<Object|null>} Updated notification or null if not found
 */
async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      user_id: userId,
    },
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.code = 'NOTIFICATION_NOT_FOUND';
    throw error;
  }

  if (notification.is_read) {
    const error = new Error('Notification already read');
    error.code = 'NOTIFICATION_ALREADY_READ';
    throw error;
  }

  notification.is_read = true;
  await notification.save();
  
  return notification;
}

/**
 * Delete old notifications (cleanup)
 * 
 * @param {number} daysOld - Delete notifications older than this many days
 * @returns {Promise<number>} Number of deleted notifications
 */
async function deleteOldNotifications(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const deletedCount = await Notification.destroy({
    where: {
      created_at: {
        [Op.lt]: cutoffDate,
      },
    },
  });

  return deletedCount;
}

/**
 * Get notification statistics for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Notification statistics
 */
async function getNotificationStats(userId) {
  const [total, unread, byType] = await Promise.all([
    // Total notifications
    Notification.count({
      where: { user_id: userId },
    }),
    
    // Unread notifications
    Notification.count({
      where: { user_id: userId, is_read: false },
    }),
    
    // Count by type
    Notification.findAll({
      where: { user_id: userId },
      attributes: [
        'type',
        [Notification.sequelize.fn('COUNT', Notification.sequelize.col('id')), 'count'],
      ],
      group: ['type'],
      raw: true,
    }),
  ]);

  return {
    total,
    unread,
    read: total - unread,
    byType: byType.reduce((acc, item) => {
      acc[item.type] = parseInt(item.count);
      return acc;
    }, {}),
  };
}

module.exports = {
  NOTIFICATION_TYPES,
  createNotification,
  createUserLikedYouNotification,
  createMutualMatchNotification,
  createMessageReceivedNotification,
  getUserNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  deleteOldNotifications,
  getNotificationStats,
};
