const { verifyToken, extractTokenFromHeader } = require('../utils/tokenManager');

/**
 * Middleware to verify JWT token in Authorization header
 * Attaches decoded token to req.user
 */
function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'missing_token',
        message: 'Authorization token is required',
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);

    if (error.code === 'TOKEN_EXPIRED') {
      return res.status(401).json({
        success: false,
        error: 'token_expired',
        message: 'Token has expired',
      });
    }

    if (error.code === 'INVALID_TOKEN') {
      return res.status(401).json({
        success: false,
        error: 'invalid_token',
        message: 'Invalid token',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'unauthorized',
      message: 'Unauthorized',
    });
  }
}

module.exports = {
  verifyJWT,
};
