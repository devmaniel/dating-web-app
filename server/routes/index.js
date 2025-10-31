const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const photoRoutes = require('./photos');
const profileRoutes = require('./profile');
const matchRoutes = require('./match');
const mockRoutes = require('./mock');
const likeRoutes = require('./likes');
const conversationRoutes = require('./conversations');
const notificationRoutes = require('./notifications');

// Mount routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/photos', photoRoutes);
router.use('/profile', profileRoutes);
router.use('/match', matchRoutes);
router.use('/mock', mockRoutes);
router.use('/likes', likeRoutes);
router.use('/conversations', conversationRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
