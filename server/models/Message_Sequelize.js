const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

/**
 * Message Model
 * Tracks messages sent in conversations
 * 
 * @typedef {Object} Message
 * @property {string} id - UUID primary key
 * @property {string} conversation_id - Conversation this message belongs to
 * @property {string} sender_id - User who sent the message
 * @property {string} content - Message content
 * @property {boolean} is_read - Whether the message has been read
 * @property {Date} created_at - When the message was sent
 * @property {Date} updated_at - When the message was last updated
 */
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'conversations',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      // Fast lookup for conversation messages
      fields: ['conversation_id', 'created_at'],
      name: 'conversation_created_idx',
    },
    {
      // Fast lookup for unread messages
      fields: ['conversation_id', 'is_read'],
      name: 'conversation_read_idx',
    },
    {
      // Fast lookup for sender's messages
      fields: ['sender_id'],
      name: 'sender_idx',
    },
  ],
});

/**
 * Define associations
 * This will be called in models/index_sequelize.js
 */
Message.associate = (models) => {
  // Conversation association
  Message.belongsTo(models.Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation',
    onDelete: 'CASCADE',
  });

  // Sender association
  Message.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender',
    onDelete: 'CASCADE',
  });
};

module.exports = Message;
