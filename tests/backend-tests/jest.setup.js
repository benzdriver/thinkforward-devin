/**
 * Jest setup file
 */
const { connectDB, closeDatabase } = require('./setup/db');
require('./setup/test-environment');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDatabase();
});

jest.setTimeout(30000);
