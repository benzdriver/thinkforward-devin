const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../backend/models/User');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  return await User.create({ ...defaultUser, ...userData });
};

const generateAuthToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'thinkforward-secret-key',
    { expiresIn: '1h' }
  );
};

const createObjectId = () => new mongoose.Types.ObjectId();

module.exports = {
  createTestUser,
  generateAuthToken,
  createObjectId
};
