const bcrypt = require('bcrypt');
const { User, Profile } = require('../models/index_sequelize');
const { generateToken } = require('../utils/tokenManager');

/**
 * Create a new user account with initial profile
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @param {string} birthdate - User birthdate (YYYY-MM-DD)
 * @returns {Promise<{id: string, email: string, message: string}>}
 * @throws {Error} If email exists or database operation fails
 * 
 * Note: Profile is created with only birthdate (required).
 * All other profile fields (first_name, last_name, gender, etc.) are nullable
 * and will be filled during the onboarding process.
 */
async function createUser(email, password, birthdate) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Invalid email format');
      error.code = 'INVALID_EMAIL';
      throw error;
    }

    // Validate birthdate format (YYYY-MM-DD)
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(birthdate)) {
      const error = new Error('Invalid birthdate format. Use YYYY-MM-DD');
      error.code = 'INVALID_BIRTHDATE';
      throw error;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      password_hash,
    });

    // Create profile with only birthdate (required field)
    // Other fields will be filled during onboarding
    await Profile.create({
      user_id: user.id,
      birthdate: new Date(birthdate),
      // All other fields are nullable and will be set during onboarding:
      // first_name, last_name, middle_name, gender, location, school, program,
      // looking_for, interests, music
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      token: token,
      message: 'User created successfully',
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Verify user credentials during sign in
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<{id: string, email: string, message: string}>}
 * @throws {Error} If credentials are invalid
 */
async function verifyCredentials(email, password) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Invalid credentials');
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      token: token,
      message: 'Sign in successful',
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  verifyCredentials,
};
