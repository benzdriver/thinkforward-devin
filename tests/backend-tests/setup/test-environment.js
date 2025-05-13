/**
 * Test environment setup
 */
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

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
  
  mongoose.model = jest.fn().mockImplementation((modelName, schema) => {
    const mockModel = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(data => {
        return {
          _id: new mongoose.Types.ObjectId(),
          ...data,
          save: jest.fn().mockResolvedValue(data)
        };
      }),
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
      select: jest.fn().mockReturnThis()
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
