/**
 * Database setup for tests
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to the in-memory database
 */
const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod
 */
const closeDatabase = async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

/**
 * Remove all data from collections
 */
const clearDatabase = async () => {
  if (mongoServer) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

module.exports = {
  connectDB,
  closeDatabase,
  clearDatabase
};
