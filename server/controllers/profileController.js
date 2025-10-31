const { updateProfileCompletion, createUserPhotos } = require('../services/profileService');
const { uploadAllPhotos } = require('../services/s3Service');
const { createOrUpdateMatchingPrefs } = require('../services/matchingPrefsService');

// Track in-progress profile completion requests to prevent duplicates
const inProgressRequests = new Map();

/**
 * POST /profile/complete
 * Completes user profile with onboarding data
 * Prevents duplicate submissions by tracking in-progress requests
 * 
 * @param {Object} req - Express request object
 * @param {string} req.user.id - User ID from JWT token
 * @param {Object} req.body - Profile data
 * @param {string} req.body.first_name - First name
 * @param {string} req.body.middle_name - Middle name (optional)
 * @param {string} req.body.last_name - Last name
 * @param {string} req.body.gender - Gender
 * @param {string} req.body.location - Location
 * @param {string} req.body.school - School
 * @param {string} req.body.program - Program
 * @param {string} req.body.looking_for - Looking for
 * @param {Array} req.body.interests - Interests array
 * @param {Array} req.body.music - Music array
 * @param {Object} req.body.profile_picture - Profile picture data
 * @param {Object} req.body.cover_picture - Cover picture data
 * @param {Array} req.body.album_photos - Album photos array
 * @param {Object} res - Express response object
 * @returns {Object} Success response with updated profile
 */
const completeProfile = async (req, res) => {
  const userId = req.user.id;

  // Check if there's already a request in progress for this user
  if (inProgressRequests.has(userId)) {
    console.log(`Duplicate profile completion request detected for user ${userId}, rejecting`);
    return res.status(409).json({
      success: false,
      error: 'request_in_progress',
      message: 'Profile completion already in progress. Please wait.',
    });
  }

  // Mark this request as in progress
  inProgressRequests.set(userId, Date.now());
  
  try {
    const {
      first_name,
      middle_name,
      last_name,
      gender,
      location,
      school,
      program,
      about_me,
      looking_for,
    } = req.body;

    // Parse JSON fields from FormData
    let interests = [];
    let music = [];
    let matchingPrefs = null;

    try {
      interests = req.body.interests ? JSON.parse(req.body.interests) : [];
      music = req.body.music ? JSON.parse(req.body.music) : [];
      matchingPrefs = req.body.matching_prefs ? JSON.parse(req.body.matching_prefs) : null;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        error: 'invalid_json_fields',
        message: 'Invalid interests, music, or matching_prefs JSON format',
      });
    }

    // Validate required fields
    if (!first_name || !last_name || !gender || !location || !school || !program || !looking_for || !interests || !music || !matchingPrefs) {
      return res.status(400).json({
        success: false,
        error: 'missing_fields',
        message: 'All profile fields including matching preferences are required',
      });
    }

    // Validate gender enum
    const validGenders = ['male', 'female', 'nonbinary'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        error: 'invalid_gender',
        message: 'Invalid gender value',
      });
    }

    // Validate interests is array
    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        error: 'invalid_interests',
        message: 'Interests must be an array',
      });
    }

    // Validate music is array
    if (!Array.isArray(music)) {
      return res.status(400).json({
        success: false,
        error: 'invalid_music',
        message: 'Music must be an array',
      });
    }

    // Validate file uploads
    if (!req.files || !req.files.profile_picture || !req.files.profile_picture[0]) {
      return res.status(400).json({
        success: false,
        error: 'missing_profile_picture',
        message: 'Profile picture file is required',
      });
    }

    if (!req.files || !req.files.cover_picture || !req.files.cover_picture[0]) {
      return res.status(400).json({
        success: false,
        error: 'missing_cover_picture',
        message: 'Cover picture file is required',
      });
    }

    // Album photos are now optional - no validation needed

    // Call service to update profile
    const updatedProfile = await updateProfileCompletion(userId, {
      first_name,
      middle_name,
      last_name,
      gender,
      location,
      school,
      program,
      about_me: about_me || null,
      looking_for,
      interests,
      music,
    });

    // Upload photos to S3
    const s3UploadResults = await uploadAllPhotos(req.files, userId);

    // Create user photos with S3 URLs
    await createUserPhotos(userId, s3UploadResults);

    // Create or update matching preferences
    await createOrUpdateMatchingPrefs(userId, matchingPrefs);

    // Clear the in-progress flag on success
    inProgressRequests.delete(userId);

    return res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      profile: {
        user_id: updatedProfile.user_id,
        first_name: updatedProfile.first_name,
        middle_name: updatedProfile.middle_name,
        last_name: updatedProfile.last_name,
        gender: updatedProfile.gender,
        birthdate: updatedProfile.birthdate,
        location: updatedProfile.location,
        school: updatedProfile.school,
        program: updatedProfile.program,
        about_me: updatedProfile.about_me,
        looking_for: updatedProfile.looking_for,
        interests: updatedProfile.interests,
        music: updatedProfile.music,
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at,
      },
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    
    // Clear the in-progress flag on error
    inProgressRequests.delete(userId);

    // Handle specific error codes
    if (error.code === 'PROFILE_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'profile_not_found',
        message: 'User profile not found',
      });
    }

    // Handle matching preferences validation errors
    if (error.code && error.code.includes('INVALID_')) {
      return res.status(400).json({
        success: false,
        error: 'invalid_matching_prefs',
        message: error.message,
      });
    }

    if (error.code === 'MATCHING_PREFS_ERROR') {
      return res.status(500).json({
        success: false,
        error: 'matching_prefs_failed',
        message: 'Failed to save matching preferences',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'profile_update_failed',
      message: 'Failed to complete profile',
    });
  }
};

/**
 * GET /profile/me
 * Fetches current user's profile data
 * 
 * @param {Object} req - Express request object
 * @param {string} req.user.id - User ID from JWT token
 * @param {Object} res - Express response object
 * @returns {Object} User profile with photo data
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Import models
    const { Profile, User, UserPhoto, MatchingPrefs } = require('../models/index_sequelize');

    // Get profile data
    const profile = await Profile.findByPk(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'profile_not_found',
        message: 'User profile not found',
      });
    }

    // Get user data for email
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'user_not_found',
        message: 'User not found',
      });
    }

    // Get ALL user photos (profile picture AND cover picture)
    const userPhotos = await UserPhoto.findAll({
      where: {
        user_id: userId,
      },
    });

    // Get profile picture for backward compatibility
    const profilePicture = userPhotos.find(photo => photo.type === 'profile_picture');

    // Get matching preferences
    const matchingPrefs = await MatchingPrefs.findByPk(userId);

    return res.status(200).json({
      success: true,
      data: {
        user_id: profile.user_id,
        email: user.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        middle_name: profile.middle_name,
        gender: profile.gender,
        birthdate: profile.birthdate,
        location: profile.location,
        school: profile.school,
        program: profile.program,
        about_me: profile.about_me,
        looking_for: profile.looking_for,
        interests: profile.interests,
        music: profile.music,
        profile_picture_url: profilePicture?.img_link || null,
        user_photos: userPhotos,
        matching_prefs: matchingPrefs ? {
          gender_preferences: matchingPrefs.gender_preferences,
          purpose_preference: matchingPrefs.purpose_preference,
          distance_min_km: matchingPrefs.distance_min_km,
          distance_max_km: matchingPrefs.distance_max_km,
        } : null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'profile_fetch_failed',
      message: 'Failed to fetch profile',
    });
  }
};

/**
 * GET /profile/:userId
 * Gets another user's profile by user ID
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - Target user ID
 * @param {Object} res - Express response object
 * @returns {Object} User profile with photo data
 */
const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Import models
    const { Profile, UserPhoto, MatchingPrefs } = require('../models/index_sequelize');

    // Get profile data
    const profile = await Profile.findByPk(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'profile_not_found',
        message: 'User profile not found',
      });
    }

    // Get ALL user photos (profile picture AND cover picture)
    const userPhotos = await UserPhoto.findAll({
      where: {
        user_id: userId,
      },
    });

    // Get profile picture for backward compatibility
    const profilePicture = userPhotos.find(photo => photo.type === 'profile_picture');

    // Get matching preferences
    const matchingPrefs = await MatchingPrefs.findByPk(userId);

    return res.status(200).json({
      success: true,
      data: {
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        middle_name: profile.middle_name,
        gender: profile.gender,
        birthdate: profile.birthdate,
        location: profile.location,
        school: profile.school,
        program: profile.program,
        about_me: profile.about_me,
        looking_for: profile.looking_for,
        interests: profile.interests,
        music: profile.music,
        profile_picture_url: profilePicture?.img_link || null,
        user_photos: userPhotos,
        matching_prefs: matchingPrefs ? {
          gender_preferences: matchingPrefs.gender_preferences,
          purpose_preference: matchingPrefs.purpose_preference,
          distance_min_km: matchingPrefs.distance_min_km,
          distance_max_km: matchingPrefs.distance_max_km,
        } : null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    return res.status(500).json({
      success: false,
      error: 'profile_fetch_failed',
      message: 'Failed to fetch profile',
    });
  }
};

/**
 * PUT /profile/matching-prefs
 * Updates user's matching preferences
 * 
 * @param {Object} req - Express request object
 * @param {string} req.user.id - User ID from JWT token
 * @param {Object} req.body - Matching preferences data
 * @param {Array} req.body.gender_preferences - Gender preferences array
 * @param {Array} req.body.purpose_preference - Purpose preferences array
 * @param {number} req.body.distance_min_km - Minimum distance in km
 * @param {number} req.body.distance_max_km - Maximum distance in km
 * @param {Object} res - Express response object
 * @returns {Object} Success response with updated preferences
 */
const updateMatchingPrefs = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      gender_preferences,
      purpose_preference,
      distance_min_km,
      distance_max_km,
    } = req.body;

    // Validate required fields
    if (!gender_preferences || !purpose_preference) {
      return res.status(400).json({
        success: false,
        error: 'missing_fields',
        message: 'Gender preferences and purpose preferences are required',
      });
    }

    // Update matching preferences
    const matchingPrefs = await createOrUpdateMatchingPrefs(userId, {
      open_for_everyone: false,
      gender_preferences,
      purpose_preference,
      distance_min_km: distance_min_km ?? 0,
      distance_max_km: distance_max_km ?? 100,
    });

    return res.status(200).json({
      success: true,
      message: 'Matching preferences updated successfully',
      data: {
        gender_preferences: matchingPrefs.gender_preferences,
        purpose_preference: matchingPrefs.purpose_preference,
        distance_min_km: matchingPrefs.distance_min_km,
        distance_max_km: matchingPrefs.distance_max_km,
      },
    });
  } catch (error) {
    console.error('Error updating matching preferences:', error);
    return res.status(500).json({
      success: false,
      error: 'matching_prefs_update_failed',
      message: 'Failed to update matching preferences',
    });
  }
};

module.exports = {
  completeProfile,
  getUserProfile,
  getUserProfileById,
  updateMatchingPrefs,
};
