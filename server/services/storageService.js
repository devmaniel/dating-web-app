const { s3Client, S3_CONFIG } = require('../config/s3');
const { generateS3Key, validateFile, validatePhotoType, generateS3Url } = require('../utils/s3Utils');

/**
 * Upload photo to S3
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID
 * @param {string} photoType - Type of photo (profile, gallery)
 * @returns {Promise<Object>} - { key, url, size, mimetype }
 */
async function uploadPhoto(file, userId, photoType) {
  // Validate inputs
  const fileErrors = validateFile(file);
  if (fileErrors.length > 0) {
    throw new Error(`File validation failed: ${fileErrors.join(', ')}`);
  }

  const photoTypeError = validatePhotoType(photoType);
  if (photoTypeError) {
    throw new Error(photoTypeError);
  }

  // Generate S3 key
  const key = generateS3Key(userId, photoType, file.mimetype);

  // Upload to S3
  const params = {
    Bucket: S3_CONFIG.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      userId,
      photoType,
      uploadedAt: new Date().toISOString(),
    },
  };

  try {
    await s3Client.upload(params).promise();

    return {
      key,
      url: generateS3Url(key),
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

/**
 * Delete photo from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
async function deletePhoto(key) {
  const params = {
    Bucket: S3_CONFIG.bucket,
    Key: key,
  };

  try {
    await s3Client.deleteObject(params).promise();
  } catch (error) {
    throw new Error(`S3 delete failed: ${error.message}`);
  }
}

/**
 * Get signed URL for private photo access
 * @param {string} key - S3 object key
 * @param {number} expirySeconds - URL expiry time in seconds
 * @returns {Promise<string>} - Signed URL
 */
async function getSignedUrl(key, expirySeconds = S3_CONFIG.signedUrlExpiry) {
  const params = {
    Bucket: S3_CONFIG.bucket,
    Key: key,
    Expires: expirySeconds,
  };

  try {
    return await s3Client.getSignedUrlPromise('getObject', params);
  } catch (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Delete multiple photos from S3
 * @param {string[]} keys - Array of S3 object keys
 * @returns {Promise<Object>} - { deleted: number, failed: number }
 */
async function deletePhotos(keys) {
  if (!keys || keys.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const params = {
    Bucket: S3_CONFIG.bucket,
    Delete: {
      Objects: keys.map(key => ({ Key: key })),
    },
  };

  try {
    const result = await s3Client.deleteObjects(params).promise();
    return {
      deleted: result.Deleted?.length || 0,
      failed: result.Errors?.length || 0,
    };
  } catch (error) {
    throw new Error(`Batch delete failed: ${error.message}`);
  }
}

/**
 * Check if object exists in S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>}
 */
async function photoExists(key) {
  const params = {
    Bucket: S3_CONFIG.bucket,
    Key: key,
  };

  try {
    await s3Client.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw new Error(`Failed to check photo existence: ${error.message}`);
  }
}

module.exports = {
  uploadPhoto,
  deletePhoto,
  getSignedUrl,
  deletePhotos,
  photoExists,
};
