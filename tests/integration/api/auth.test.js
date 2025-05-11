const request = require('supertest');
const app = require('../../../backend/app');
const User = require('../../../backend/models/User');
const { createTestUser } = require('../../utils/test-utils');

describe('Authentication API', () => {
  test('POST /api/auth/login - should login user with valid credentials', async () => {
    const testUser = await createTestUser();
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data).toHaveProperty('tokens');
    expect(response.body.data.user.email).toBe(testUser.email);
  });
  
  test('POST /api/auth/login - should fail with invalid credentials', async () => {
    const testUser = await createTestUser();
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  test('POST /api/auth/register - should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Register User',
        email: 'newregister@example.com',
        password: 'registerpass'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.name).toBe('New Register User');
    expect(response.body.data.user.email).toBe('newregister@example.com');
    
    const user = await User.findOne({ email: 'newregister@example.com' });
    expect(user).not.toBeNull();
  });
  
  test('POST /api/auth/register - should fail with duplicate email', async () => {
    const testUser = await createTestUser();
    
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate User',
        email: testUser.email,
        password: 'anotherpassword'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  
  test('GET /api/auth/validate-token - should validate valid token', async () => {
    const testUser = await createTestUser();
    const token = testUser.generateAuthToken();
    
    const response = await request(app)
      .get('/api/auth/validate-token')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.valid).toBe(true);
  });
  
  test('GET /api/auth/validate-token - should reject invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/validate-token')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  test('POST /api/auth/refresh-token - should refresh tokens with valid refresh token', async () => {
    const testUser = await createTestUser();
    const refreshToken = testUser.generateRefreshToken();
    await testUser.save();
    
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({
        refreshToken
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('authToken');
    expect(response.body.data).toHaveProperty('refreshToken');
  });
  
  test('POST /api/auth/refresh-token - should reject invalid refresh token', async () => {
    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({
        refreshToken: 'invalid-refresh-token'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  test('POST /api/auth/logout - should invalidate refresh token', async () => {
    const testUser = await createTestUser();
    const refreshToken = testUser.generateRefreshToken();
    await testUser.save();
    
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${testUser.generateAuthToken()}`)
      .send({
        refreshToken
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser.refreshToken).not.toBe(refreshToken);
  });
});
