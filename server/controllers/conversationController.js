const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');
const notificationService = require('../services/notificationService');
const { emitNewMessage, emitConversationUnmatched, emitMessagesRead, emitNewNotification } = require('../socket');
const { User, Profile } = require('../models/index_sequelize');

/**
 * Conversation Controller
 * HTTP handlers for conversation-related endpoints
 */

/**
 * Get all conversations for the authenticated user
 * GET /api/conversations
 * Query params: status (optional) - 'active' or 'unmatched'
 */
async function getUserConversations(req, res) {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    // Validate status if provided
    if (status && !['active', 'unmatched'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'invalid_status',
        message: 'Status must be "active" or "unmatched"',
      });
    }

    const conversations = await conversationService.getUserConversations(userId, status || null);

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await messageService.getUnreadCount(conversation.id, userId);
        return {
          ...conversation.toJSON(),
          unreadCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: conversationsWithUnread,
    });
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch conversations',
    });
  }
}

/**
 * Get a specific conversation by ID
 * GET /api/conversations/:conversationId
 */
async function getConversationById(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Check if user is participant
    const isParticipant = await conversationService.isParticipant(conversationId, userId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'not_authorized',
        message: 'Not authorized to view this conversation',
      });
    }

    const conversation = await conversationService.getConversationById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'conversation_not_found',
        message: 'Conversation not found',
      });
    }

    // Add unread count
    const unreadCount = await messageService.getUnreadCount(conversationId, userId);

    return res.status(200).json({
      success: true,
      data: {
        ...conversation.toJSON(),
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Error in getConversationById:', error);

    if (error.code === 'CONVERSATION_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'conversation_not_found',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch conversation',
    });
  }
}

/**
 * Unmatch a conversation
 * POST /api/conversations/:conversationId/unmatch
 */
async function unmatchConversation(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await conversationService.unmatchConversation(conversationId, userId);

    // Emit socket event to other participant
    const otherParticipantId = await conversationService.getOtherParticipant(conversationId, userId);
    
    // Send real-time notification
    emitConversationUnmatched(otherParticipantId, {
      conversationId: conversation.id,
      unmatchedBy: userId,
    });

    return res.status(200).json({
      success: true,
      data: conversation,
      message: 'Conversation unmatched successfully',
    });
  } catch (error) {
    console.error('Error in unmatchConversation:', error);

    if (error.code === 'CONVERSATION_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'conversation_not_found',
        message: error.message,
      });
    }

    if (error.code === 'NOT_AUTHORIZED') {
      return res.status(403).json({
        success: false,
        error: 'not_authorized',
        message: error.message,
      });
    }

    if (error.code === 'ALREADY_UNMATCHED') {
      return res.status(400).json({
        success: false,
        error: 'already_unmatched',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to unmatch conversation',
    });
  }
}

/**
 * Get messages for a conversation
 * GET /api/conversations/:conversationId/messages
 * Query params: limit (default: 50), offset (default: 0)
 */
async function getConversationMessages(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Check if user is participant
    const isParticipant = await conversationService.isParticipant(conversationId, userId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'not_authorized',
        message: 'Not authorized to view messages in this conversation',
      });
    }

    const messages = await messageService.getConversationMessages(
      conversationId,
      parseInt(limit),
      parseInt(offset)
    );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch messages',
    });
  }
}

/**
 * Send a message in a conversation
 * POST /api/conversations/:conversationId/messages
 * Body: { content: string }
 */
async function sendMessage(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'missing_content',
        message: 'Message content is required',
      });
    }

    // Check if this is the first message in the conversation
    const messageCount = await messageService.getMessageCount(conversationId);
    const isFirstMessage = messageCount === 0;

    const message = await messageService.createMessage(conversationId, userId, content);

    // Get other participant
    const otherParticipantId = await conversationService.getOtherParticipant(conversationId, userId);
    
    // If this is the first message, create a "First Message" notification
    if (isFirstMessage) {
      try {
        // Get sender's profile information
        const sender = await User.findByPk(userId, {
          include: [{
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name'],
          }],
        });

        if (sender && sender.Profile) {
          const senderName = `${sender.Profile.first_name} ${sender.Profile.last_name}`;
          
          // Create "First Message" notification
          const notification = await notificationService.createMessageReceivedNotification(
            otherParticipantId,
            userId,
            senderName,
            message.id,
            conversationId,
            true // isFirstMessage = true
          );

          // Emit real-time notification
          emitNewNotification(otherParticipantId, notification);
        }
      } catch (notificationError) {
        console.error('Failed to create first message notification:', notificationError);
        // Don't fail the message sending if notification fails
      }
    }
    
    // Send real-time message update
    emitNewMessage(otherParticipantId, {
      message: message.toJSON(),
      conversationId,
    });

    return res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);

    if (error.code === 'EMPTY_CONTENT') {
      return res.status(400).json({
        success: false,
        error: 'empty_content',
        message: error.message,
      });
    }

    if (error.code === 'CONVERSATION_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'conversation_not_found',
        message: error.message,
      });
    }

    if (error.code === 'NOT_AUTHORIZED') {
      return res.status(403).json({
        success: false,
        error: 'not_authorized',
        message: error.message,
      });
    }

    if (error.code === 'CONVERSATION_UNMATCHED') {
      return res.status(400).json({
        success: false,
        error: 'conversation_unmatched',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to send message',
    });
  }
}

/**
 * Mark messages as read in a conversation
 * POST /api/conversations/:conversationId/read
 */
async function markMessagesAsRead(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Check if user is participant
    const isParticipant = await conversationService.isParticipant(conversationId, userId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'not_authorized',
        message: 'Not authorized to mark messages as read in this conversation',
      });
    }

    const updatedCount = await messageService.markMessagesAsRead(conversationId, userId);

    // Emit socket event to other participant
    const otherParticipantId = await conversationService.getOtherParticipant(conversationId, userId);
    
    // Send real-time notification
    emitMessagesRead(otherParticipantId, {
      conversationId,
      readBy: userId,
    });

    return res.status(200).json({
      success: true,
      data: {
        updatedCount,
      },
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to mark messages as read',
    });
  }
}

/**
 * Get total unread message count for user
 * GET /api/conversations/unread/count
 */
async function getTotalUnreadCount(req, res) {
  try {
    const userId = req.user.id;
    const totalUnread = await messageService.getTotalUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data: {
        count: totalUnread,
      },
    });
  } catch (error) {
    console.error('Error in getTotalUnreadCount:', error);
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch unread count',
    });
  }
}

module.exports = {
  getUserConversations,
  getConversationById,
  unmatchConversation,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getTotalUnreadCount,
};
