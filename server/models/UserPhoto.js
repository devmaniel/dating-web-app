const pool = require('../config/database');

class UserPhoto {
  /**
   * Create a new user photo
   */
  static async create(photoData) {
    const { userId, type, url, position } = photoData;

    const query = `
      INSERT INTO user_photos (user_id, type, url, position)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [userId, type, url, position || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find photos by user ID
   */
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM user_photos
      WHERE user_id = $1
      ORDER BY position ASC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Find photo by user ID and type
   */
  static async findByUserIdAndType(userId, type) {
    const query = `
      SELECT * FROM user_photos
      WHERE user_id = $1 AND type = $2
      ORDER BY position ASC;
    `;
    const result = await pool.query(query, [userId, type]);
    return result.rows;
  }

  /**
   * Find photo by ID
   */
  static async findById(id) {
    const query = `SELECT * FROM user_photos WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Update photo
   */
  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id);
    const query = `
      UPDATE user_photos
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete photo
   */
  static async delete(id) {
    const query = `DELETE FROM user_photos WHERE id = $1 RETURNING id;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Delete all photos for a user
   */
  static async deleteByUserId(userId) {
    const query = `DELETE FROM user_photos WHERE user_id = $1 RETURNING id;`;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get all photos
   */
  static async findAll() {
    const query = `SELECT * FROM user_photos ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = UserPhoto;
