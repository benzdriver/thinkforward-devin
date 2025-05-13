/**
 * Auth middleware tests
 */
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authMiddleware = require('../../../../backend/middleware/authMiddleware');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      locale: 'en'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() if token is valid', () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign(
      { userId, email: 'test@example.com', role: 'user' },
      process.env.JWT_SECRET || 'test-jwt-secret'
    );
    
    req.headers.authorization = `Bearer ${token}`;
    
    authMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(userId);
    expect(req.user.email).toBe('test@example.com');
    expect(req.user.role).toBe('user');
  });

  it('should return 401 if no authorization header is provided', () => {
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: expect.any(String)
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    req.headers.authorization = 'InvalidFormat token123';
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: expect.any(String)
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: expect.any(String)
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
