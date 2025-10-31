const pg = require('pg');
require('dotenv').config();

// Render/Heroku provides DATABASE_URL, local dev uses individual env vars
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool(
  connectionString
    ? {
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'dating_app_local',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }
);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
