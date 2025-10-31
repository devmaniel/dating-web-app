const { v4: uuidv4 } = require('uuid');
const { S3_CONFIG } = require('../config/s3');

/**
 * Generate S3 object key for photo storage
 * Format: users/{userId}/{photoType}/{timestamp}-{uuid}.{extension}
 */
function generateS3Key(userId, photoType, mimeType) {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  const extension = getExtensionFromMimeType(mimeType);
  
  return `users/${userId}/${photoType}/${timestamp}-${uuid}.${extension}`;
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType) {
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return mimeMap[mimeType] || 'jpg';
}

/**
 * Validate file before upload
 */
function validateFile(file) {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return errors;
  }

  // Check file size
  if (file.size > S3_CONFIG.maxFileSize) {
    errors.push(`File size exceeds maximum of ${S3_CONFIG.maxFileSize / 1024 / 1024}MB`);
  }

  // Check MIME type
  if (!S3_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} not allowed. Allowed types: ${S3_CONFIG.allowedMimeTypes.join(', ')}`);
  }

  return errors;
}

/**
 * Validate photo type
 */
function validatePhotoType(photoType) {
  if (!S3_CONFIG.photoTypes.includes(photoType)) {
    return `Invalid photo type. Allowed types: ${S3_CONFIG.photoTypes.join(', ')}`;
  }
  return null;
}

/**
 * Generate S3 object URL
 */
function generateS3Url(key) {
  return `${S3_CONFIG.baseUrl}/${key}`;
}

/**
 * Parse S3 key to extract metadata
 */
function parseS3Key(key) {
  const parts = key.split('/');
  return {
    userId: parts[1],
    photoType: parts[2],
    filename: parts[3],
  };
}

module.exports = {
  generateS3Key,
  getExtensionFromMimeType,
  validateFile,
  validatePhotoType,
  generateS3Url,
  parseS3Key,
};
