/**
 * Test environment setup
 */
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.test')
});

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
process.env.PORT = 5001;
process.env.MONGODB_URI = 'mongodb://mock:27017/test';

if (!process.env.USE_REAL_DB) {
  mongoose.Schema.prototype.pre = function(hook, callback) {
    return this;
  };
  
  const createMockDocument = (data) => {
    const doc = {
      _id: data._id || new mongoose.Types.ObjectId(),
      ...data,
      save: jest.fn().mockResolvedValue(data),
      comparePassword: jest.fn().mockResolvedValue(true),
      generateAuthToken: jest.fn().mockImplementation(function() {
        return jwt.sign(
          { userId: this._id, email: this.email, role: this.role || 'user' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
      }),
      generateRefreshToken: jest.fn().mockImplementation(function() {
        const refreshToken = jwt.sign(
          { userId: this._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: '7d' }
        );
        this.refreshToken = refreshToken;
        return refreshToken;
      })
    };
    
    return doc;
  };
  
  mongoose.model = jest.fn().mockImplementation((modelName, schema) => {
    let mockImplementation = {};
    
    if (modelName === 'User') {
      mockImplementation = {
        findOne: jest.fn().mockImplementation((query) => {
          if (query && query.email === 'test@example.com') {
            return Promise.resolve(createMockDocument({
              name: 'Test User',
              email: 'test@example.com',
              password: 'hashedpassword123',
              role: 'user'
            }));
          }
          return Promise.resolve(null);
        }),
        findById: jest.fn().mockImplementation((id) => {
          if (id) {
            return Promise.resolve(createMockDocument({
              _id: id,
              name: 'Test User',
              email: 'test@example.com',
              role: 'user'
            }));
          }
          return Promise.resolve(null);
        })
      };
    }
    
    const mockModel = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(data => createMockDocument(data)),
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
      select: jest.fn().mockReturnThis(),
      ...mockImplementation
    };
    
    if (schema && schema.methods) {
      Object.keys(schema.methods).forEach(method => {
        mockModel[method] = schema.methods[method];
      });
    }
    
    if (schema && schema.statics) {
      Object.keys(schema.statics).forEach(method => {
        mockModel[method] = schema.statics[method];
      });
    }
    
    return mockModel;
  });
}

if (process.env.SILENT_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}
