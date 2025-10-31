/**
 * Migration: Create conversations table
 * Run: node server/migrations/001_create_conversations.js
 */

const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

async function up() {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.createTable('conversations', {
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
  });

  // Create indexes
  await queryInterface.addIndex('conversations', ['participant_one_id', 'participant_two_id'], {
    unique: true,
    name: 'unique_participants',
  });

  await queryInterface.addIndex('conversations', ['participant_one_id', 'status'], {
    name: 'participant_one_status_idx',
  });

  await queryInterface.addIndex('conversations', ['participant_two_id', 'status'], {
    name: 'participant_two_status_idx',
  });

  await queryInterface.addIndex('conversations', ['status', 'last_message_at'], {
    name: 'status_last_message_idx',
  });

  await queryInterface.addIndex('conversations', ['liked_you_id'], {
    name: 'liked_you_idx',
  });

  console.log('✅ Conversations table created successfully');
}

async function down() {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.dropTable('conversations');
  console.log('✅ Conversations table dropped successfully');
}

// Run migration if called directly
if (require.main === module) {
  up()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { up, down };
