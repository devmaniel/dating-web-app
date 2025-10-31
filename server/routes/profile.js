const express = require('express');
const router = express.Router();
const { completeProfile, getUserProfile, updateMatchingPrefs } = require('../controllers/profileController');
const { verifyJWT } = require('../middleware/jwt');
const upload = require('../middleware/upload');

/**
 * POST /profile/complete
 * Completes user profile with onboarding data and uploads photos to S3
 * 
 * Requires: JWT token in Authorization header
 * Content-Type: multipart/form-data
 * 
 * Request body (FormData):
 * - profile_picture: File (required)
 * - cover_picture: File (required)
 * - album_photos: File[] (required, 1-6 files)
 * - first_name: string (required)
 * - last_name: string (required)
 * - gender: string (required)
 * - location: string (required)
 * - school: string (required)
 * - program: string (required)
 * - looking_for: string (required)
 * - interests: JSON string array (required)
 * - music: JSON string array (required)
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Profile completed successfully",
 *   "profile": { ... }
 * }
 * 
 * Response (400):
 * {
 *   "success": false,
 *   "error": "missing_fields|missing_profile_picture|missing_cover_picture|missing_album_photos",
 *   "message": "..."
 * }
 * 
 * Response (401):
 * {
 *   "success": false,
 *   "error": "unauthorized",
 *   "message": "..."
 * }
 * 
 * Response (500):
 * {
 *   "success": false,
 *   "error": "profile_update_failed|s3_upload_failed",
 *   "message": "Failed to complete profile"
 * }
 */
/**
 * GET /profile/me
 * Fetches current user's profile data
 * 
 * Requires: JWT token in Authorization header
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "user_id": "uuid",
 *     "email": "user@example.com",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "profile_picture_url": "https://s3.amazonaws.com/...",
 *     ...
 *   }
 * }
 */
router.get('/me', verifyJWT, getUserProfile);

/**
 * GET /profile/:userId
 * Fetches another user's profile data by user ID
 * 
 * Requires: JWT token in Authorization header
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "user_id": "uuid",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "profile_picture_url": "https://s3.amazonaws.com/...",
 *     ...
 *   }
 * }
 */
const { getUserProfileById } = require('../controllers/profileController');
router.get('/:userId', verifyJWT, getUserProfileById);

router.post(
  '/complete',
  verifyJWT,
  upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'cover_picture', maxCount: 1 },
    { name: 'album_photos', maxCount: 6 },
  ]),
  completeProfile
);

/**
 * PUT /profile/matching-prefs
 * Updates user's matching preferences
 * 
 * Requires: JWT token in Authorization header
 * Content-Type: application/json
 * 
 * Request body:
 * {
 *   "gender_preferences": ["male", "female", "nonbinary"],
 *   "purpose_preference": ["study-buddy", "date", "bizz"],
 *   "distance_min_km": 0,
 *   "distance_max_km": 100
 * }
 */
router.put('/matching-prefs', verifyJWT, updateMatchingPrefs);

module.exports = router;
