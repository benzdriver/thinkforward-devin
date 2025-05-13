/**
 * Auth controller tests
 */
const authController = require('../../../../backend/controllers/authController');
const authService = require('../../../../backend/services/authService');
const { validationResult } = require('express-validator');

jest.mock('../../../../backend/services/authService');
jest.mock('express-validator');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123' },
      headers: {},
      locale: 'en'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
    
    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });

  describe('login', () => {
    it('should return 200 and user data on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      const mockResult = {
        user: { id: 'user123', name: 'Test User', email: 'test@example.com' },
        tokens: { authToken: 'auth-token', refreshToken: 'refresh-token' }
      };
      
      authService.authenticateUser.mockResolvedValue(mockResult);
      
      await authController.login(req, res);
      
      expect(authService.authenticateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'en'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult
      });
    });

    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Email is required' }])
      });
      
      await authController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array)
      });
      expect(authService.authenticateUser).not.toHaveBeenCalled();
    });

    it('should return error status and message if service throws error', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      const mockError = new Error('Invalid credentials');
      mockError.statusCode = 401;
      
      authService.authenticateUser.mockRejectedValue(mockError);
      
      await authController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });
  });

  describe('register', () => {
    it('should return 201 and user data on successful registration', async () => {
      req.body = { 
        name: 'Test User',
        email: 'test@example.com', 
        password: 'password123' 
      };
      
      const mockResult = {
        user: { id: 'user123', name: 'Test User', email: 'test@example.com' },
        tokens: { authToken: 'auth-token', refreshToken: 'refresh-token' }
      };
      
      authService.createUser.mockResolvedValue(mockResult);
      
      await authController.register(req, res);
      
      expect(authService.createUser).toHaveBeenCalledWith(
        { name: 'Test User', email: 'test@example.com', password: 'password123' },
        'en'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult
      });
    });

    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Email is required' }])
      });
      
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array)
      });
      expect(authService.createUser).not.toHaveBeenCalled();
    });

    it('should return error status and message if service throws error', async () => {
      req.body = { 
        name: 'Test User',
        email: 'test@example.com', 
        password: 'password123' 
      };
      
      const mockError = new Error('User already exists');
      mockError.statusCode = 400;
      
      authService.createUser.mockRejectedValue(mockError);
      
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists'
      });
    });
  });

  describe('logout', () => {
    it('should return 200 on successful logout', async () => {
      authService.logoutUser.mockResolvedValue(true);
      
      await authController.logout(req, res);
      
      expect(authService.logoutUser).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      });
    });

    it('should return error status and message if service throws error', async () => {
      const mockError = new Error('User not found');
      mockError.statusCode = 404;
      
      authService.logoutUser.mockRejectedValue(mockError);
      
      await authController.logout(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });
});
