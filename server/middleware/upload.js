const multer = require('multer');
const path = require('path');
const { S3_CONFIG } = require('../config/s3');

// Configure storage (temporary local storage before S3 upload)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!S3_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type: ${file.mimetype}`));
  }

  // Check file size (multer will also enforce this)
  if (file.size > S3_CONFIG.maxFileSize) {
    return cb(new Error(`File too large: ${file.size} bytes`));
  }

  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: S3_CONFIG.maxFileSize,
  },
});

module.exports = upload;
