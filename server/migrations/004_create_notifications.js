/**
 * Migration: Create notifications table
 * Run: node server/migrations/004_create_notifications.js
 */

const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

async function up() {
  const queryInterface = sequelize.getQueryInterface();

  // Create notification_type enum
  await sequelize.query(`
    DO $$ BEGIN
      CREATE TYPE notification_type AS ENUM ('user_liked_you', 'message_received', 'mutual_match');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await queryInterface.createTable('notifications', {
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
  });

  // Create indexes for performance
  await queryInterface.addIndex('notifications', ['user_id'], {
    name: 'notifications_user_id_idx',
  });

  await queryInterface.addIndex('notifications', ['user_id', 'is_read'], {
    name: 'notifications_user_read_idx',
  });

  await queryInterface.addIndex('notifications', ['created_at'], {
    name: 'notifications_created_at_idx',
  });

  await queryInterface.addIndex('notifications', ['type'], {
    name: 'notifications_type_idx',
  });

  console.log('✅ Notifications table created successfully');
}

async function down() {
  const queryInterface = sequelize.getQueryInterface();
  
  // Drop table first
  await queryInterface.dropTable('notifications');
  
  // Drop enum type
  await sequelize.query('DROP TYPE IF EXISTS notification_type;');
  
  console.log('✅ Notifications table dropped successfully');
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
