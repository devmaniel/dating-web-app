const { createUser, verifyCredentials } = require('../services/authService');

/**
 * Handle user sign up
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * 
 * Request body: { email, password, birthdate }
 * Response: { success, data: { id, email, message } } or { success, error, message }
 */
async function signUp(req, res) {
  try {
    const { email, password, birthdate } = req.body;

    // Validate required fields
    if (!email || !password || !birthdate) {
      return res.status(400).json({
        success: false,
        error: 'validation_error',
        message: 'Email, password, and birthdate are required',
      });
    }

    // Create user
    const result = await createUser(email, password, birthdate);

    return res.status(201).json({
      success: true,
      data: {
        ...result,
        message: 'Account created successfully! Please sign in to continue.'
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);

    // Handle specific validation errors
    if (error.code === 'INVALID_EMAIL') {
      return res.status(400).json({
        success: false,
        error: 'invalid_email',
        message: 'Invalid email format',
      });
    }

    if (error.code === 'INVALID_BIRTHDATE') {
      return res.status(400).json({
        success: false,
        error: 'invalid_birthdate',
        message: 'Invalid birthdate format. Use YYYY-MM-DD',
      });
    }

    if (error.code === 'EMAIL_EXISTS') {
      return res.status(409).json({
        success: false,
        error: 'email_exists',
        message: 'Email already registered',
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to create account',
    });
  }
}

/**
 * Handle user sign in
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * 
 * Request body: { email, password }
 * Response: { success, data: { id, email, message } } or { success, error, message }
 */
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'validation_error',
        message: 'Email and password are required',
      });
    }

    // Verify credentials
    const result = await verifyCredentials(email, password);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Sign in error:', error);

    // Handle invalid credentials
    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        success: false,
        error: 'invalid_credentials',
        message: 'Invalid email or password',
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to sign in',
    });
  }
}

/**
 * Check if user's profile is complete
 * @param {Object} req - Express request (requires authenticated user)
 * @param {Object} res - Express response
 * 
 * Response: { success, data: { isProfileComplete } }
 */
async function checkProfileCompletion(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'unauthorized',
        message: 'User not authenticated',
      });
    }

    const { Profile } = require('../models/index_sequelize');

    // Fetch user's profile
    const profile = await Profile.findByPk(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'profile_not_found',
        message: 'User profile not found',
      });
    }

    // Check if profile is complete
    // Profile is complete when all required fields are filled (not null)
    // Required fields: first_name, last_name, gender, location, school, program, looking_for, interests, music
    const isProfileComplete =
      profile.first_name &&
      profile.last_name &&
      profile.gender &&
      profile.location &&
      profile.school &&
      profile.program &&
      profile.looking_for &&
      profile.interests &&
      profile.music;

    return res.status(200).json({
      success: true,
      data: {
        isProfileComplete: !!isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Check profile completion error:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to check profile completion',
    });
  }
}

/**
 * Handle user logout
 * @param {Object} req - Express request (requires authenticated user)
 * @param {Object} res - Express response
 * 
 * Response: { success, message }
 */
async function logout(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'unauthorized',
        message: 'User not authenticated',
      });
    }

    // Logout is successful - token is invalidated on client side
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);

    return res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to logout',
    });
  }
}

module.exports = {
  signUp,
  signIn,
  checkProfileCompletion,
  logout,
};
