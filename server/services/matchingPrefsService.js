const { MatchingPrefs } = require('../models/index_sequelize');

/**
 * Creates or updates matching preferences for a user
 * @param {string} userId - User ID
 * @param {Object} matchingPrefsData - Matching preferences data
 * @param {boolean} matchingPrefsData.open_for_everyone - Open for everyone flag
 * @param {Array<string>} matchingPrefsData.gender_preferences - Array of gender preferences
 * @param {Array<string>} matchingPrefsData.purpose_preference - Array of purpose preferences
 * @param {number} matchingPrefsData.distance_min_km - Minimum distance in km
 * @param {number} matchingPrefsData.distance_max_km - Maximum distance in km
 * @returns {Promise<Object>} Created or updated matching preferences
 * @throws {Error} If user not found or database error
 */
const createOrUpdateMatchingPrefs = async (userId, matchingPrefsData) => {
  try {
    const {
      open_for_everyone,
      gender_preferences,
      purpose_preference,
      distance_min_km,
      distance_max_km,
    } = matchingPrefsData;

    // Validate required fields
    if (typeof open_for_everyone !== 'boolean') {
      const error = new Error('open_for_everyone must be a boolean');
      error.code = 'INVALID_OPEN_FOR_EVERYONE';
      throw error;
    }

    if (!Array.isArray(gender_preferences)) {
      const error = new Error('gender_preferences must be an array');
      error.code = 'INVALID_GENDER_PREFERENCES';
      throw error;
    }

    if (!Array.isArray(purpose_preference)) {
      const error = new Error('purpose_preference must be an array');
      error.code = 'INVALID_PURPOSE_PREFERENCE';
      throw error;
    }

    if (typeof distance_min_km !== 'number' || distance_min_km < 0) {
      const error = new Error('distance_min_km must be a non-negative number');
      error.code = 'INVALID_DISTANCE_MIN';
      throw error;
    }

    if (typeof distance_max_km !== 'number' || distance_max_km <= distance_min_km) {
      const error = new Error('distance_max_km must be a number greater than distance_min_km');
      error.code = 'INVALID_DISTANCE_MAX';
      throw error;
    }

    // Validate gender preferences values
    const validGenders = ['male', 'female', 'nonbinary'];
    const invalidGenders = gender_preferences.filter(gender => !validGenders.includes(gender));
    if (invalidGenders.length > 0) {
      const error = new Error(`Invalid gender preferences: ${invalidGenders.join(', ')}`);
      error.code = 'INVALID_GENDER_VALUES';
      throw error;
    }

    // Validate purpose preferences values
    const validPurposes = ['study-buddy', 'date', 'bizz'];
    const invalidPurposes = purpose_preference.filter(purpose => !validPurposes.includes(purpose));
    if (invalidPurposes.length > 0) {
      const error = new Error(`Invalid purpose preferences: ${invalidPurposes.join(', ')}`);
      error.code = 'INVALID_PURPOSE_VALUES';
      throw error;
    }

    // Use upsert to create or update
    const [matchingPrefs, created] = await MatchingPrefs.upsert({
      user_id: userId,
      open_for_everyone,
      gender_preferences,
      purpose_preference,
      distance_min_km,
      distance_max_km,
    }, {
      returning: true,
    });

    console.log(`Matching preferences ${created ? 'created' : 'updated'} for user ${userId}`);
    return matchingPrefs;
  } catch (error) {
    console.error('Error creating/updating matching preferences:', error);
    
    // Re-throw with code if it's a validation error
    if (error.code) {
      throw error;
    }
    
    // Generic database error
    const dbError = new Error('Failed to create/update matching preferences');
    dbError.code = 'MATCHING_PREFS_ERROR';
    throw dbError;
  }
};

/**
 * Gets matching preferences for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Matching preferences or null if not found
 */
const getMatchingPrefs = async (userId) => {
  try {
    const matchingPrefs = await MatchingPrefs.findByPk(userId);
    return matchingPrefs;
  } catch (error) {
    console.error('Error fetching matching preferences:', error);
    const dbError = new Error('Failed to fetch matching preferences');
    dbError.code = 'MATCHING_PREFS_FETCH_ERROR';
    throw dbError;
  }
};

module.exports = {
  createOrUpdateMatchingPrefs,
  getMatchingPrefs,
};
