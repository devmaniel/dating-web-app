const pool = require('../config/database');

/**
 * Migration: Add about_me column to profiles table
 * This adds a VARCHAR(500) column to store user's "About Me" text
 */
const addAboutMeColumn = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migration: Add about_me column to profiles table...');
    
    // Check if column already exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND column_name = 'about_me';
    `;
    
    const result = await client.query(checkQuery);
    
    if (result.rows.length > 0) {
      console.log('⚠️  Column about_me already exists, checking length...');
      
      // Update column length if it's less than 500
      const alterQuery = `
        ALTER TABLE profiles 
        ALTER COLUMN about_me TYPE VARCHAR(500);
      `;
      
      await client.query(alterQuery);
      console.log('✅ Updated about_me column to VARCHAR(500)');
    } else {
      // Add the column
      const addColumnQuery = `
        ALTER TABLE profiles 
        ADD COLUMN about_me VARCHAR(500);
      `;
      
      await client.query(addColumnQuery);
      console.log('✅ Added about_me column to profiles table');
    }
    
  } catch (error) {
    console.error('❌ Error running migration:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  addAboutMeColumn()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { addAboutMeColumn };
