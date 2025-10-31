const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyJWT } = require('../middleware/jwt');

/**
 * Notification Routes
 * All routes are protected with JWT authentication
 * Base path: /api/notifications
 */

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for authenticated user
 * @access  Protected
 * @query   { limit?: number, offset?: number, unread_only?: boolean }
 * @returns { success: true, data: notifications[], count: number, pagination: object }
 */
router.get('/', verifyJWT, notificationController.getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count for authenticated user
 * @access  Protected
 * @returns { success: true, count: number }
 */
router.get('/unread-count', verifyJWT, notificationController.getUnreadCount);

/**
 * @route   GET /api/notifications/stats
 * @desc    Get notification statistics for authenticated user
 * @access  Protected
 * @returns { success: true, data: stats }
 */
router.get('/stats', verifyJWT, notificationController.getStats);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark specific notification as read
 * @access  Protected (must be notification owner)
 * @params  { id: string } - Notification UUID
 * @returns { success: true, data: notification }
 */
router.patch('/:id/read', verifyJWT, notificationController.markAsRead);

/**
 * @route   PATCH /api/notifications/mark-all-read
 * @desc    Mark all notifications as read for authenticated user
 * @access  Protected
 * @returns { success: true, updated_count: number }
 */
router.patch('/mark-all-read', verifyJWT, notificationController.markAllAsRead);

module.exports = router;
