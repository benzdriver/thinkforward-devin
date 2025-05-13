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
    console.log('Starting MongoDB Memory Server with version:', process.env.MONGOMS_VERSION || '7.0.0');
    
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'thinkforward-test',
        debug: true,
        port: 27018 // Use a different port than the default MongoDB
      },
      binary: {
        version: process.env.MONGOMS_VERSION || '7.0.0',
        systemBinary: '/usr/bin/mongod', // Use the installed MongoDB binary
        checkMD5: false
      },
      autoStart: true
    });
    
    const uri = mongoServer.getUri();
    console.log('MongoDB Memory Server URI:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
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
    if (mongoServer) {
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
