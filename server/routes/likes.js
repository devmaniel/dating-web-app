const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { verifyJWT } = require('../middleware/jwt');

/**
 * Like Routes
 * All routes are protected with JWT authentication
 * Base path: /api/likes
 */

/**
 * @route   POST /api/likes/send
 * @desc    Send a like to another user
 * @access  Protected
 * @body    { receiver_id: string }
 * @returns { success: true, data: like }
 */
router.post('/send', verifyJWT, likeController.sendLike);

/**
 * @route   GET /api/likes/received/count
 * @desc    Get count of pending likes received (lightweight)
 * @access  Protected
 * @returns { success: true, count: number }
 */
router.get('/received/count', verifyJWT, likeController.getReceivedLikesCount);

/**
 * @route   GET /api/likes/received
 * @desc    Get all likes received by authenticated user (pending only)
 * @access  Protected
 * @returns { success: true, data: likes[], count: number }
 */
router.get('/received', verifyJWT, likeController.getReceivedLikes);

/**
 * @route   GET /api/likes/sent
 * @desc    Get all likes sent by authenticated user
 * @access  Protected
 * @returns { success: true, data: likes[], count: number }
 */
router.get('/sent', verifyJWT, likeController.getSentLikes);

/**
 * @route   PATCH /api/likes/:id
 * @desc    Update like status (accept or reject)
 * @access  Protected (must be receiver)
 * @params  { id: string } - Like UUID
 * @body    { status: 'accepted' | 'rejected' }
 * @returns { success: true, data: like }
 */
router.patch('/:id', verifyJWT, likeController.updateLikeStatus);

module.exports = router;
