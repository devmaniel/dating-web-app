const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

/**
 * Conversation Model
 * Tracks conversations between matched users
 * 
 * @typedef {Object} Conversation
 * @property {string} id - UUID primary key
 * @property {string} participant_one_id - First participant (lower UUID)
 * @property {string} participant_two_id - Second participant (higher UUID)
 * @property {string} status - Conversation status: active, unmatched
 * @property {string} liked_you_id - Reference to the like that created this match
 * @property {Date} last_message_at - Timestamp of last message (for sorting)
 * @property {Date} created_at - When the conversation was created
 * @property {Date} updated_at - When the conversation was last updated
 */
const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  participant_one_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  participant_two_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('active', 'unmatched'),
    allowNull: false,
    defaultValue: 'active',
  },
  liked_you_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'liked_you',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  last_message_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
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
  tableName: 'conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      // Prevent duplicate conversations between same participants
      unique: true,
      fields: ['participant_one_id', 'participant_two_id'],
      name: 'unique_participants',
    },
    {
      // Fast lookup for user's conversations
      fields: ['participant_one_id', 'status'],
      name: 'participant_one_status_idx',
    },
    {
      // Fast lookup for user's conversations
      fields: ['participant_two_id', 'status'],
      name: 'participant_two_status_idx',
    },
    {
      // Fast sorting by last message
      fields: ['status', 'last_message_at'],
      name: 'status_last_message_idx',
    },
    {
      // Fast lookup by liked_you_id
      fields: ['liked_you_id'],
      name: 'liked_you_idx',
    },
  ],
});

/**
 * Define associations
 * This will be called in models/index_sequelize.js
 */
Conversation.associate = (models) => {
  // Participant One association
  Conversation.belongsTo(models.User, {
    foreignKey: 'participant_one_id',
    as: 'participantOne',
    onDelete: 'CASCADE',
  });

  // Participant Two association
  Conversation.belongsTo(models.User, {
    foreignKey: 'participant_two_id',
    as: 'participantTwo',
    onDelete: 'CASCADE',
  });

  // LikedYou association
  Conversation.belongsTo(models.LikedYou, {
    foreignKey: 'liked_you_id',
    as: 'likedYou',
    onDelete: 'CASCADE',
  });

  // Messages association
  Conversation.hasMany(models.Message, {
    foreignKey: 'conversation_id',
    as: 'messages',
    onDelete: 'CASCADE',
  });
};

module.exports = Conversation;
