const pool = require('../config/database');

/**
 * Check database health by running a simple query
 * @returns {Promise<{status: string, database: string, timestamp: string}>}
 */
async function checkDatabaseHealth() {
  try {
    const result = await pool.query('SELECT NOW()');
    
    return {
      status: 'UP',
      database: 'connected',
      timestamp: result.rows[0].now,
      message: 'Database is healthy'
    };
  } catch (error) {
    console.error('Database health check failed:', error.message);
    
    return {
      status: 'DOWN',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      message: `Database error: ${error.message}`
    };
  }
}

module.exports = {
  checkDatabaseHealth
};
