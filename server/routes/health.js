const express = require('express');
const router = express.Router();
const { checkDatabaseHealth } = require('../services/healthCheck');
const { s3Client, S3_CONFIG } = require('../config/s3');

/**
 * GET /health
 * Returns comprehensive health status of the application, database, and S3
 */
router.get('/health', async (req, res) => {
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();

    // Check S3 connectivity
    let s3Status = 'UNKNOWN';
    let s3Message = 'S3 not configured';
    let s3Error = null;
    try {
      await s3Client.headBucket({ Bucket: S3_CONFIG.bucket }).promise();
      s3Status = 'UP';
      s3Message = `S3 bucket accessible: ${S3_CONFIG.bucket}`;
    } catch (error) {
      s3Status = 'DOWN';
      s3Error = error.code || error.name || 'Unknown error';
      const errorDetails = error.message || error.statusCode || 'No details';
      s3Message = `S3 error: ${s3Error} - ${errorDetails}`;
    }

    // Determine overall health
    const allHealthy = dbHealth.status === 'UP' && s3Status === 'UP';
    const overallStatus = allHealthy ? 'HEALTHY' : 'UNHEALTHY';

    const healthStatus = {
      overall: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      environment: process.env.NODE_ENV || 'development',
      services: {
        app: {
          status: 'UP',
          message: 'Server is running'
        },
        database: {
          status: dbHealth.status,
          message: dbHealth.message,
          database: dbHealth.database
        },
        s3: {
          status: s3Status,
          message: s3Message,
          bucket: S3_CONFIG.bucket,
          region: S3_CONFIG.region,
          ...(s3Error && { errorCode: s3Error })
        }
      }
    };

    // Return 200 if all UP, 503 if any DOWN
    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      overall: 'UNHEALTHY',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        app: { status: 'UP' },
        database: { status: 'UNKNOWN', error: 'Check failed' },
        s3: { status: 'UNKNOWN', error: 'Check failed' }
      }
    });
  }
});

module.exports = router;
