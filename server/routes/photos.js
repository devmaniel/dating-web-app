const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyJWT } = require('../middleware/jwt');
const {
  uploadPhotoHandler,
  deletePhotoHandler,
  getUserPhotosHandler,
} = require('../controllers/photoController');

/**
 * POST /photos/upload
 * Upload a new photo
 * Requires: JWT authentication
 * Body: { photoType: 'profile' | 'gallery' }
 * File: multipart/form-data with 'photo' field
 */
router.post('/upload', verifyJWT, upload.single('photo'), uploadPhotoHandler);

/**
 * GET /photos
 * Get all photos for authenticated user
 * Requires: JWT authentication
 */
router.get('/', verifyJWT, getUserPhotosHandler);

/**
 * DELETE /photos/:photoId
 * Delete a specific photo
 * Requires: JWT authentication
 * Params: photoId (UUID)
 */
router.delete('/:photoId', verifyJWT, deletePhotoHandler);

module.exports = router;
