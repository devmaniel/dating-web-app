const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

/**
 * LikedYou Model
 * Tracks likes sent between users
 * 
 * @typedef {Object} LikedYou
 * @property {string} id - UUID primary key
 * @property {string} sender_id - User who sent the like
 * @property {string} receiver_id - User who received the like
 * @property {string} status - Like status: pending, accepted, rejected
 * @property {Date} created_at - When the like was sent
 * @property {Date} updated_at - When the like status was last updated
 */
const LikedYou = sequelize.define('LikedYou', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  receiver_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'unmatched'),
    allowNull: false,
    defaultValue: 'pending',
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
  tableName: 'liked_you',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      // Prevent duplicate likes from same sender to same receiver
      unique: true,
      fields: ['sender_id', 'receiver_id'],
      name: 'unique_sender_receiver',
    },
    {
      // Fast lookup for received likes
      fields: ['receiver_id', 'status'],
      name: 'receiver_status_idx',
    },
    {
      // Fast lookup for sent likes
      fields: ['sender_id', 'status'],
      name: 'sender_status_idx',
    },
  ],
});

/**
 * Define associations
 * This will be called in models/index_sequelize.js
 */
LikedYou.associate = (models) => {
  // Sender association
  LikedYou.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender',
    onDelete: 'CASCADE',
  });

  // Receiver association
  LikedYou.belongsTo(models.User, {
    foreignKey: 'receiver_id',
    as: 'receiver',
    onDelete: 'CASCADE',
  });
};

module.exports = LikedYou;
