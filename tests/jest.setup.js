const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
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

jest.setTimeout(120000);

jest.mock('../backend/utils/canadaApiClient', () => ({
  fetchExpressEntryDraws: jest.fn().mockResolvedValue([]),
  fetchProvincialPrograms: jest.fn().mockResolvedValue([]),
  fetchImmigrationNews: jest.fn().mockResolvedValue([])
}), { virtual: true });

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000
    };
    
    const [major, minor] = mongoose.version.split('.').map(Number);
    if (major < 6) {
      mongooseOpts.useCreateIndex = true;
      mongooseOpts.useFindAndModify = false;
    }
    
    await mongoose.connect(uri, mongooseOpts);
    
    console.log(`Connected to MongoDB Memory Server at ${uri}`);
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
});

afterEach(async () => {
  if (mongoose.connection && mongoose.connection.collections) {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        try {
          await collections[key].deleteMany({});
        } catch (error) {
          console.error(`Error clearing collection ${key}:`, error);
        }
      }
    } catch (error) {
      console.error('Error accessing collections:', error);
    }
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection) {
      await mongoose.connection.close();
      console.log('Mongoose connection closed');
    }
    
    if (mongoServer) {
      try {
        await mongoServer.stop();
        console.log('MongoDB Memory Server stopped');
      } catch (error) {
        console.error('Error stopping MongoDB Memory Server:', error);
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});
