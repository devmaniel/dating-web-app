const notificationService = require('../services/notificationService');
const { emitNotificationRead } = require('../socket');

/**
 * Notification Controller
 * Handles HTTP requests for notification operations
 */

/**
 * Get notifications for authenticated user
 * 
 * @route GET /api/notifications
 * @access Protected (JWT required)
 * 
 * @param {Object} req.query
 * @param {number} [req.query.limit=20] - Number of notifications to return
 * @param {number} [req.query.offset=0] - Offset for pagination
 * @param {boolean} [req.query.unread_only=false] - Only return unread notifications
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, data: notifications[], count: number }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * GET /api/notifications?limit=10&offset=0&unread_only=true
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 'notification-uuid',
 *       type: 'user_liked_you',
 *       title: 'Someone liked you!',
 *       message: 'John liked you',
 *       data: { sender_id: 'user-uuid', like_id: 'like-uuid' },
 *       is_read: false,
 *       created_at: '2025-10-31T10:00:00.000Z'
 *     }
 *   ],
 *   count: 1,
 *   pagination: {
 *     limit: 10,
 *     offset: 0,
 *     total: 1
 *   }
 * }
 */
async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const { 
      limit = 20, 
      offset = 0, 
      unread_only = false 
    } = req.query;

    // Parse query parameters
    const parsedLimit = Math.min(parseInt(limit) || 20, 50); // Max 50 notifications
    const parsedOffset = parseInt(offset) || 0;
    const unreadOnly = unread_only === 'true';

    // Get notifications
    const notifications = await notificationService.getUserNotifications(userId, {
      limit: parsedLimit,
      offset: parsedOffset,
      unreadOnly,
    });

    // Get total count for pagination
    const totalCount = unreadOnly 
      ? await notificationService.getUnreadCount(userId)
      : await notificationService.getNotificationStats(userId).then(stats => stats.total);

    return res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
        total: totalCount,
        has_more: parsedOffset + notifications.length < totalCount,
      },
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch notifications',
    });
  }
}

/**
 * Get unread notification count for authenticated user
 * 
 * @route GET /api/notifications/unread-count
 * @access Protected (JWT required)
 * 
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, count: number }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * GET /api/notifications/unread-count
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   count: 3
 * }
 */
async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id;

    const count = await notificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error in getUnreadCount:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch unread count',
    });
  }
}

/**
 * Mark specific notification as read
 * 
 * @route PATCH /api/notifications/:id/read
 * @access Protected (JWT required)
 * 
 * @param {string} req.params.id - UUID of the notification
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, data: notification }
 * @returns {Object} 400 - { success: false, error: 'notification_already_read' }
 * @returns {Object} 404 - { success: false, error: 'notification_not_found' }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * PATCH /api/notifications/notification-uuid/read
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   data: {
 *     id: 'notification-uuid',
 *     is_read: true,
 *     updated_at: '2025-10-31T10:05:00.000Z'
 *   },
 *   message: 'Notification marked as read'
 * }
 */
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate notification ID
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'missing_notification_id',
        message: 'Notification ID is required',
      });
    }

    const notification = await notificationService.markAsRead(id, userId);

    // Emit real-time notification read status
    try {
      emitNotificationRead(userId, {
        notificationId: id,
        isRead: true,
      });
    } catch (socketError) {
      console.error('Socket.IO emit error:', socketError);
      // Don't fail the request if socket emit fails
    }

    return res.status(200).json({
      success: true,
      data: notification,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);

    // Handle specific error codes
    if (error.code === 'NOTIFICATION_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'notification_not_found',
        message: error.message,
      });
    }

    if (error.code === 'NOTIFICATION_ALREADY_READ') {
      return res.status(400).json({
        success: false,
        error: 'notification_already_read',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to mark notification as read',
    });
  }
}

/**
 * Mark all notifications as read for authenticated user
 * 
 * @route PATCH /api/notifications/mark-all-read
 * @access Protected (JWT required)
 * 
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, updated_count: number }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * PATCH /api/notifications/mark-all-read
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   updated_count: 5,
 *   message: '5 notifications marked as read'
 * }
 */
async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;

    const updatedCount = await notificationService.markAllAsRead(userId);

    // Emit real-time notification read status for all notifications
    try {
      emitNotificationRead(userId, {
        allRead: true,
        updatedCount,
      });
    } catch (socketError) {
      console.error('Socket.IO emit error:', socketError);
      // Don't fail the request if socket emit fails
    }

    return res.status(200).json({
      success: true,
      updated_count: updatedCount,
      message: `${updatedCount} notifications marked as read`,
    });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to mark all notifications as read',
    });
  }
}

/**
 * Get notification statistics for authenticated user
 * 
 * @route GET /api/notifications/stats
 * @access Protected (JWT required)
 * 
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, data: stats }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * GET /api/notifications/stats
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   data: {
 *     total: 10,
 *     unread: 3,
 *     read: 7,
 *     byType: {
 *       user_liked_you: 5,
 *       message_received: 3,
 *       mutual_match: 2
 *     }
 *   }
 * }
 */
async function getStats(req, res) {
  try {
    const userId = req.user.id;

    const stats = await notificationService.getNotificationStats(userId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in getStats:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch notification statistics',
    });
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getStats,
};
