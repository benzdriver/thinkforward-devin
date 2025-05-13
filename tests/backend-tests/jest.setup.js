/**
 * Jest setup file
 */
const mongoose = require('mongoose');
require('./setup/test-environment');

jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  
  const mockConnection = {
    collections: {},
    readyState: 1,
    dropDatabase: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  };
  
  originalMongoose.connect = jest.fn().mockResolvedValue({
    connection: mockConnection
  });
  
  originalMongoose.connection = mockConnection;
  
  return originalMongoose;
});

beforeAll(async () => {
  console.log('Setting up mock MongoDB environment');
  
  mongoose.connection.collections = {
    users: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
    profiles: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
    accountsettings: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
    notificationsettings: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
    privacysettings: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
    securitysettings: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) }
  };
});

afterEach(async () => {
  console.log('Clearing mock collections');
  
  jest.clearAllMocks();
  
  Object.values(mongoose.connection.collections).forEach(collection => {
    collection.deleteMany();
  });
});

afterAll(async () => {
  console.log('Closing mock MongoDB connection');
  await mongoose.connection.close();
});

jest.setTimeout(30000);
