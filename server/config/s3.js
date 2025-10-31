const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

// Create S3 client
const s3Client = new AWS.S3({
  signatureVersion: 'v4',
  maxRetries: 3,
});

// S3 Configuration constants
const S3_CONFIG = {
  bucket: process.env.AWS_S3_BUCKET || 'dating-app-photos',
  region: process.env.AWS_REGION || 'us-east-1',
  baseUrl: process.env.AWS_S3_URL || `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
  allowedMimeTypes: (process.env.ALLOWED_PHOTO_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  photoTypes: ['profile', 'gallery'],
  signedUrlExpiry: 3600, // 1 hour in seconds
};

module.exports = {
  s3Client,
  S3_CONFIG,
};
