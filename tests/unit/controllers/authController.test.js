const authController = require('../../../backend/controllers/authController');
const authService = require('../../../backend/services/authService');

jest.mock('../../../backend/services/authService');

describe('Authentication Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      body: {},
      locale: 'en'
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
  });
  
  test('should login user with valid credentials', async () => {
    req.body = {
      email: 'user@example.com',
      password: 'password123'
    };
    
    const mockAuthResult = {
      user: { id: 'userId', name: 'Test User', email: 'user@example.com' },
      tokens: { authToken: 'auth-token', refreshToken: 'refresh-token' }
    };
    
    authService.authenticateUser.mockResolvedValue(mockAuthResult);
    
    await authController.login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockAuthResult
    });
  });
  
  test('should handle login error', async () => {
    req.body = {
      email: 'user@example.com',
      password: 'wrongpass'
    };
    
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    authService.authenticateUser.mockRejectedValue(error);
    
    await authController.login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid credentials'
    });
  });
  
  test('should register new user', async () => {
    req.body = {
      name: 'New User',
      email: 'new@example.com',
      password: 'newpassword'
    };
    
    const mockCreateResult = {
      user: { id: 'newUserId', name: 'New User', email: 'new@example.com' },
      tokens: { authToken: 'new-auth-token', refreshToken: 'new-refresh-token' }
    };
    
    authService.createUser.mockResolvedValue(mockCreateResult);
    
    await authController.register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockCreateResult
    });
  });
  
  test('should handle registration error', async () => {
    req.body = {
      name: 'Duplicate User',
      email: 'existing@example.com',
      password: 'password'
    };
    
    const error = new Error('User already exists with this email');
    error.statusCode = 400;
    authService.createUser.mockRejectedValue(error);
    
    await authController.register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists with this email'
    });
  });
  
  test('should refresh tokens with valid refresh token', async () => {
    req.body = {
      refreshToken: 'valid-refresh-token'
    };
    
    const mockTokens = {
      authToken: 'new-auth-token',
      refreshToken: 'new-refresh-token'
    };
    
    authService.generateTokens.mockResolvedValue(mockTokens);
    
    await authController.refreshToken(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockTokens
    });
  });
  
  test('should handle refresh token error', async () => {
    req.body = {
      refreshToken: 'invalid-refresh-token'
    };
    
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    authService.generateTokens.mockRejectedValue(error);
    
    await authController.refreshToken(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid refresh token'
    });
  });
  
  test('should validate token', async () => {
    req.user = {
      id: 'userId',
      email: 'user@example.com',
      role: 'user'
    };
    
    await authController.validateToken(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        valid: true,
        user: req.user
      }
    });
  });
});
