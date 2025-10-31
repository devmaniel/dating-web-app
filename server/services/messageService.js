const { Message, Conversation, User, Profile } = require('../models/index_sequelize');
const { Op } = require('sequelize');
const conversationService = require('./conversationService');

/**
 * Message Service
 * Business logic for handling messages in conversations
 */

/**
 * Create a new message in a conversation
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {string} senderId - UUID of user sending the message
 * @param {string} content - Message content
 * @returns {Promise<Object>} Created message record
 * @throws {Error} If conversation not found, user not participant, or conversation unmatched
 */
async function createMessage(conversationId, senderId, content) {
  // Validate content
  if (!content || content.trim().length === 0) {
    const error = new Error('Message content cannot be empty');
    error.code = 'EMPTY_CONTENT';
    throw error;
  }

  // Get conversation
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    const error = new Error('Conversation not found');
    error.code = 'CONVERSATION_NOT_FOUND';
    throw error;
  }

  // Check if user is participant
  const isParticipant = await conversationService.isParticipant(conversationId, senderId);
  if (!isParticipant) {
    const error = new Error('Not authorized to send messages in this conversation');
    error.code = 'NOT_AUTHORIZED';
    throw error;
  }

  // Check if conversation is unmatched
  if (conversation.status === 'unmatched') {
    const error = new Error('Cannot send messages in unmatched conversation');
    error.code = 'CONVERSATION_UNMATCHED';
    throw error;
  }

  // Create message
  const message = await Message.create({
    conversation_id: conversationId,
    sender_id: senderId,
    content: content.trim(),
    is_read: false,
  });

  // Update conversation's last_message_at
  await conversationService.updateLastMessageAt(conversationId);

  // Return with sender details
  const messageWithDetails = await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name'],
          },
        ],
      },
    ],
  });

  return messageWithDetails;
}

/**
 * Get messages for a conversation with pagination
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {number} limit - Number of messages to retrieve (default: 50)
 * @param {number} offset - Number of messages to skip (default: 0)
 * @returns {Promise<Array>} Array of messages with sender details
 */
async function getConversationMessages(conversationId, limit = 50, offset = 0) {
  const messages = await Message.findAll({
    where: {
      conversation_id: conversationId,
    },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name'],
          },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return messages;
}

/**
 * Mark all messages in a conversation as read for a specific user
 * Only marks messages sent by the OTHER participant
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {string} userId - UUID of user marking messages as read
 * @returns {Promise<number>} Number of messages marked as read
 */
async function markMessagesAsRead(conversationId, userId) {
  // Get the other participant's ID
  const otherParticipantId = await conversationService.getOtherParticipant(conversationId, userId);

  // Mark all unread messages from the other participant as read
  const [updatedCount] = await Message.update(
    { is_read: true },
    {
      where: {
        conversation_id: conversationId,
        sender_id: otherParticipantId,
        is_read: false,
      },
    }
  );

  return updatedCount;
}

/**
 * Get unread message count for a conversation for a specific user
 * Only counts messages sent by the OTHER participant
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {string} userId - UUID of user
 * @returns {Promise<number>} Count of unread messages
 */
async function getUnreadCount(conversationId, userId) {
  // Get the other participant's ID
  const otherParticipantId = await conversationService.getOtherParticipant(conversationId, userId);

  const count = await Message.count({
    where: {
      conversation_id: conversationId,
      sender_id: otherParticipantId,
      is_read: false,
    },
  });

  return count;
}

/**
 * Get total unread message count across all conversations for a user
 * 
 * @param {string} userId - UUID of user
 * @returns {Promise<number>} Total count of unread messages
 */
async function getTotalUnreadCount(userId) {
  // Get all active conversations for user
  const conversations = await conversationService.getUserConversations(userId, 'active');

  let totalUnread = 0;

  for (const conversation of conversations) {
    const unreadCount = await getUnreadCount(conversation.id, userId);
    totalUnread += unreadCount;
  }

  return totalUnread;
}

/**
 * Delete a message (soft delete - mark as deleted)
 * Note: This is a placeholder for future implementation
 * 
 * @param {string} messageId - UUID of message
 * @param {string} userId - UUID of user deleting (must be sender)
 * @returns {Promise<Object>} Deleted message
 */
async function deleteMessage(messageId, userId) {
  const message = await Message.findByPk(messageId);

  if (!message) {
    const error = new Error('Message not found');
    error.code = 'MESSAGE_NOT_FOUND';
    throw error;
  }

  // Verify user is the sender
  if (message.sender_id !== userId) {
    const error = new Error('Not authorized to delete this message');
    error.code = 'NOT_AUTHORIZED';
    throw error;
  }

  // For now, just delete the message
  // In production, you might want to soft delete or mark as deleted
  await message.destroy();

  return message;
}

/**
 * Get total message count for a conversation
 * 
 * @param {string} conversationId - UUID of conversation
 * @returns {Promise<number>} Total number of messages in conversation
 */
async function getMessageCount(conversationId) {
  const count = await Message.count({
    where: {
      conversation_id: conversationId,
    },
  });

  return count;
}

module.exports = {
  createMessage,
  getConversationMessages,
  markMessagesAsRead,
  getUnreadCount,
  getTotalUnreadCount,
  deleteMessage,
  getMessageCount,
};
