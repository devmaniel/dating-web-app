const { uploadPhoto, deletePhoto, photoExists } = require('../services/storageService');
const { UserPhoto } = require('../models/index_sequelize');

/**
 * Upload a new photo
 * POST /photos/upload
 */
async function uploadPhotoHandler(req, res) {
  try {
    const { photoType } = req.body;
    const userId = req.user.id;
    const file = req.file;

    // Validate required fields
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'invalid_request',
        message: 'No file provided',
      });
    }

    if (!photoType) {
      return res.status(400).json({
        success: false,
        error: 'invalid_request',
        message: 'photoType is required',
      });
    }

    // Upload to S3
    const uploadResult = await uploadPhoto(file, userId, photoType);

    // Save metadata to database
    const userPhoto = await UserPhoto.create({
      user_id: userId,
      type: photoType,
      url: uploadResult.url,
      s3_key: uploadResult.key,
      size: uploadResult.size,
      mimetype: uploadResult.mimetype,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: userPhoto.id,
        url: userPhoto.url,
        type: userPhoto.type,
        uploadedAt: userPhoto.created_at,
      },
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'upload_failed',
      message: error.message || 'Failed to upload photo',
    });
  }
}

/**
 * Delete a photo
 * DELETE /photos/:photoId
 */
async function deletePhotoHandler(req, res) {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    // Find photo
    const userPhoto = await UserPhoto.findByPk(photoId);

    if (!userPhoto) {
      return res.status(404).json({
        success: false,
        error: 'not_found',
        message: 'Photo not found',
      });
    }

    // Verify ownership
    if (userPhoto.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'forbidden',
        message: 'You do not have permission to delete this photo',
      });
    }

    // Delete from S3
    if (userPhoto.s3_key) {
      await deletePhoto(userPhoto.s3_key);
    }

    // Delete from database
    await userPhoto.destroy();

    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Photo delete error:', error);
    return res.status(500).json({
      success: false,
      error: 'delete_failed',
      message: error.message || 'Failed to delete photo',
    });
  }
}

/**
 * Get user's photos
 * GET /photos
 */
async function getUserPhotosHandler(req, res) {
  try {
    const userId = req.user.id;

    const photos = await UserPhoto.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'type', 'url', 'created_at'],
    });

    return res.status(200).json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error('Get photos error:', error);
    return res.status(500).json({
      success: false,
      error: 'fetch_failed',
      message: error.message || 'Failed to fetch photos',
    });
  }
}

module.exports = {
  uploadPhotoHandler,
  deletePhotoHandler,
  getUserPhotosHandler,
};
