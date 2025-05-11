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
  // Create a ValidationError class for mongoose validation errors
  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
      this.errors = {};
    }
  }
  // Create a mock ObjectId class
  class MockObjectId {
    constructor(id) {
      this.id = id || 'mock-id-' + Math.random().toString(36).substring(2, 15);
      this.toString = () => this.id;
    }
  }

  // Create a mock document with common methods
  const createMockDocument = (data = {}, modelType = 'default') => {
    // Default values for assessment model
    const defaults = {
      status: 'started',
      progress: 0,
      currentStep: 1,
      responses: [],
      totalSteps: data.totalSteps || 5
    };

    // Merge defaults with provided data
    const docData = { ...defaults, ...data };
    
    // Base document with common methods
    const doc = {
      ...docData,
      _id: docData._id || new MockObjectId(),
      save: jest.fn().mockResolvedValue(docData),
      toObject: jest.fn().mockReturnValue({ ...docData }),
      toJSON: jest.fn().mockReturnValue({ ...docData })
    };
    
    // Add model-specific methods based on modelType
    if (modelType === 'User' || modelType === 'default') {
      doc.comparePassword = jest.fn().mockImplementation((password) => {
        return Promise.resolve(password === 'password123');
      });
      doc.generateAuthToken = jest.fn().mockReturnValue('mock-auth-token');
      doc.generateRefreshToken = jest.fn().mockReturnValue('mock-refresh-token');
    }
    
    if (modelType === 'Assessment' || modelType === 'default') {
      // Assessment model specific methods
      doc.responses = doc.responses || [];
      
      doc.addResponse = jest.fn().mockImplementation((responseData) => {
        doc.responses.push(responseData);
        doc.currentStep = (doc.currentStep || 1) + 1;
        doc.progress = doc.calculateProgress();
        
        if (doc.progress >= 100) {
          doc.status = 'completed';
          doc.completedAt = new Date();
        } else if (doc.progress > 0) {
          doc.status = 'in_progress';
        }
        
        return doc;
      });
      
      doc.getResponse = jest.fn().mockImplementation((questionId) => {
        const response = doc.responses.find(r => 
          r.questionId && r.questionId.toString() === questionId.toString()
        );
        return response || null;
      });
      
      doc.calculateProgress = jest.fn().mockImplementation(() => {
        if (!doc.totalSteps || doc.totalSteps === 0) return 0;
        const completedSteps = doc.responses.length;
        const progress = Math.floor((completedSteps / doc.totalSteps) * 100);
        doc.progress = progress;
        return progress;
      });
      
      doc.isComplete = jest.fn().mockImplementation(() => {
        return doc.status === 'completed';
      });
    }
    
    // Add validate method to all models
    doc.validate = jest.fn().mockImplementation(() => {
      // Validate required fields
      if (modelType === 'Assessment') {
        if (!doc.userId) {
          const error = new ValidationError('Assessment validation failed');
          error.errors.userId = { message: 'Path `userId` is required.' };
          return Promise.reject(error);
        }
        
        if (!doc.type) {
          const error = new ValidationError('Assessment validation failed');
          error.errors.type = { message: 'Path `type` is required.' };
          return Promise.reject(error);
        }
        
        // Validate enum fields
        const validTypes = ['comprehensive', 'express', 'targeted'];
        if (doc.type && !validTypes.includes(doc.type)) {
          const error = new ValidationError('Assessment validation failed');
          error.errors.type = { 
            message: `\`${doc.type}\` is not a valid enum value for path \`type\`.`
          };
          return Promise.reject(error);
        }
        
        const validStatuses = ['started', 'in_progress', 'completed', 'abandoned'];
        if (doc.status && !validStatuses.includes(doc.status)) {
          const error = new ValidationError('Assessment validation failed');
          error.errors.status = { 
            message: `\`${doc.status}\` is not a valid enum value for path \`status\`.`
          };
          return Promise.reject(error);
        }
      }
      
      return Promise.resolve(doc);
    });
    
    return doc;
  };

  // Create mock Schema
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
  
  // Add Schema.Types property
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
  
  // Create mock model with all required methods
  const createMockModel = (modelName) => {
    const mockModel = function(data) {
      return createMockDocument(data, modelName);
    };
    
    // Static methods
    mockModel.findOne = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(createMockDocument({}, modelName)),
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(createMockDocument({}, modelName))
      }),
      exec: jest.fn().mockResolvedValue(createMockDocument({}, modelName))
    }));
    
    mockModel.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(createMockDocument({}, modelName)),
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(createMockDocument({}, modelName))
      }),
      exec: jest.fn().mockResolvedValue(createMockDocument({}, modelName))
    }));
    
    mockModel.find = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([createMockDocument({}, modelName)])
    }));
    
    mockModel.create = jest.fn().mockImplementation((data) => {
      // Handle validation for required fields
      if (modelName === 'Assessment' && data && typeof data === 'object' && !Array.isArray(data)) {
        if (!data.userId) {
          const error = new ValidationError('Assessment validation failed');
          error.errors.userId = { message: 'Path `userId` is required.' };
          return Promise.reject(error);
        }
        
        if (!data.type) {
          const error = new ValidationError('Assessment validation failed');
          error.errors.type = { message: 'Path `type` is required.' };
          return Promise.reject(error);
        }
      }
      
      if (Array.isArray(data)) {
        return Promise.resolve(data.map(item => createMockDocument(item, modelName)));
      }
      return Promise.resolve(createMockDocument(data, modelName));
    });
    
    mockModel.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    mockModel.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 2 });
    mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
    mockModel.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
    mockModel.countDocuments = jest.fn().mockResolvedValue(1);
    
    return mockModel;
  };

  // Create a proper Schema constructor
  const Schema = function(definition, options) {
    const schema = mockSchemaConstructor();
    schema.definition = definition;
    schema.options = options;
    return schema;
  };
  
  Schema.Types = {
    ObjectId: MockObjectId,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    Map: Map,
    Mixed: {},
    Buffer: Buffer,
    Decimal128: Number,
    Array: Array
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
    Schema: Schema,
    model: jest.fn().mockImplementation((name) => createMockModel(name)),
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
