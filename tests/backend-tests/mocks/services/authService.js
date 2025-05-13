/**
 * Mock authentication service for testing
 * Matches the actual backend implementation
 */
const User = require('../../mocks/models/User');
const jwt = require('jsonwebtoken');

/**
 * Authenticate user with email and password
 */
exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    
    const authToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    
    await user.save();
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens: {
        authToken,
        refreshToken
      }
    };
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

/**
 * Create a new user
 */
exports.createUser = async (userData) => {
  try {
    const { name, email, password } = userData;
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }
    
    const user = await User.create({
      name,
      email,
      password
    });
    
    const authToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    
    await user.save();
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens: {
        authToken,
        refreshToken
      }
    };
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

/**
 * Verify token validity
 */
exports.verifyToken = async (token) => {
  try {
    if (!token) {
      const error = new Error('Token is required');
      error.statusCode = 400;
      throw error;
    }
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'thinkforward-secret-key'
    );
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return {
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        valid: false,
        code: 'TOKEN_EXPIRED',
        message: 'Token expired'
      };
    }
    
    return {
      valid: false,
      message: 'Invalid token'
    };
  }
};

/**
 * Logout user by invalidating refresh token
 */
exports.logoutUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    user.refreshToken = null;
    await user.save();
    
    return true;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

/**
 * Change user password
 */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }
    
    user.password = newPassword;
    await user.save();
    
    return true;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};
