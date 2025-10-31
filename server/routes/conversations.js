const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { verifyJWT } = require('../middleware/jwt');

/**
 * Conversation Routes
 * All routes require authentication
 */

// Get total unread count (must be before /:conversationId routes)
router.get('/unread/count', verifyJWT, conversationController.getTotalUnreadCount);

// Get all conversations for authenticated user
router.get('/', verifyJWT, conversationController.getUserConversations);

// Get specific conversation by ID
router.get('/:conversationId', verifyJWT, conversationController.getConversationById);

// Unmatch a conversation
router.post('/:conversationId/unmatch', verifyJWT, conversationController.unmatchConversation);

// Get messages for a conversation
router.get('/:conversationId/messages', verifyJWT, conversationController.getConversationMessages);

// Send a message in a conversation
router.post('/:conversationId/messages', verifyJWT, conversationController.sendMessage);

// Mark messages as read in a conversation
router.post('/:conversationId/read', verifyJWT, conversationController.markMessagesAsRead);

module.exports = router;
