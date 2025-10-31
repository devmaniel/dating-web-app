const express = require('express');
const router = express.Router();
const { signUp, signIn, checkProfileCompletion, logout } = require('../controllers/authController');
const { verifyJWT } = require('../middleware/jwt');

/**
 * POST /auth/sign-up
 * Create a new user account with initial profile
 * 
 * Request body:
 * {
 *   email: string (required, valid email format)
 *   password: string (required)
 *   birthdate: string (required, format: YYYY-MM-DD)
 * }
 * 
 * Success response (201):
 * {
 *   success: true,
 *   data: { id, email, message }
 * }
 * 
 * Error responses:
 * - 400: validation_error, invalid_email, invalid_birthdate
 * - 409: email_exists
 * - 500: server_error
 * 
 * Note: Profile is created with only birthdate. Other fields are nullable
 * and will be filled during onboarding.
 */
router.post('/sign-up', signUp);

/**
 * POST /auth/sign-in
 * Verify user credentials and sign in
 * 
 * Request body:
 * {
 *   email: string (required, valid email format)
 *   password: string (required)
 * }
 * 
 * Success response (200):
 * {
 *   success: true,
 *   data: { id, email, message }
 * }
 * 
 * Error responses:
 * - 400: validation_error
 * - 401: invalid_credentials
 * - 500: server_error
 */
router.post('/sign-in', signIn);

/**
 * GET /auth/profile-completion
 * Check if user's profile is complete
 * Requires: JWT authentication
 * 
 * Success response (200):
 * {
 *   success: true,
 *   data: { isProfileComplete: boolean }
 * }
 * 
 * Error responses:
 * - 401: unauthorized (not authenticated)
 * - 404: profile_not_found
 * - 500: server_error
 */
router.get('/profile-completion', verifyJWT, checkProfileCompletion);

/**
 * POST /auth/logout
 * Logout user (invalidate token on client side)
 * Requires: JWT authentication
 * 
 * Success response (200):
 * {
 *   success: true,
 *   message: 'Logged out successfully'
 * }
 * 
 * Error responses:
 * - 401: unauthorized (not authenticated)
 * - 500: server_error
 */
router.post('/logout', verifyJWT, logout);

module.exports = router;
