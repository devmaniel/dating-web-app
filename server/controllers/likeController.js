const likeService = require('../services/likeService');
const notificationService = require('../services/notificationService');
const { emitLikeReceived, emitLikeStatusUpdate, emitRejectionNotification, emitNewNotification } = require('../socket');
const { User, Profile } = require('../models/index_sequelize');

/**
 * Like Controller
 * Handles HTTP requests for like operations
 */

/**
 * Send a like to another user
 * 
 * @route POST /api/likes/send
 * @access Protected (JWT required)
 * 
 * @param {Object} req.body
 * @param {string} req.body.receiver_id - UUID of user to like
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 201 - { success: true, data: like }
 * @returns {Object} 400 - { success: false, error: 'error_code', message: 'Error message' }
 * @returns {Object} 409 - { success: false, error: 'like_already_exists' }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * POST /api/likes/send
 * Headers: { Authorization: 'Bearer <token>' }
 * Body: { receiver_id: 'uuid-here' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   data: {
 *     id: 'like-uuid',
 *     sender_id: 'sender-uuid',
 *     receiver_id: 'receiver-uuid',
 *     status: 'pending',
 *     created_at: '2025-10-30T10:00:00.000Z'
 *   }
 * }
 */
async function sendLike(req, res) {
  try {
    const { receiver_id, status } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!receiver_id) {
      return res.status(400).json({
        success: false,
        error: 'missing_receiver_id',
        message: 'receiver_id is required',
      });
    }

    // Validate status if provided
    if (status && !['pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'invalid_status',
        message: 'status must be either "pending" or "rejected"',
      });
    }

    // Send the like with optional status (defaults to 'pending')
    const like = await likeService.sendLike(senderId, receiver_id, status);

    // Create notification and emit real-time notification based on status
    try {
      if (status === 'rejected') {
        // Check if receiver had previously liked sender (pending in Liked You)
        const receiverLikedSender = await likeService.checkLikeExists(receiver_id, senderId);
        
        if (receiverLikedSender && receiverLikedSender.status === 'pending') {
          // Notify receiver that their pending like was rejected
          emitRejectionNotification(receiver_id, {
            rejectedBy: senderId,
            likeId: receiverLikedSender.id,
            timestamp: like.created_at,
          });
        }
      } else {
        // Get sender's profile information for notification
        const sender = await User.findByPk(senderId, {
          include: [{
            model: Profile,
            as: 'Profile',
            attributes: ['first_name', 'last_name'],
          }],
        });

        if (sender && sender.Profile) {
          const senderName = `${sender.Profile.first_name} ${sender.Profile.last_name}`;
          
          // Create "User Liked You" notification
          const notification = await notificationService.createUserLikedYouNotification(
            receiver_id,
            senderId,
            senderName,
            like.id
          );

          // Emit real-time notification
          emitNewNotification(receiver_id, notification);
        }

        // Also emit the existing like received event for backward compatibility
        emitLikeReceived(receiver_id, {
          likeId: like.id,
          senderId: senderId,
          status: like.status,
          createdAt: like.created_at,
        });
      }
    } catch (socketError) {
      console.error('Socket.IO emit error:', socketError);
      // Don't fail the request if socket emit fails
    }

    return res.status(201).json({
      success: true,
      data: like,
      message: 'Like sent successfully',
    });
  } catch (error) {
    console.error('Error in sendLike:', error);

    // Handle specific error codes
    if (error.code === 'CANNOT_LIKE_SELF') {
      return res.status(400).json({
        success: false,
        error: 'cannot_like_self',
        message: error.message,
      });
    }

    if (error.code === 'RECEIVER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'receiver_not_found',
        message: error.message,
      });
    }

    if (error.code === 'LIKE_ALREADY_EXISTS') {
      return res.status(409).json({
        success: false,
        error: 'like_already_exists',
        message: error.message,
        data: error.existingLike,
      });
    }

    if (error.code === 'ALREADY_REJECTED_BY_USER') {
      return res.status(409).json({
        success: false,
        error: 'already_rejected_by_user',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to send like',
    });
  }
}

/**
 * Get count of pending likes received (lightweight)
 * 
 * @route GET /api/likes/received/count
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
 * GET /api/likes/received/count
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   count: 5
 * }
 */
async function getReceivedLikesCount(req, res) {
  try {
    const userId = req.user.id;

    const count = await likeService.getReceivedLikesCount(userId);

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error in getReceivedLikesCount:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch received likes count',
    });
  }
}

/**
 * Get all likes received by the authenticated user
 * 
 * @route GET /api/likes/received
 * @access Protected (JWT required)
 * 
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, data: likes[], count: number }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * GET /api/likes/received
 * Headers: { Authorization: 'Bearer <token>' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: 'like-uuid',
 *       sender_id: 'sender-uuid',
 *       receiver_id: 'receiver-uuid',
 *       status: 'pending',
 *       created_at: '2025-10-30T10:00:00.000Z',
 *       sender: {
 *         id: 'sender-uuid',
 *         email: 'sender@example.com',
 *         Profile: {
 *           first_name: 'John',
 *           last_name: 'Doe',
 *           gender: 'male',
 *           birthdate: '2000-01-01',
 *           location: 'New York',
 *           school: 'NYU',
 *           program: 'Computer Science',
 *           looking_for: 'relationship',
 *           interests: ['hiking', 'coding'],
 *           music: ['rock', 'jazz']
 *         }
 *       }
 *     }
 *   ],
 *   count: 1
 * }
 */
async function getReceivedLikes(req, res) {
  try {
    const userId = req.user.id;

    const likes = await likeService.getReceivedLikes(userId);

    return res.status(200).json({
      success: true,
      data: likes,
      count: likes.length,
    });
  } catch (error) {
    console.error('Error in getReceivedLikes:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch received likes',
    });
  }
}

/**
 * Get all likes sent by the authenticated user
 * 
 * @route GET /api/likes/sent
 * @access Protected (JWT required)
 * 
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user
 * 
 * @returns {Object} 200 - { success: true, data: likes[], count: number }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 */
async function getSentLikes(req, res) {
  try {
    const userId = req.user.id;

    const likes = await likeService.getSentLikes(userId);

    return res.status(200).json({
      success: true,
      data: likes,
      count: likes.length,
    });
  } catch (error) {
    console.error('Error in getSentLikes:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to fetch sent likes',
    });
  }
}

/**
 * Update like status (accept or reject)
 * 
 * @route PATCH /api/likes/:id
 * @access Protected (JWT required)
 * 
 * @param {string} req.params.id - UUID of the like
 * @param {Object} req.body
 * @param {string} req.body.status - New status: 'accepted' or 'rejected'
 * @param {Object} req.user - Authenticated user from JWT middleware
 * @param {string} req.user.id - UUID of authenticated user (must be receiver)
 * 
 * @returns {Object} 200 - { success: true, data: like }
 * @returns {Object} 400 - { success: false, error: 'error_code' }
 * @returns {Object} 403 - { success: false, error: 'not_authorized' }
 * @returns {Object} 404 - { success: false, error: 'like_not_found' }
 * @returns {Object} 500 - { success: false, error: 'server_error' }
 * 
 * @example
 * // Request
 * PATCH /api/likes/like-uuid-here
 * Headers: { Authorization: 'Bearer <token>' }
 * Body: { status: 'accepted' }
 * 
 * // Success Response
 * {
 *   success: true,
 *   data: {
 *     id: 'like-uuid',
 *     sender_id: 'sender-uuid',
 *     receiver_id: 'receiver-uuid',
 *     status: 'accepted',
 *     updated_at: '2025-10-30T10:05:00.000Z'
 *   },
 *   message: 'Like accepted'
 * }
 */
async function updateLikeStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'missing_status',
        message: 'status is required',
      });
    }

    // Update the like
    const like = await likeService.updateLikeStatus(id, status, userId);

    // Create notifications and emit real-time updates
    try {
      if (status === 'accepted') {
        // Get both users' profile information for mutual match notifications
        const [sender, receiver] = await Promise.all([
          User.findByPk(like.sender.id, {
            include: [{
              model: Profile,
              as: 'Profile',
              attributes: ['first_name', 'last_name'],
            }],
          }),
          User.findByPk(userId, {
            include: [{
              model: Profile,
              as: 'Profile',
              attributes: ['first_name', 'last_name'],
            }],
          }),
        ]);

        if (sender && sender.Profile && receiver && receiver.Profile) {
          const senderName = `${sender.Profile.first_name} ${sender.Profile.last_name}`;
          const receiverName = `${receiver.Profile.first_name} ${receiver.Profile.last_name}`;

          // Create mutual match notifications for both users
          const [senderNotification, receiverNotification] = await Promise.all([
            notificationService.createMutualMatchNotification(
              like.sender.id,
              userId,
              receiverName,
              null // We don't have conversation ID here, but it's optional
            ),
            notificationService.createMutualMatchNotification(
              userId,
              like.sender.id,
              senderName,
              null // We don't have conversation ID here, but it's optional
            ),
          ]);

          // Emit real-time notifications to both users
          emitNewNotification(like.sender.id, senderNotification);
          emitNewNotification(userId, receiverNotification);
        }
      }

      // Emit the existing like status update for backward compatibility
      emitLikeStatusUpdate(like.sender.id, {
        likeId: like.id,
        receiverId: userId,
        status: like.status,
        updatedAt: like.updated_at,
      });
    } catch (socketError) {
      console.error('Socket.IO emit error:', socketError);
      // Don't fail the request if socket emit fails
    }

    return res.status(200).json({
      success: true,
      data: like,
      message: `Like ${status}`,
    });
  } catch (error) {
    console.error('Error in updateLikeStatus:', error);

    // Handle specific error codes
    if (error.code === 'INVALID_STATUS') {
      return res.status(400).json({
        success: false,
        error: 'invalid_status',
        message: error.message,
      });
    }

    if (error.code === 'LIKE_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'like_not_found',
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

    if (error.code === 'LIKE_ALREADY_PROCESSED') {
      return res.status(400).json({
        success: false,
        error: 'like_already_processed',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to update like status',
    });
  }
}

module.exports = {
  sendLike,
  getReceivedLikesCount,
  getReceivedLikes,
  getSentLikes,
  updateLikeStatus,
};
