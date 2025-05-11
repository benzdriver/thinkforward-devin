const authService = require('../../../backend/services/authService');
const User = require('../../../backend/models/User');
const { createTestUser } = require('../../utils/test-utils');

jest.mock('../../../backend/utils/errorHandler', () => ({
  translateError: jest.fn(error => error)
}));

describe('Authentication Service', () => {
  test('should authenticate user with valid credentials', async () => {
    const testUser = await createTestUser();
    
    const result = await authService.authenticateUser(
      testUser.email, 
      'password123', 
      'en'
    );
    
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('tokens');
    expect(result.user.id.toString()).toBe(testUser._id.toString());
    expect(result.user.email).toBe(testUser.email);
    expect(result.tokens).toHaveProperty('authToken');
    expect(result.tokens).toHaveProperty('refreshToken');
  });
  
  test('should throw error for invalid credentials', async () => {
    const testUser = await createTestUser();
    
    await expect(
      authService.authenticateUser(testUser.email, 'wrongpass', 'en')
    ).rejects.toThrow('Invalid credentials');
    
    await expect(
      authService.authenticateUser('nonexistent@example.com', 'password123', 'en')
    ).rejects.toThrow('Invalid credentials');
  });
  
  test('should create a new user', async () => {
    const userData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'newpassword'
    };
    
    const result = await authService.createUser(userData, 'en');
    
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('tokens');
    expect(result.user.name).toBe(userData.name);
    expect(result.user.email).toBe(userData.email);
  });
  
  test('should throw error for duplicate email', async () => {
    const testUser = await createTestUser();
    
    await expect(
      authService.createUser({
        name: 'Duplicate User',
        email: testUser.email,
        password: 'anotherpass'
      }, 'en')
    ).rejects.toThrow('User already exists with this email');
  });
  
  test('should generate new tokens with valid refresh token', async () => {
    const testUser = await createTestUser();
    const refreshToken = testUser.generateRefreshToken();
    await testUser.save();
    
    const result = await authService.generateTokens(refreshToken, 'en');
    
    expect(result).toHaveProperty('authToken');
    expect(result).toHaveProperty('refreshToken');
  });
  
  test('should throw error for invalid refresh token', async () => {
    await expect(
      authService.generateTokens('invalid-token', 'en')
    ).rejects.toThrow();
  });
});
