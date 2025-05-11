const request = require('supertest');
const app = require('../../../backend/app');
const User = require('../../../backend/models/User');
const Pathway = require('../../../backend/models/pathway/Pathway');
const { createTestUser } = require('../../utils/test-utils');

describe('Pathway API', () => {
  let testUser, authToken;
  
  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = testUser.generateAuthToken();
    
    await Pathway.create({
      name: 'Test Pathway',
      code: 'test-path',
      country: 'Canada',
      category: 'federal',
      description: 'Test pathway description',
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1000,
        currency: 'CAD'
      },
      officialLink: 'https://example.com'
    });
  });
  
  test('GET /api/pathway - should get all pathways', async () => {
    const response = await request(app)
      .get('/api/pathway')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty('name');
    expect(response.body.data[0]).toHaveProperty('code');
  });
  
  test('GET /api/pathway/code/:code - should get pathway by code', async () => {
    const response = await request(app)
      .get('/api/pathway/code/test-path')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Pathway');
    expect(response.body.data.code).toBe('test-path');
  });
  
  test('GET /api/pathway/code/:code - should return 404 for non-existent pathway', async () => {
    const response = await request(app)
      .get('/api/pathway/code/non-existent-path')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
  
  test('GET /api/pathway/country/:country - should get pathways by country', async () => {
    const response = await request(app)
      .get('/api/pathway/country/Canada')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].country).toBe('Canada');
  });
  
  test('GET /api/pathway/category/:category - should get pathways by category', async () => {
    const response = await request(app)
      .get('/api/pathway/category/federal')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].category).toBe('federal');
  });
  
  test('POST /api/pathway/eligibility/:id - should check eligibility', async () => {
    const pathway = await Pathway.findOne({ code: 'test-path' });
    
    const response = await request(app)
      .post(`/api/pathway/eligibility/${pathway._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        profile: {
          age: 30,
          education: 'bachelor',
          workExperience: 3
        }
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data).toHaveProperty('points');
  });
  
  test('GET /api/pathway - should reject unauthorized access', async () => {
    const response = await request(app)
      .get('/api/pathway');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  test('GET /api/pathway/:id - should get pathway by id', async () => {
    const pathway = await Pathway.findOne({ code: 'test-path' });
    
    const response = await request(app)
      .get(`/api/pathway/${pathway._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Pathway');
    expect(response.body.data.code).toBe('test-path');
  });
  
  test('GET /api/pathway/:id/translation/:locale - should get translated pathway content', async () => {
    const pathwayWithTranslation = await Pathway.create({
      name: 'Translation Test Pathway',
      code: 'translation-test',
      country: 'Canada',
      category: 'federal',
      description: 'English description',
      processingTime: {
        min: 6,
        max: 12,
        unit: 'months'
      },
      applicationFee: {
        amount: 1000,
        currency: 'CAD'
      },
      officialLink: 'https://example.com',
      translations: {
        fr: {
          name: 'Voie de test de traduction',
          description: 'Description française'
        },
        zh: {
          name: '翻译测试途径',
          description: '中文描述'
        }
      }
    });
    
    const response = await request(app)
      .get(`/api/pathway/${pathwayWithTranslation._id}/translation/fr`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Voie de test de traduction');
    expect(response.body.data.description).toBe('Description française');
  });
  
  test('GET /api/pathway/search - should search pathways', async () => {
    const response = await request(app)
      .get('/api/pathway/search?query=Test')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].name).toContain('Test');
  });
  
  test('GET /api/pathway/recommended/:userId - should get recommended pathways', async () => {
    const response = await request(app)
      .get(`/api/pathway/recommended/${testUser._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
