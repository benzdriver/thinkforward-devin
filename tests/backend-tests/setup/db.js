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
  try {
    console.log('Starting MongoDB Memory Server');
    
    mongoServer = await MongoMemoryServer.create();
    
    const uri = mongoServer.getUri();
    console.log('MongoDB Memory Server URI:', uri);

    await mongoose.connect(uri);
    
    console.log('Connected to MongoDB Memory Server');
  } catch (error) {
    console.error('Failed to connect to MongoDB Memory Server:', error);
    throw error;
  }
};

/**
 * Drop database, close the connection and stop mongod
 */
const closeDatabase = async () => {
  try {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
      console.log('Closed MongoDB Memory Server connection');
    }
  } catch (error) {
    console.error('Error closing MongoDB Memory Server:', error);
    throw error;
  }
};

/**
 * Remove all data from collections
 */
const clearDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
      console.log('Cleared all collections in MongoDB Memory Server');
    }
  } catch (error) {
    console.error('Error clearing MongoDB Memory Server collections:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDatabase,
  clearDatabase
};
