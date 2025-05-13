/**
 * Database setup for tests
 */
const mongoose = require('mongoose');

/**
 * Connect to the MongoDB database
 */
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB for testing');
    
    const uri = 'mongodb://localhost:27017/thinkforward-test';
    console.log('MongoDB URI:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB for testing');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Close the database connection
 */
const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

/**
 * Remove all data from collections
 */
const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('Cleared all collections in MongoDB');
  } catch (error) {
    console.error('Error clearing MongoDB collections:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  closeDatabase,
  clearDatabase
};
