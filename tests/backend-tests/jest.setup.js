/**
 * Jest setup file
 */
const mongoose = require('mongoose');
require('./setup/test-environment');

jest.setTimeout(60000);

jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  
  const mockConnection = {
    collections: {},
    readyState: 1,
    dropDatabase: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    on: jest.fn(),
    once: jest.fn(),
    db: {
      collection: jest.fn().mockReturnValue({
        createIndex: jest.fn().mockResolvedValue(true),
        indexes: jest.fn().mockResolvedValue([]),
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
        findOne: jest.fn().mockResolvedValue(null),
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        })
      })
    }
  };
  
  mockConnection.onClose = jest.fn().mockImplementation(function(callback) {
    if (callback) callback();
    return Promise.resolve();
  });
  
  originalMongoose.connect = jest.fn().mockResolvedValue({
    connection: mockConnection
  });
  
  originalMongoose.connection = mockConnection;
  
  return originalMongoose;
});

beforeAll(async () => {
  console.log('Setting up mock MongoDB environment');
  
  mongoose.connection.collections = {
    users: { 
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      findOne: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([])
      }),
      onClose: jest.fn().mockImplementation(cb => cb && cb())
    },
    profiles: { 
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      onClose: jest.fn().mockImplementation(cb => cb && cb())
    },
    accountsettings: { 
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      onClose: jest.fn().mockImplementation(cb => cb && cb())
    },
    notificationsettings: { 
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      onClose: jest.fn().mockImplementation(cb => cb && cb())
    },
    privacysettings: { 
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      onClose: jest.fn().mockImplementation(cb => cb && cb())
    },
    securitysettings: { 
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      onClose: jest.fn().mockImplementation(cb => cb && cb())
    }
  };
});

afterEach(async () => {
  console.log('Clearing mock collections');
  
  jest.clearAllMocks();
  
  Object.values(mongoose.connection.collections).forEach(collection => {
    collection.deleteMany();
  });
});

afterAll(done => {
  console.log('Closing mock MongoDB connection');
  done();
});
