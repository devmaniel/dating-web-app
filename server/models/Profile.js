const pool = require('../config/database');

class Profile {
  /**
   * Create a new profile
   */
  static async create(profileData) {
    const {
      userId,
      firstName,
      middleName,
      lastName,
      gender,
      birthdate,
      location,
      school,
      program,
      lookingFor,
      interests,
      music,
    } = profileData;

    const query = `
      INSERT INTO profiles (
        user_id, first_name, middle_name, last_name, gender, birthdate,
        location, school, program, looking_for, interests, music
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const values = [
      userId,
      firstName,
      middleName || null,
      lastName,
      gender,
      birthdate,
      location || null,
      school || null,
      program || null,
      lookingFor || null,
      interests ? JSON.stringify(interests) : null,
      music ? JSON.stringify(music) : null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find profile by user ID
   */
  static async findByUserId(userId) {
    const query = `SELECT * FROM profiles WHERE user_id = $1;`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Update profile
   */
  static async update(userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${paramCount}`);
      if (typeof value === 'object' && value !== null) {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
      paramCount++;
    }

    values.push(userId);
    const query = `
      UPDATE profiles
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE user_id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete profile
   */
  static async delete(userId) {
    const query = `DELETE FROM profiles WHERE user_id = $1 RETURNING user_id;`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all profiles
   */
  static async findAll() {
    const query = `SELECT * FROM profiles ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Profile;
