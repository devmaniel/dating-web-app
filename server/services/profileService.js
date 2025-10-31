const { Profile, UserPhoto, UserAlbum } = require('../models/index_sequelize');
const { trimLocationForDB } = require('../utils/locationParser');

/**
 * Updates user profile with onboarding completion data
 * @param {string} userId - User ID (UUID)
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.first_name - First name
 * @param {string} profileData.middle_name - Middle name (optional)
 * @param {string} profileData.last_name - Last name
 * @param {string} profileData.gender - Gender (male, female, nonbinary)
 * @param {string} profileData.location - Location/City
 * @param {string} profileData.school - School name
 * @param {string} profileData.program - Program/Major
 * @param {string} profileData.looking_for - What they're looking for
 * @param {Array} profileData.interests - Array of interests
 * @param {Array} profileData.music - Array of music objects with name, artists, albumName, albumCoverUrl
 * @returns {Promise<Object>} Updated profile object
 * @throws {Error} If profile not found or update fails
 */
const updateProfileCompletion = async (userId, profileData) => {
  try {
    // Find existing profile
    const profile = await Profile.findByPk(userId);

    if (!profile) {
      const error = new Error('Profile not found');
      error.code = 'PROFILE_NOT_FOUND';
      throw error;
    }

    // Update profile with all provided data
    const updatedProfile = await profile.update({
      first_name: profileData.first_name,
      middle_name: profileData.middle_name || null,
      last_name: profileData.last_name,
      gender: profileData.gender,
      location: trimLocationForDB(profileData.location), // Trim to "City, State" format
      school: profileData.school,
      program: profileData.program,
      about_me: profileData.about_me || null,
      looking_for: profileData.looking_for,
      interests: profileData.interests, // Stored as JSON
      music: profileData.music, // Stored as JSON
      // updated_at is automatically set by Sequelize
    });

    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile completion:', error);
    throw error;
  }
};

/**
 * Creates or updates user photos (profile picture, cover picture, and album photos)
 * Stores S3 URLs and metadata, handles duplicate entries by updating existing records
 * Prevents duplicate uploads by checking if the same S3 key already exists
 * @param {string} userId - User ID (UUID)
 * @param {Object} photoData - Photo data from S3 upload
 * @param {Object} photoData.profile_picture - Profile picture data { img_file_name, img_link, s3_key, size, mimetype }
 * @param {Object} photoData.cover_picture - Cover picture data { img_file_name, img_link, s3_key, size, mimetype }
 * @param {Array} photoData.album_photos - Album photos array [{ img_file_name, img_link, s3_key, size, mimetype }]
 * @returns {Promise<Object>} Object with created/updated photos
 * @throws {Error} If creation fails
 */
const createUserPhotos = async (userId, photoData) => {
  try {
    const { profile_picture, cover_picture, album_photos } = photoData;

    // Get existing photos for deduplication check and potential S3 cleanup
    const existingProfilePhoto = await UserPhoto.findOne({
      where: { user_id: userId, type: 'profile_picture' }
    });
    const existingCoverPhoto = await UserPhoto.findOne({
      where: { user_id: userId, type: 'cover_picture' }
    });
    const existingAlbumPhotos = await UserAlbum.findAll({
      where: { user_id: userId }
    });

    // Check for duplicate profile picture - if same S3 key exists, skip update
    if (existingProfilePhoto?.s3_key === profile_picture.s3_key) {
      console.log(`Duplicate profile picture detected (${profile_picture.s3_key}), skipping database update`);
    }

    // Check for duplicate cover picture - if same S3 key exists, skip update
    if (existingCoverPhoto?.s3_key === cover_picture.s3_key) {
      console.log(`Duplicate cover picture detected (${cover_picture.s3_key}), skipping database update`);
    }

    // Log existing S3 keys for potential cleanup (future enhancement)
    if (existingProfilePhoto?.s3_key && existingProfilePhoto.s3_key !== profile_picture.s3_key) {
      console.log(`TODO: Delete old profile picture from S3: ${existingProfilePhoto.s3_key}`);
    }
    if (existingCoverPhoto?.s3_key && existingCoverPhoto.s3_key !== cover_picture.s3_key) {
      console.log(`TODO: Delete old cover picture from S3: ${existingCoverPhoto.s3_key}`);
    }
    if (existingAlbumPhotos.length > 0) {
      existingAlbumPhotos.forEach(photo => {
        if (photo.s3_key) {
          console.log(`TODO: Delete old album photo from S3: ${photo.s3_key}`);
        }
      });
    }

    // Upsert profile picture (create or update if exists)
    const [profilePhoto] = await UserPhoto.upsert({
      user_id: userId,
      type: 'profile_picture',
      img_file_name: profile_picture.img_file_name,
      img_link: profile_picture.img_link, // S3 URL
      s3_key: profile_picture.s3_key, // S3 object key
      size: profile_picture.size,
      mimetype: profile_picture.mimetype,
    }, {
      returning: true,
    });

    // Upsert cover picture (create or update if exists)
    const [coverPhoto] = await UserPhoto.upsert({
      user_id: userId,
      type: 'cover_picture',
      img_file_name: cover_picture.img_file_name,
      img_link: cover_picture.img_link, // S3 URL
      s3_key: cover_picture.s3_key, // S3 object key
      size: cover_picture.size,
      mimetype: cover_picture.mimetype,
    }, {
      returning: true,
    });

    // For album photos, delete existing ones and create new ones
    // This ensures we don't have duplicate positions
    await UserAlbum.destroy({
      where: { user_id: userId }
    });

    // Create new album photos (only if provided)
    // Filter out any photos that match PFP or cover picture S3 keys to prevent duplicates
    let albumPhotos = [];
    if (album_photos && album_photos.length > 0) {
      const pfpKey = profile_picture.s3_key;
      const coverKey = cover_picture.s3_key;
      
      const filteredAlbumPhotos = album_photos.filter(photo => 
        photo.s3_key !== pfpKey && photo.s3_key !== coverKey
      );
      
      if (filteredAlbumPhotos.length > 0) {
        albumPhotos = await Promise.all(
          filteredAlbumPhotos.map((photo, index) =>
            UserAlbum.create({
              user_id: userId,
              img_file_name: photo.img_file_name,
              img_link: photo.img_link, // S3 URL
              s3_key: photo.s3_key, // S3 object key
              position: index + 1,
              size: photo.size,
              mimetype: photo.mimetype,
            })
          )
        );
      }
      
      if (album_photos.length !== filteredAlbumPhotos.length) {
        console.log(`Filtered out ${album_photos.length - filteredAlbumPhotos.length} duplicate photos (PFP/cover) from albums`);
      }
    }

    return {
      profile_picture: profilePhoto,
      cover_picture: coverPhoto,
      album_photos: albumPhotos,
    };
  } catch (error) {
    console.error('Error creating/updating user photos:', error);
    throw error;
  }
};

module.exports = {
  updateProfileCompletion,
  createUserPhotos,
};
