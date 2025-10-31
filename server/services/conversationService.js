const { Conversation, Message, User, Profile, LikedYou, UserPhoto, UserAlbum } = require('../models/index_sequelize');
const { Op } = require('sequelize');

/**
 * Conversation Service
 * Business logic for handling conversations between matched users
 */

/**
 * Create a new conversation between two participants
 * Ensures participant_one_id is always the lower UUID for consistency
 * 
 * @param {string} participantOneId - First participant UUID
 * @param {string} participantTwoId - Second participant UUID
 * @param {string} likedYouId - UUID of the like that created this match
 * @returns {Promise<Object>} Created conversation record
 * @throws {Error} If conversation already exists or participants are invalid
 */
async function createConversation(participantOneId, participantTwoId, likedYouId) {
  // Validate: Can't create conversation with yourself
  if (participantOneId === participantTwoId) {
    const error = new Error('Cannot create conversation with yourself');
    error.code = 'INVALID_PARTICIPANTS';
    throw error;
  }

  // Ensure participant_one_id is always the lower UUID (for consistency)
  const [lowerUuid, higherUuid] = [participantOneId, participantTwoId].sort();

  // Check if conversation already exists
  const existingConversation = await Conversation.findOne({
    where: {
      participant_one_id: lowerUuid,
      participant_two_id: higherUuid,
    },
  });

  if (existingConversation) {
    const error = new Error('Conversation already exists');
    error.code = 'CONVERSATION_EXISTS';
    error.conversation = existingConversation;
    throw error;
  }

  // Create the conversation
  const conversation = await Conversation.create({
    participant_one_id: lowerUuid,
    participant_two_id: higherUuid,
    status: 'active',
    liked_you_id: likedYouId,
    last_message_at: null,
  });

  // Return with participant details
  return await getConversationById(conversation.id);
}

/**
 * Get conversation by ID with participant details
 * 
 * @param {string} conversationId - UUID of conversation
 * @returns {Promise<Object|null>} Conversation with participant details
 */
async function getConversationById(conversationId) {
  const conversation = await Conversation.findByPk(conversationId, {
    include: [
      {
        model: User,
        as: 'participantOne',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name', 'gender', 'birthdate', 'location', 'school', 'program', 'about_me'],
          },
          {
            model: UserPhoto,
            as: 'UserPhotos',
            attributes: ['img_link', 'type'],
            required: false,
          },
          {
            model: UserAlbum,
            as: 'UserAlbums',
            attributes: ['img_link', 'position'],
            required: false,
          },
        ],
      },
      {
        model: User,
        as: 'participantTwo',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name', 'gender', 'birthdate', 'location', 'school', 'program', 'about_me'],
          },
          {
            model: UserPhoto,
            as: 'UserPhotos',
            attributes: ['img_link', 'type'],
            required: false,
          },
          {
            model: UserAlbum,
            as: 'UserAlbums',
            attributes: ['img_link', 'position'],
            required: false,
          },
        ],
      },
    ],
  });

  return conversation;
}

/**
 * Get all conversations for a user
 * 
 * @param {string} userId - UUID of user
 * @param {string} status - Filter by status: 'active', 'unmatched', or null for all
 * @returns {Promise<Array>} Array of conversations with participant details
 */
async function getUserConversations(userId, status = null) {
  const whereClause = {
    [Op.or]: [
      { participant_one_id: userId },
      { participant_two_id: userId },
    ],
  };

  if (status) {
    whereClause.status = status;
  }

  const conversations = await Conversation.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'participantOne',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name', 'gender', 'birthdate', 'location', 'school', 'program', 'about_me'],
          },
          {
            model: UserPhoto,
            as: 'UserPhotos',
            attributes: ['img_link', 'type'],
            required: false,
          },
          {
            model: UserAlbum,
            as: 'UserAlbums',
            attributes: ['img_link', 'position'],
            required: false,
          },
        ],
      },
      {
        model: User,
        as: 'participantTwo',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name', 'gender', 'birthdate', 'location', 'school', 'program', 'about_me'],
          },
          {
            model: UserPhoto,
            as: 'UserPhotos',
            attributes: ['img_link', 'type'],
            required: false,
          },
          {
            model: UserAlbum,
            as: 'UserAlbums',
            attributes: ['img_link', 'position'],
            required: false,
          },
        ],
      },
      {
        model: Message,
        as: 'messages',
        attributes: ['id', 'content', 'sender_id', 'is_read', 'created_at'],
        limit: 1,
        order: [['created_at', 'DESC']],
        required: false,
      },
    ],
    order: [
      ['last_message_at', 'DESC NULLS LAST'],
      ['created_at', 'DESC'],
    ],
  });

  return conversations;
}

/**
 * Get conversation between two specific participants
 * 
 * @param {string} userAId - First user UUID
 * @param {string} userBId - Second user UUID
 * @returns {Promise<Object|null>} Conversation if exists
 */
async function getConversationByParticipants(userAId, userBId) {
  const [lowerUuid, higherUuid] = [userAId, userBId].sort();

  const conversation = await Conversation.findOne({
    where: {
      participant_one_id: lowerUuid,
      participant_two_id: higherUuid,
    },
    include: [
      {
        model: User,
        as: 'participantOne',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name', 'gender', 'birthdate'],
          },
        ],
      },
      {
        model: User,
        as: 'participantTwo',
        attributes: ['id', 'email'],
        include: [
          {
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name', 'gender', 'birthdate'],
          },
        ],
      },
    ],
  });

  return conversation;
}

/**
 * Update last_message_at timestamp for a conversation
 * 
 * @param {string} conversationId - UUID of conversation
 * @returns {Promise<Object>} Updated conversation
 */
async function updateLastMessageAt(conversationId) {
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    const error = new Error('Conversation not found');
    error.code = 'CONVERSATION_NOT_FOUND';
    throw error;
  }

  conversation.last_message_at = new Date();
  await conversation.save();

  return conversation;
}

/**
 * Unmatch a conversation (set status to 'unmatched')
 * Also updates the corresponding liked_you record
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {string} userId - UUID of user requesting unmatch (must be participant)
 * @returns {Promise<Object>} Updated conversation
 * @throws {Error} If conversation not found or user not authorized
 */
async function unmatchConversation(conversationId, userId) {
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    const error = new Error('Conversation not found');
    error.code = 'CONVERSATION_NOT_FOUND';
    throw error;
  }

  // Verify user is a participant
  if (conversation.participant_one_id !== userId && conversation.participant_two_id !== userId) {
    const error = new Error('Not authorized to unmatch this conversation');
    error.code = 'NOT_AUTHORIZED';
    throw error;
  }

  // Check if already unmatched
  if (conversation.status === 'unmatched') {
    const error = new Error('Conversation already unmatched');
    error.code = 'ALREADY_UNMATCHED';
    throw error;
  }

  // Update conversation status
  conversation.status = 'unmatched';
  await conversation.save();

  // Update corresponding liked_you record
  const likedYou = await LikedYou.findByPk(conversation.liked_you_id);
  if (likedYou) {
    likedYou.status = 'unmatched';
    await likedYou.save();
  }

  // Return with participant details
  return await getConversationById(conversationId);
}

/**
 * Check if user is participant in conversation
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {string} userId - UUID of user
 * @returns {Promise<boolean>} True if user is participant
 */
async function isParticipant(conversationId, userId) {
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    return false;
  }

  return conversation.participant_one_id === userId || conversation.participant_two_id === userId;
}

/**
 * Get the other participant in a conversation
 * 
 * @param {string} conversationId - UUID of conversation
 * @param {string} userId - UUID of current user
 * @returns {Promise<string>} UUID of other participant
 */
async function getOtherParticipant(conversationId, userId) {
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    const error = new Error('Conversation not found');
    error.code = 'CONVERSATION_NOT_FOUND';
    throw error;
  }

  if (conversation.participant_one_id === userId) {
    return conversation.participant_two_id;
  } else if (conversation.participant_two_id === userId) {
    return conversation.participant_one_id;
  } else {
    const error = new Error('User is not a participant in this conversation');
    error.code = 'NOT_PARTICIPANT';
    throw error;
  }
}

module.exports = {
  createConversation,
  getConversationById,
  getUserConversations,
  getConversationByParticipants,
  updateLastMessageAt,
  unmatchConversation,
  isParticipant,
  getOtherParticipant,
};
