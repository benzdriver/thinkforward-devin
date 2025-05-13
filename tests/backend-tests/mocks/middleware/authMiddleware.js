/**
 * Mock authMiddleware for testing
 */

const jwt = require('jsonwebtoken');
const User = require('../../mocks/models/User');

/**
 * Verify JWT token middleware
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-jwt-secret');
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = {
      id: user._id.toString(), // Controllers use req.user.id
      userId: user._id.toString(), // Some controllers might use req.user.userId
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin'
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Admin only middleware
 */
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};
