/**
 * Migration: Update liked_you status enum to include 'unmatched'
 * Run: node server/migrations/003_update_liked_you_status.js
 */

const sequelize = require('../config/sequelize');

async function up() {
  const queryInterface = sequelize.getQueryInterface();

  // PostgreSQL: Alter ENUM type
  // Note: This is PostgreSQL-specific. For MySQL, you'd use MODIFY COLUMN
  await sequelize.query(`
    ALTER TYPE "enum_liked_you_status" ADD VALUE IF NOT EXISTS 'unmatched';
  `);

  console.log('✅ liked_you status enum updated successfully');
}

async function down() {
  // Note: Removing enum values is complex in PostgreSQL
  // This is a simplified rollback - in production, you'd need to handle existing data
  console.log('⚠️  Rolling back enum changes is complex. Manual intervention may be required.');
  console.log('⚠️  Existing "unmatched" status values should be changed before removing the enum value.');
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
