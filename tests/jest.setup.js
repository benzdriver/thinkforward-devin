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
  class MockObjectId {
    constructor(id) {
      this.id = id || 'mock-id-' + Math.random().toString(36).substring(2, 15);
      this.toString = () => this.id;
    }
  }

  const createMockDocument = (data = {}) => {
    return {
      ...data,
      _id: data._id || new MockObjectId(),
      save: jest.fn().mockResolvedValue({ ...data }),
      comparePassword: jest.fn().mockImplementation((password) => {
        return Promise.resolve(password === 'password123');
      }),
      generateAuthToken: jest.fn().mockReturnValue('mock-auth-token'),
      generateRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
      toObject: jest.fn().mockReturnValue({ ...data }),
      toJSON: jest.fn().mockReturnValue({ ...data })
    };
  };

  const mockSchema = {
    pre: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    methods: {},
    statics: {},
    virtual: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    index: jest.fn().mockReturnThis()
  };

  const mockSchemaConstructor = jest.fn().mockImplementation(() => mockSchema);
  
  mockSchemaConstructor.Types = {
    ObjectId: MockObjectId,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    Map: Map,
    Mixed: {},
    Buffer: Buffer,
    Array: Array
  };
  
  const createMockModel = () => {
    const mockModel = function(data) {
      return createMockDocument(data);
    };
    
    mockModel.findOne = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(createMockDocument()),
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(createMockDocument())
      }),
      exec: jest.fn().mockResolvedValue(createMockDocument())
    }));
    
    mockModel.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(createMockDocument()),
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(createMockDocument())
      }),
      exec: jest.fn().mockResolvedValue(createMockDocument())
    }));
    
    mockModel.find = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([createMockDocument()])
    }));
    
    mockModel.create = jest.fn().mockImplementation((data) => {
      if (Array.isArray(data)) {
        return Promise.resolve(data.map(item => createMockDocument(item)));
      }
      return Promise.resolve(createMockDocument(data));
    });
    
    mockModel.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    mockModel.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 2 });
    mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
    mockModel.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
    mockModel.countDocuments = jest.fn().mockResolvedValue(1);
    
    return mockModel;
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
    model: jest.fn().mockImplementation(() => createMockModel()),
    Types: {
      ObjectId: MockObjectId,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Date: Date,
      Map: Map,
      Mixed: {},
      Buffer: Buffer,
      Array: Array
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
