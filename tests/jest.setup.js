const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '.env.test');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('.env.test file not found, using default test environment variables');
}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'thinkforward-test-secret-key';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'thinkforward-test-refresh-secret-key';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/thinkforward-test';

jest.setTimeout(180000);

jest.mock('../backend/utils/canadaApiClient', () => ({
  fetchExpressEntryDraws: jest.fn().mockResolvedValue([]),
  fetchProvincialPrograms: jest.fn().mockResolvedValue([]),
  fetchImmigrationNews: jest.fn().mockResolvedValue([])
}), { virtual: true });

jest.mock('mongoose', () => {
  const mockSchema = {
    pre: jest.fn().mockReturnThis(),
    methods: {},
    statics: {},
    virtual: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis()
  };

  const mockSchemaConstructor = jest.fn().mockImplementation(() => mockSchema);
  
  const mockModel = {
    findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
    findById: jest.fn().mockImplementation(() => Promise.resolve(null)),
    find: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue([]),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis()
    })),
    create: jest.fn().mockImplementation((doc) => Promise.resolve({
      ...doc,
      _id: 'mock-id',
      save: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnValue(doc),
      toJSON: jest.fn().mockReturnValue(doc)
    })),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
  };

  return {
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn().mockResolvedValue(true),
      collections: {
        users: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
        profiles: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
        assessments: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) },
        pathways: { deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }) }
      }
    },
    Schema: mockSchemaConstructor,
    model: jest.fn().mockImplementation(() => mockModel),
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => id || 'mock-object-id'),
      String: String,
      Number: Number,
      Boolean: Boolean,
      Date: Date,
      Map: Map
    },
    set: jest.fn()
  };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn().mockImplementation((password, hash) => Promise.resolve(password === hash.replace('hashed_', '')))
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockImplementation((payload, secret, options) => `mock_token_${JSON.stringify(payload)}`),
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token.startsWith('mock_token_')) {
      return JSON.parse(token.replace('mock_token_', ''));
    }
    throw new Error('Invalid token');
  })
}));

beforeAll(async () => {
  try {
    console.log('Setting up mock MongoDB environment');
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    throw error;
  }
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  try {
    console.log('Test environment cleanup complete');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});
