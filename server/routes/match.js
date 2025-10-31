const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const { verifyJWT } = require('../middleware/jwt');

/**
 * POST /match/profiles
 * Fetches match profiles for the current user with optional filters
 * 
 * Requires: JWT token in Authorization header
 * Body: { filters: { genderPreferences, purposes, ageRange, distanceRange } }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "uuid",
 *       "name": "John Doe",
 *       "age": 25,
 *       "gender": "male",
 *       "imageUrl": "https://...",
 *       "coverImageUrl": "https://...",
 *       "education": "Computer Science from MIT",
 *       "aboutMe": "...",
 *       "lookingFor": "study-buddy",
 *       "location": "Quezon City",
 *       "interests": ["coding", "music"],
 *       "music": ["Pop", "Rock"],
 *       "photos": ["https://...", "https://..."]
 *     }
 *   ]
 * }
 * 
 * Response (401):
 * {
 *   "success": false,
 *   "error": "unauthorized",
 *   "message": "..."
 * }
 * 
 * Response (404):
 * {
 *   "success": false,
 *   "error": "profile_not_found",
 *   "message": "User profile not found"
 * }
 * 
 * Response (500):
 * {
 *   "success": false,
 *   "error": "match_fetch_failed",
 *   "message": "Failed to fetch match profiles"
 * }
 */
router.post('/profiles', verifyJWT, getMatches);

module.exports = router;
