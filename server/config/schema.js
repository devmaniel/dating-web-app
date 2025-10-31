const pool = require('./database');

// SQL to create enums and tables
const schema = `
  -- Create ENUM types
  DO $$ BEGIN
    CREATE TYPE gender AS ENUM ('male', 'female', 'nonbinary');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE purpose AS ENUM ('study-buddy', 'date', 'bizz');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE photo_type AS ENUM ('card_preview', 'pfp', 'album');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  -- Create users table
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );

  -- Create profiles table
  CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    gender gender NOT NULL,
    birthdate DATE NOT NULL,
    location VARCHAR(100),
    school VARCHAR(100),
    program VARCHAR(100),
    about_me VARCHAR(500),
    looking_for TEXT,
    interests JSON,
    music JSON,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );

  -- Create matching_prefs table
  CREATE TABLE IF NOT EXISTS matching_prefs (
    user_id UUID PRIMARY KEY REFERENCES profiles(user_id) ON DELETE CASCADE,
    open_for_everyone BOOLEAN NOT NULL DEFAULT false,
    gender_preferences JSON,
    purpose_preference JSON,
    distance_min_km INT NOT NULL DEFAULT 0,
    distance_max_km INT NOT NULL DEFAULT 100,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );

  -- Create user_photos table
  CREATE TABLE IF NOT EXISTS user_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    type photo_type NOT NULL,
    url TEXT NOT NULL,
    position INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, type, position)
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_photos_type ON user_photos(type);
`;

/**
 * Initialize database schema
 * Creates all tables and enums if they don't exist
 */
const initializeSchema = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Initializing database schema...');
    await client.query(schema);
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing schema:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { initializeSchema };
