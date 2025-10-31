const { s3Client, S3_CONFIG } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

/**
 * Uploads a single file to S3
 * Generates unique keys using timestamp and UUID to prevent duplicates
 * @param {Object} file - Multer file object
 * @param {string} fileType - Type of file (profile_picture, cover_picture, album_photo)
 * @param {string} userId - User ID for unique naming
 * @returns {Promise<Object>} { s3_key, img_link, img_file_name }
 */
const uploadFileToS3 = async (file, fileType, userId) => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // Generate unique S3 key with folder structure
    // Using timestamp + UUID ensures no duplicate keys even if called multiple times
    const fileExtension = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const randomId = uuidv4().substring(0, 8);
    
    // Determine folder based on file type
    let folder = 'user_photos'; // default for profile_picture and cover_picture
    if (fileType.startsWith('album_photo')) {
      folder = 'user_album';
    }
    
    const s3_key = `${folder}/${fileType}_${userId}_${timestamp}_${randomId}.${fileExtension}`;

    // Upload parameters
    const params = {
      Bucket: S3_CONFIG.bucket,
      Key: s3_key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Note: ACL removed - bucket has ACL disabled for security
      // Files will be accessible via signed URLs or bucket policy
      Metadata: {
        'original-filename': file.originalname,
        'user-id': userId,
        'file-type': fileType,
        'upload-timestamp': timestamp.toString(),
      },
    };

    // Upload to S3
    const uploadResult = await s3Client.upload(params).promise();

    // Generate signed URL for accessing the image (valid for 1 hour)
    const signedUrl = s3Client.getSignedUrl('getObject', {
      Bucket: S3_CONFIG.bucket,
      Key: s3_key,
      Expires: 3600, // 1 hour in seconds
    }, (err, url) => {
      if (err) {
        console.error('Error generating signed URL:', err);
        return null;
      }
      return url;
    });

    // Return upload result with metadata
    return {
      s3_key: s3_key,
      img_link: signedUrl || uploadResult.Location, // Use signed URL or fallback to direct URL
      img_file_name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error(`Error uploading file to S3:`, error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

/**
 * Uploads profile picture to S3
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Upload result with S3 metadata
 */
const uploadProfilePicture = async (file, userId) => {
  return uploadFileToS3(file, 'profile_picture', userId);
};

/**
 * Uploads cover picture to S3
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Upload result with S3 metadata
 */
const uploadCoverPicture = async (file, userId) => {
  return uploadFileToS3(file, 'cover_picture', userId);
};

/**
 * Uploads multiple album photos to S3
 * Each file gets a unique S3 key (timestamp + UUID) so duplicates are allowed
 * @param {Array} files - Array of multer file objects
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of upload results with S3 metadata
 */
const uploadAlbumPhotos = async (files, userId) => {
  if (!files || files.length === 0) {
    throw new Error('No album photos provided');
  }

  try {
    // Each file gets uploaded with a unique S3 key (timestamp + UUID)
    // This allows the same photo to be uploaded multiple times if desired
    const uploadPromises = files.map((file, index) =>
      uploadFileToS3(file, `album_photo_${index + 1}`, userId)
    );

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error('Error uploading album photos to S3:', error);
    throw new Error(`Failed to upload album photos to S3: ${error.message}`);
  }
};

/**
 * Uploads all photos (profile, cover, and album) to S3
 * @param {Object} files - Object containing profile_picture, cover_picture, album_photos
 * @param {string} userId - User ID
 * @returns {Promise<Object>} { profile_picture, cover_picture, album_photos }
 */
const uploadAllPhotos = async (files, userId) => {
  try {
    const results = {
      profile_picture: null,
      cover_picture: null,
      album_photos: [],
    };

    // Upload profile picture
    if (files.profile_picture && files.profile_picture[0]) {
      results.profile_picture = await uploadProfilePicture(
        files.profile_picture[0],
        userId
      );
    }

    // Upload cover picture
    if (files.cover_picture && files.cover_picture[0]) {
      results.cover_picture = await uploadCoverPicture(
        files.cover_picture[0],
        userId
      );
    }

    // Upload album photos
    if (files.album_photos && files.album_photos.length > 0) {
      results.album_photos = await uploadAlbumPhotos(
        files.album_photos,
        userId
      );
    }

    return results;
  } catch (error) {
    console.error('Error uploading all photos to S3:', error);
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
  uploadProfilePicture,
  uploadCoverPicture,
  uploadAlbumPhotos,
  uploadAllPhotos,
};
