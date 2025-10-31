const { Profile, UserPhoto, UserAlbum, MatchingPrefs, LikedYou } = require('../models/index_sequelize');
const { Op } = require('sequelize');
const { estimateDistance } = require('../utils/locationParser');

/**
 * Fetch match profiles for a user based on their matching preferences
 * 
 * @param {string} userId - Current user's ID
 * @param {Object} filters - Optional filters from frontend
 * @param {Array<string>} filters.genderPreferences - Gender preferences
 * @param {Array<string>} filters.purposes - Purpose preferences
 * @param {Object} filters.ageRange - Age range {min, max}
 * @param {Object} filters.distanceRange - Distance range {min, max}
 * @returns {Promise<Array>} Array of matching profiles
 * @throws {Error} If fetching profiles fails
 */
const getMatchProfiles = async (userId, filters = {}) => {
  try {
    console.log('[matchService] Fetching profiles for user:', userId);
    console.log('[matchService] Filters:', filters);
    
    // Get current user's profile and matching preferences
    const currentUserProfile = await Profile.findByPk(userId);
    if (!currentUserProfile) {
      const error = new Error('User profile not found');
      error.code = 'PROFILE_NOT_FOUND';
      throw error;
    }

    // Get all profiles user has already interacted with (liked or rejected)
    // This includes cases where current user is the SENDER
    const interactedProfiles = await LikedYou.findAll({
      where: {
        sender_id: userId,
        // Include both pending, accepted, and rejected
        status: { [Op.in]: ['pending', 'accepted', 'rejected'] }
      },
      attributes: ['receiver_id']
    });

    // Get all profiles where OTHER users have interacted with current user
    // This includes cases where current user is the RECEIVER (any status)
    // This prevents showing profiles that already have pending/accepted/rejected likes from others
    const profilesWhoLikedYou = await LikedYou.findAll({
      where: {
        receiver_id: userId,
        status: { [Op.in]: ['pending', 'accepted', 'rejected'] }
      },
      attributes: ['sender_id']
    });

    const excludedUserIds = [
      ...interactedProfiles.map(like => like.receiver_id),
      ...profilesWhoLikedYou.map(like => like.sender_id)
    ];
    console.log('[matchService] Excluding', excludedUserIds.length, 'profiles (already interacted or received likes)');

    // Build query conditions
    const whereConditions = {
      user_id: { 
        [Op.ne]: userId, // Exclude current user
        [Op.notIn]: excludedUserIds // Exclude already liked/rejected profiles
      },
    };
    
    // Apply gender filter if provided
    if (filters.genderPreferences && filters.genderPreferences.length > 0) {
      whereConditions.gender = { [Op.in]: filters.genderPreferences };
      console.log('[matchService] ✅ GENDER FILTER APPLIED:', filters.genderPreferences);
      console.log('[matchService] Will only show profiles with gender IN:', filters.genderPreferences);
    } else {
      console.log('[matchService] ⚠️ NO GENDER FILTER - showing all genders');
    }

    console.log('[matchService] Query conditions:', whereConditions);

    // Fetch matching profiles with photos
    const profiles = await Profile.findAll({
      where: whereConditions,
      attributes: [
        'user_id',
        'first_name',
        'middle_name',
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
      limit: 50, // Limit to 50 profiles for performance
    });

    console.log('[matchService] Found profiles:', profiles.length);

    // Get user's matching preferences for distance filtering
    const matchingPrefs = await MatchingPrefs.findByPk(userId);
    const distanceMin = filters.distanceRange?.min ?? matchingPrefs?.distance_min_km ?? 0;
    const distanceMax = filters.distanceRange?.max ?? matchingPrefs?.distance_max_km ?? 100;
    console.log('[matchService] Distance filter:', distanceMin, '-', distanceMax, 'km');
    
    // Get age range from filters
    const ageMin = filters.ageRange?.min ?? 18;
    const ageMax = filters.ageRange?.max ?? 99;
    console.log('[matchService] Age filter:', ageMin, '-', ageMax);

    // Fetch photos for each profile and calculate distance
    const profilesWithPhotos = await Promise.all(
      profiles.map(async (profile) => {
        // Get profile picture
        const profilePicture = await UserPhoto.findOne({
          where: {
            user_id: profile.user_id,
            type: 'profile_picture',
          },
          attributes: ['img_link'],
        });

        // Get cover picture
        const coverPicture = await UserPhoto.findOne({
          where: {
            user_id: profile.user_id,
            type: 'cover_picture',
          },
          attributes: ['img_link'],
        });

        // Get album photos
        const albumPhotos = await UserAlbum.findAll({
          where: {
            user_id: profile.user_id,
          },
          attributes: ['img_link', 'position'],
          order: [['position', 'ASC']],
        });

        // Calculate age from birthdate
        const age = profile.birthdate 
          ? Math.floor((new Date() - new Date(profile.birthdate)) / (365.25 * 24 * 60 * 60 * 1000))
          : null;

        // Calculate distance between current user and profile
        const distance = estimateDistance(
          currentUserProfile.location,
          profile.location
        );

        return {
          id: profile.user_id,
          name: `${profile.first_name} ${profile.last_name}`,
          age,
          gender: profile.gender,
          imageUrl: profilePicture?.img_link || null,
          coverImageUrl: coverPicture?.img_link || null,
          education: `${profile.program} from ${profile.school}`,
          school: profile.school,
          program: profile.program,
          aboutMe: profile.about_me || '',
          lookingFor: profile.looking_for,
          location: profile.location,
          distanceKm: distance,
          interests: profile.interests || [],
          music: profile.music || [],
          photos: albumPhotos.map(photo => photo.img_link).filter(Boolean), // Only album photos, not PFP or cover
        };
      })
    );

    // Filter profiles by distance range and age
    const filteredProfiles = profilesWithPhotos.filter(profile => {
      const matchesDistance = profile.distanceKm >= distanceMin && profile.distanceKm <= distanceMax;
      const matchesAge = profile.age >= ageMin && profile.age <= ageMax;
      return matchesDistance && matchesAge;
    });

    console.log('[matchService] After distance and age filter:', filteredProfiles.length, 'profiles');

    return filteredProfiles;
  } catch (error) {
    console.error('Error fetching match profiles:', error);
    
    if (error.code === 'PROFILE_NOT_FOUND') {
      throw error;
    }
    
    const serviceError = new Error('Failed to fetch match profiles');
    serviceError.code = 'MATCH_FETCH_FAILED';
    throw serviceError;
  }
};

module.exports = {
  getMatchProfiles,
};
