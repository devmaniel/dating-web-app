const pool = require('../config/database');

class MatchingPrefs {
  /**
   * Create matching preferences
   */
  static async create(prefsData) {
    const {
      userId,
      openForEveryone,
      genderPreferences,
      purposePreference,
      distanceMinKm,
      distanceMaxKm,
    } = prefsData;

    const query = `
      INSERT INTO matching_prefs (
        user_id, open_for_everyone, gender_preferences, purpose_preference,
        distance_min_km, distance_max_km
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      userId,
      openForEveryone || false,
      genderPreferences ? JSON.stringify(genderPreferences) : null,
      purposePreference ? JSON.stringify(purposePreference) : null,
      distanceMinKm || 0,
      distanceMaxKm || 100,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find preferences by user ID
   */
  static async findByUserId(userId) {
    const query = `SELECT * FROM matching_prefs WHERE user_id = $1;`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Update preferences
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
      UPDATE matching_prefs
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE user_id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete preferences
   */
  static async delete(userId) {
    const query = `DELETE FROM matching_prefs WHERE user_id = $1 RETURNING user_id;`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Get all preferences
   */
  static async findAll() {
    const query = `SELECT * FROM matching_prefs ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = MatchingPrefs;
