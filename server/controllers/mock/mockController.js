const { User, Profile, UserPhoto, UserAlbum, MatchingPrefs } = require('../../models/index_sequelize');
const { generateCompleteUser } = require('../../utils/mockDataGenerator');

/**
 * Mock Data Controller
 * Handles endpoints for populating database with mock data
 */

/**
 * Generate and save 5 random users to database
 * GET /mock/users
 */
async function generateUsers(req, res) {
  try {
    console.log('🎭 Starting mock user generation...');
    
    const users = [];
    const userCount = 5;
    
    for (let i = 0; i < userCount; i++) {
      console.log(`📝 Generating user ${i + 1}/${userCount}...`);
      
      // Generate mock data
      const mockData = await generateCompleteUser();
      
      // Create user
      const user = await User.create(mockData.user);
      console.log(`👤 Created user: ${user.email}`);
      
      // Create profile
      const profile = await Profile.create({
        user_id: user.id,
        ...mockData.profile
      });
      console.log(`📋 Created profile for: ${profile.first_name} ${profile.last_name}`);
      
      // Create photos
      for (const photoData of mockData.photos) {
        await UserPhoto.create({
          user_id: user.id,
          ...photoData
        });
      }
      console.log(`📸 Created ${mockData.photos.length} photos`);
      
      // Create albums
      for (const albumData of mockData.albums) {
        await UserAlbum.create({
          user_id: user.id,
          ...albumData
        });
      }
      console.log(`🖼️ Created ${mockData.albums.length} album photos`);
      
      // Create matching preferences
      await MatchingPrefs.create({
        user_id: user.id,
        ...mockData.matchingPrefs
      });
      console.log(`⚙️ Created matching preferences`);
      
      users.push({
        id: user.id,
        email: user.email,
        name: `${profile.first_name} ${profile.last_name}`,
        gender: profile.gender,
        location: profile.location,
        school: profile.school,
        program: profile.program
      });
    }
    
    console.log('✅ Mock user generation completed!');
    
    res.status(201).json({
      success: true,
      message: `Successfully generated ${userCount} mock users`,
      data: {
        users_created: userCount,
        users: users
      }
    });
    
  } catch (error) {
    console.error('❌ Error generating mock users:', error);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to generate mock users',
      details: error.message
    });
  }
}

/**
 * Get all users with their profiles (for verification)
 * GET /mock/list
 */
async function listUsers(req, res) {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Profile,
          required: false
        },
        {
          model: UserPhoto,
          required: false
        },
        {
          model: UserAlbum,
          required: false
        },
        {
          model: MatchingPrefs,
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 20
    });
    
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      profile: user.Profile ? {
        name: `${user.Profile.first_name} ${user.Profile.last_name}`,
        gender: user.Profile.gender,
        age: user.Profile.birthdate ? Math.floor((new Date() - new Date(user.Profile.birthdate)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        location: user.Profile.location,
        school: user.Profile.school,
        program: user.Profile.program,
        interests: user.Profile.interests,
        music: user.Profile.music
      } : null,
      matching_prefs: user.MatchingPref ? {
        open_for_everyone: user.MatchingPref.open_for_everyone,
        gender_preferences: user.MatchingPref.gender_preferences,
        purpose_preference: user.MatchingPref.purpose_preference,
        distance_range: `${user.MatchingPref.distance_min_km}-${user.MatchingPref.distance_max_km}km`
      } : null,
      photos_count: user.UserPhotos ? user.UserPhotos.length : 0,
      albums_count: user.UserAlbums ? user.UserAlbums.length : 0,
      created_at: user.created_at
    }));
    
    res.json({
      success: true,
      message: `Found ${users.length} users`,
      data: {
        total_users: users.length,
        users: formattedUsers
      }
    });
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to list users',
      details: error.message
    });
  }
}

/**
 * Clear all mock data (for testing)
 * DELETE /mock/clear
 */
async function clearMockData(req, res) {
  try {
    console.log('🗑️ Clearing all mock data...');
    
    // Delete in correct order due to foreign key constraints
    const albumsDeleted = await UserAlbum.destroy({ where: {} });
    const photosDeleted = await UserPhoto.destroy({ where: {} });
    const matchingPrefsDeleted = await MatchingPrefs.destroy({ where: {} });
    const profilesDeleted = await Profile.destroy({ where: {} });
    const usersDeleted = await User.destroy({ where: {} });
    
    console.log('✅ Mock data cleared successfully!');
    
    res.json({
      success: true,
      message: 'All mock data cleared successfully',
      data: {
        users_deleted: usersDeleted,
        profiles_deleted: profilesDeleted,
        photos_deleted: photosDeleted,
        albums_deleted: albumsDeleted,
        matching_prefs_deleted: matchingPrefsDeleted
      }
    });
    
  } catch (error) {
    console.error('❌ Error clearing mock data:', error);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to clear mock data',
      details: error.message
    });
  }
}

/**
 * Get database statistics
 * GET /mock/stats
 */
async function getStats(req, res) {
  try {
    const userCount = await User.count();
    const profileCount = await Profile.count();
    const photoCount = await UserPhoto.count();
    const albumCount = await UserAlbum.count();
    const matchingPrefsCount = await MatchingPrefs.count();
    
    // Get gender distribution
    const genderStats = await Profile.findAll({
      attributes: [
        'gender',
        [Profile.sequelize.fn('COUNT', Profile.sequelize.col('gender')), 'count']
      ],
      group: ['gender'],
      raw: true
    });
    
    res.json({
      success: true,
      message: 'Database statistics',
      data: {
        totals: {
          users: userCount,
          profiles: profileCount,
          photos: photoCount,
          albums: albumCount,
          matching_prefs: matchingPrefsCount
        },
        gender_distribution: genderStats,
        last_updated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: 'Failed to get statistics',
      details: error.message
    });
  }
}

module.exports = {
  generateUsers,
  listUsers,
  clearMockData,
  getStats
};
