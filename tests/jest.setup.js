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

jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'thinkforward-test',
        port: 27017,
        ip: '127.0.0.1',
        storageEngine: 'wiredTiger'
      },
      binary: {
        version: '4.4.6'
      },
      autoStart: true
    });
    
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000
    });
    
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
        await collections[key].deleteMany({});
      }
    } catch (error) {
      console.error('Error clearing collections:', error);
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
      await mongoServer.stop();
      console.log('MongoDB Memory Server stopped');
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});
