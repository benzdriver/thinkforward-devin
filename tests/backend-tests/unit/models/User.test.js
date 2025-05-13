/**
 * User model tests
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../../backend/models/User');
const { clearDatabase } = require('../../setup/db');

describe('User Model', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should create a new user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe('user'); // Default role
  });

  it('should hash the password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    
    expect(user.password).not.toBe(userData.password);
    
    const isMatch = await user.comparePassword(userData.password);
    expect(isMatch).toBe(true);
  });

  it('should not rehash the password if not modified', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    const originalPassword = user.password;
    
    user.name = 'Updated Name';
    await user.save();
    
    expect(user.password).toBe(originalPassword);
  });

  it('should generate auth token', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    const token = user.generateAuthToken();
    
    expect(token).toBeDefined();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-jwt-secret');
    expect(decoded.userId.toString()).toBe(user._id.toString());
    expect(decoded.email).toBe(user.email);
    expect(decoded.role).toBe(user.role);
  });

  it('should generate refresh token and save it to user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    const refreshToken = user.generateRefreshToken();
    
    expect(refreshToken).toBeDefined();
    expect(user.refreshToken).toBe(refreshToken);
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'test-jwt-refresh-secret');
    expect(decoded.userId.toString()).toBe(user._id.toString());
  });

  it('should validate required fields', async () => {
    const userData = {};
    
    try {
      await User.create(userData);
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    }
  });

  it('should validate email format', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    };
    
    try {
      await User.create(userData);
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.email).toBeDefined();
    }
  });

  it('should validate password length', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'short'
    };
    
    try {
      await User.create(userData);
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.password).toBeDefined();
    }
  });
});
