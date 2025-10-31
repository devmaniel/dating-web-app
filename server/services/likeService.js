const { LikedYou, User, Profile } = require('../models/index_sequelize');
const { Op } = require('sequelize');
const conversationService = require('./conversationService');

/**
 * Like Service
 * Business logic for handling user likes
 */

/**
 * Send a like from one user to another
 * 
 * @param {string} senderId - UUID of user sending the like
 * @param {string} receiverId - UUID of user receiving the like
 * @param {string} status - Status of the like: 'pending' (default) or 'rejected'
 * @returns {Promise<Object>} Created like record
 * @throws {Error} If like already exists or users don't exist
 */
async function sendLike(senderId, receiverId, status = 'pending') {
  // Validate: Can't like yourself
  if (senderId === receiverId) {
    const error = new Error('Cannot like yourself');
    error.code = 'CANNOT_LIKE_SELF';
    throw error;
  }

  // Check if receiver exists
  const receiver = await User.findByPk(receiverId);
  if (!receiver) {
    const error = new Error('Receiver not found');
    error.code = 'RECEIVER_NOT_FOUND';
    throw error;
  }

  // Check if like already exists (sender → receiver)
  const existingLike = await LikedYou.findOne({
    where: {
      sender_id: senderId,
      receiver_id: receiverId,
    },
  });

  if (existingLike) {
    const error = new Error('Like already sent');
    error.code = 'LIKE_ALREADY_EXISTS';
    error.existingLike = existingLike;
    throw error;
  }

  // Check if receiver has already rejected sender (receiver → sender with status 'rejected')
  // This handles race condition: User B rejects User A, but User A still sees User B in Match page
  const receiverRejectedSender = await LikedYou.findOne({
    where: {
      sender_id: receiverId,
      receiver_id: senderId,
      status: 'rejected',
    },
  });

  if (receiverRejectedSender) {
    const error = new Error('Cannot like user who has already rejected you');
    error.code = 'ALREADY_REJECTED_BY_USER';
    throw error;
  }

  // Create the like with specified status
  const like = await LikedYou.create({
    sender_id: senderId,
    receiver_id: receiverId,
    status: status, // Can be 'pending' or 'rejected'
  });

  return like;
}

/**
 * Get count of pending likes received by a user (lightweight)
 * 
 * @param {string} userId - UUID of user receiving likes
 * @returns {Promise<number>} Count of pending likes
 */
async function getReceivedLikesCount(userId) {
  const count = await LikedYou.count({
    where: {
      receiver_id: userId,
      status: 'pending',
    },
  });

  return count;
}

/**
 * Get all likes received by a user (pending only)
 * Includes sender's profile information
 * 
 * @param {string} userId - UUID of user receiving likes
 * @returns {Promise<Array>} Array of likes with sender profiles
 */
async function getReceivedLikes(userId) {
  const { UserPhoto, UserAlbum } = require('../models/index_sequelize');
  
  const likes = await LikedYou.findAll({
    where: {
      receiver_id: userId,
      status: 'pending',
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
            attributes: [
              'first_name',
              'last_name',
              'gender',
              'birthdate',
              'location',
              'school',
              'program',
              'looking_for',
              'interests',
              'music',
              'about_me',
            ],
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
            order: [['position', 'ASC']],
          },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return likes;
}

/**
 * Get all likes sent by a user
 * 
 * @param {string} userId - UUID of user who sent likes
 * @returns {Promise<Array>} Array of sent likes
 */
async function getSentLikes(userId) {
  const likes = await LikedYou.findAll({
    where: {
      sender_id: userId,
    },
    include: [
      {
        model: User,
        as: 'receiver',
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
  });

  return likes;
}

/**
 * Update like status (accept or reject)
 * 
 * @param {string} likeId - UUID of the like
 * @param {string} status - New status: 'accepted' or 'rejected'
 * @param {string} userId - UUID of user updating (must be receiver)
 * @returns {Promise<Object>} Updated like record
 * @throws {Error} If like not found or user not authorized
 */
async function updateLikeStatus(likeId, status, userId) {
  // Validate status
  if (!['accepted', 'rejected'].includes(status)) {
    const error = new Error('Invalid status. Must be "accepted" or "rejected"');
    error.code = 'INVALID_STATUS';
    throw error;
  }

  // Find the like
  const like = await LikedYou.findByPk(likeId);

  if (!like) {
    const error = new Error('Like not found');
    error.code = 'LIKE_NOT_FOUND';
    throw error;
  }

  // Verify user is the receiver
  if (like.receiver_id !== userId) {
    const error = new Error('Not authorized to update this like');
    error.code = 'NOT_AUTHORIZED';
    throw error;
  }

  // Check if already processed
  if (like.status !== 'pending') {
    const error = new Error('Like already processed');
    error.code = 'LIKE_ALREADY_PROCESSED';
    throw error;
  }

  // Update status
  like.status = status;
  await like.save();

  // If accepted, create conversation between participants
  if (status === 'accepted') {
    try {
      // Check if conversation already exists
      const existingConversation = await conversationService.getConversationByParticipants(
        like.sender_id,
        like.receiver_id
      );

      if (!existingConversation) {
        // Create new conversation
        await conversationService.createConversation(
          like.sender_id,
          like.receiver_id,
          like.id
        );
      }
    } catch (error) {
      // Log error but don't fail the like update
      console.error('Error creating conversation:', error);
      // If conversation already exists, that's okay - continue
      if (error.code !== 'CONVERSATION_EXISTS') {
        throw error;
      }
    }
  }

  // Return with sender info for notifications
  const updatedLike = await LikedYou.findByPk(likeId, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'email'],
      },
      {
        model: User,
        as: 'receiver',
        attributes: ['id', 'email'],
      },
    ],
  });

  return updatedLike;
}

/**
 * Check if user A has liked user B
 * 
 * @param {string} userAId - UUID of first user
 * @param {string} userBId - UUID of second user
 * @returns {Promise<Object|null>} Like record if exists, null otherwise
 */
async function checkLikeExists(userAId, userBId) {
  const like = await LikedYou.findOne({
    where: {
      sender_id: userAId,
      receiver_id: userBId,
    },
  });

  return like;
}

/**
 * Check for mutual likes (both users liked each other)
 * 
 * @param {string} userAId - UUID of first user
 * @param {string} userBId - UUID of second user
 * @returns {Promise<boolean>} True if mutual like exists
 */
async function checkMutualLike(userAId, userBId) {
  const likes = await LikedYou.findAll({
    where: {
      [Op.or]: [
        { sender_id: userAId, receiver_id: userBId },
        { sender_id: userBId, receiver_id: userAId },
      ],
      status: 'accepted',
    },
  });

  return likes.length === 2;
}

module.exports = {
  sendLike,
  getReceivedLikesCount,
  getReceivedLikes,
  getSentLikes,
  updateLikeStatus,
  checkLikeExists,
  checkMutualLike,
};
