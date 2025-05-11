/**
 * Authentication service for user management
 */
const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { translateError } = require('../utils/errorHandler');

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - User data and tokens
 */
exports.authenticateUser = async (email, password, locale = 'en') => {
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
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Created user data and tokens
 */
exports.createUser = async (userData, locale = 'en') => {
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
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Generate new tokens using refresh token
 * @param {string} refreshToken - Refresh token
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - New tokens
 */
exports.generateTokens = async (refreshToken, locale = 'en') => {
  try {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }
    
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'thinkforward-refresh-secret-key'
    );
    
    const user = await User.findById(decoded.userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }
    
    const authToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();
    
    await user.save();
    
    return {
      authToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const customError = new Error('Refresh token expired');
      customError.statusCode = 401;
      customError.code = 'TOKEN_EXPIRED';
      throw translateError(customError, locale);
    }
    
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Verify token validity
 * @param {string} token - Auth token
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Token validity status
 */
exports.verifyToken = async (token, locale = 'en') => {
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
        message: translateError(new Error('Token expired'), locale).message
      };
    }
    
    return {
      valid: false,
      message: translateError(new Error('Invalid token'), locale).message
    };
  }
};

/**
 * Hash password securely
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Reset token and expiry
 */
exports.sendPasswordResetEmail = async (email, locale = 'en') => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      const error = new Error('User not found with this email');
      error.statusCode = 404;
      throw error;
    }
    
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    
    await user.save();
    
    
    return {
      resetToken,
      resetPasswordExpire: user.resetPasswordExpire
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Logout user by invalidating refresh token
 * @param {string} userId - User ID
 * @param {string} locale - User locale
 * @returns {Promise<boolean>} - Success status
 */
exports.logoutUser = async (userId, locale = 'en') => {
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
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} locale - User locale
 * @returns {Promise<boolean>} - Success status
 */
exports.changePassword = async (userId, currentPassword, newPassword, locale = 'en') => {
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
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};
