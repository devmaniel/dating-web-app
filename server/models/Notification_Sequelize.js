const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

/**
 * Notification Model
 * Tracks notifications sent to users
 * 
 * Fields:
 * - id: UUID primary key
 * - user_id: User who receives the notification
 * - type: Notification type (user_liked_you, message_received, mutual_match)
 * - title: Notification title
 * - message: Notification message content
 * - data: Additional notification data (sender_id, like_id, etc.)
 * - is_read: Whether the notification has been read
 * - created_at: When the notification was created
 * - updated_at: When the notification was last updated
 */
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('user_liked_you', 'message_received', 'mutual_match'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      // Fast lookup for user notifications
      fields: ['user_id'],
      name: 'notifications_user_id_idx',
    },
    {
      // Fast lookup for unread notifications
      fields: ['user_id', 'is_read'],
      name: 'notifications_user_read_idx',
    },
    {
      // Fast lookup by creation date (for ordering)
      fields: ['created_at'],
      name: 'notifications_created_at_idx',
    },
    {
      // Fast lookup by notification type
      fields: ['type'],
      name: 'notifications_type_idx',
    },
  ],
});

/**
 * Define associations
 * This will be called in models/index_sequelize.js
 */
Notification.associate = (models) => {
  // User association
  Notification.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
  });
};

/**
 * Instance methods
 */
Notification.prototype.markAsRead = function() {
  this.is_read = true;
  return this.save();
};

/**
 * Static methods
 */

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.user_id - User ID to send notification to
 * @param {string} notificationData.type - Notification type
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {Object} [notificationData.data] - Additional data
 * @returns {Promise<Notification>} Created notification
 */
Notification.createNotification = async function(notificationData) {
  return await this.create(notificationData);
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} [options.limit=20] - Limit number of results
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {boolean} [options.unreadOnly=false] - Only return unread notifications
 * @returns {Promise<Notification[]>} User notifications
 */
Notification.getUserNotifications = async function(userId, options = {}) {
  const { limit = 20, offset = 0, unreadOnly = false } = options;
  
  const whereClause = { user_id: userId };
  if (unreadOnly) {
    whereClause.is_read = false;
  }

  return await this.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });
};

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Unread notification count
 */
Notification.getUnreadCount = async function(userId) {
  return await this.count({
    where: {
      user_id: userId,
      is_read: false,
    },
  });
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of updated notifications
 */
Notification.markAllAsRead = async function(userId) {
  const [updatedCount] = await this.update(
    { is_read: true },
    {
      where: {
        user_id: userId,
        is_read: false,
      },
    }
  );
  return updatedCount;
};

/**
 * Mark specific notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID (for security)
 * @returns {Promise<Notification|null>} Updated notification or null if not found
 */
Notification.markAsRead = async function(notificationId, userId) {
  const notification = await this.findOne({
    where: {
      id: notificationId,
      user_id: userId,
    },
  });

  if (!notification) {
    return null;
  }

  notification.is_read = true;
  await notification.save();
  return notification;
};

module.exports = Notification;
