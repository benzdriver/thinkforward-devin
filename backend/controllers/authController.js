/**
 * Authentication controller for handling auth-related requests
 */
const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { translateError } = require('../utils/errorHandler');

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
    const locale = req.locale || 'en';
    
    const result = await authService.authenticateUser(email, password, locale);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during login'
    });
  }
};

/**
 * Register new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { name, email, password } = req.body;
    const locale = req.locale || 'en';
    
    const result = await authService.createUser({ name, email, password }, locale);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during registration'
    });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const locale = req.locale || 'en';
    
    await authService.logoutUser(userId, locale);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during logout'
    });
  }
};

/**
 * Reset password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email } = req.body;
    const locale = req.locale || 'en';
    
    const result = await authService.sendPasswordResetEmail(email, locale);
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      data: result
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during password reset'
    });
  }
};

/**
 * Change password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const locale = req.locale || 'en';
    
    await authService.changePassword(userId, currentPassword, newPassword, locale);
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during password change'
    });
  }
};

/**
 * Refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const locale = req.locale || 'en';
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    const tokens = await authService.generateTokens(refreshToken, locale);
    
    res.status(200).json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during token refresh',
      code: error.code
    });
  }
};

/**
 * Validate token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const locale = req.locale || 'en';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const result = await authService.verifyToken(token, locale);
    
    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: result.message,
        code: result.code
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Validate token error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during token validation'
    });
  }
};
