const { getMatchProfiles } = require('../services/matchService');

/**
 * POST /match/profiles
 * Fetches match profiles for the current user with optional filters
 * 
 * @param {Object} req - Express request object
 * @param {string} req.user.id - User ID from JWT token
 * @param {Object} req.body.filters - Optional filters
 * @param {Array<string>} req.body.filters.genderPreferences - Gender preferences
 * @param {Array<string>} req.body.filters.purposes - Purpose preferences
 * @param {Object} req.body.filters.ageRange - Age range {min, max}
 * @param {Object} req.body.filters.distanceRange - Distance range {min, max}
 * @param {Object} res - Express response object
 * @returns {Object} Array of matching profiles
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
const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.body.filters || {};
    
    console.log('[matchController] Fetching profiles with filters:', filters);

    const profiles = await getMatchProfiles(userId, filters);

    return res.status(200).json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    console.error('Error in getMatches controller:', error);

    if (error.code === 'PROFILE_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'profile_not_found',
        message: 'User profile not found',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'match_fetch_failed',
      message: 'Failed to fetch match profiles',
    });
  }
};

module.exports = {
  getMatches,
};
