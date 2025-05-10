/**
 * Authentication middleware for protecting routes
 */
const jwt = require('jsonwebtoken');
const { translateError } = require('../utils/errorHandler');

/**
 * Middleware to verify JWT token and authenticate users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: translateError(new Error('Authentication required'), req.locale || 'en').message
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thinkforward-secret-key');
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: translateError(new Error('Token expired'), req.locale || 'en').message,
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: translateError(new Error('Authentication failed'), req.locale || 'en').message
    });
  }
};
