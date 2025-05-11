/**
 * Mock Authentication service for testing
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 */
exports.registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = new User({
    name,
    email,
    password
  });

  await user.save();

  const authToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  await user.save();

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    tokens: {
      authToken,
      refreshToken
    }
  };
};

/**
 * Login user
 */
exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
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
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    tokens: {
      authToken,
      refreshToken
    }
  };
};

/**
 * Refresh token
 */
exports.refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 400;
    throw error;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'thinkforward-test-refresh-secret-key'
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
    const err = new Error('Invalid refresh token');
    err.statusCode = 401;
    throw err;
  }
};

/**
 * Logout user
 */
exports.logoutUser = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.refreshToken = null;
  await user.save();

  return true;
};
