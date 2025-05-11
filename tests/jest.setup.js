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

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  process.env.MONGODB_URI = uri;
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  
  console.log(`Connected to MongoDB Memory Server at ${uri}`);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Disconnected from MongoDB Memory Server');
});

jest.setTimeout(30000);
