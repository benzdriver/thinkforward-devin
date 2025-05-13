/**
 * Auth service tests
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../../../backend/models/User');
const authService = require('../../../../backend/services/authService');
const { clearDatabase } = require('../../setup/db');

describe('Auth Service', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const userData = {
        name: 'Test User Auth',
        email: 'test-auth-valid@example.com',
        password: 'password123'
      };
      
      await User.create(userData);
      
      const result = await authService.authenticateUser(userData.email, userData.password);
      
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.authToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw error for non-existent user', async () => {
      try {
        await authService.authenticateUser('nonexistent@example.com', 'password123');
        fail('Should have thrown error');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toContain('Invalid credentials');
      }
    });

    it('should throw error for invalid password', async () => {
      const userData = {
        name: 'Test User Auth Invalid',
        email: 'test-auth-invalid@example.com',
        password: 'password123'
      };
      
      await User.create(userData);
      
      try {
        await authService.authenticateUser(userData.email, 'wrongpassword');
        fail('Should have thrown error');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toContain('Invalid credentials');
      }
    });
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Test User Create',
        email: 'test-create-valid@example.com',
        password: 'password123'
      };
      
      const result = await authService.createUser(userData);
      
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.authToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
    });

    it('should throw error if user with email already exists', async () => {
      const userData = {
        name: 'Test User Create Duplicate',
        email: 'test-create-duplicate@example.com',
        password: 'password123'
      };
      
      await User.create(userData);
      
      try {
        await authService.createUser(userData);
        fail('Should have thrown error');
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain('User already exists');
      }
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const userData = {
        name: 'Test User Verify',
        email: 'test-verify@example.com',
        password: 'password123'
      };
      
      const user = await User.create(userData);
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'test-jwt-secret'
      );
      
      const result = await authService.verifyToken(token);
      
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.id.toString()).toBe(user._id.toString());
      expect(result.user.email).toBe(user.email);
    });

    it('should return invalid result for invalid token', async () => {
      const result = await authService.verifyToken('invalid-token');
      
      expect(result).toBeDefined();
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('logoutUser', () => {
    it('should clear refresh token on logout', async () => {
      const userData = {
        name: 'Test User Logout',
        email: 'test-logout@example.com',
        password: 'password123'
      };
      
      const user = await User.create(userData);
      user.refreshToken = 'some-refresh-token';
      await user.save();
      
      const result = await authService.logoutUser(user._id);
      
      expect(result).toBe(true);
      
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.refreshToken).toBeNull();
    });

    it('should throw error if user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      try {
        await authService.logoutUser(nonExistentId);
        fail('Should have thrown error');
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain('User not found');
      }
    });
  });
});
