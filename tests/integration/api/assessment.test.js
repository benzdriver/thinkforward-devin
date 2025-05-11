const request = require('supertest');
const app = require('../../../backend/app');
const User = require('../../../backend/models/User');
const Assessment = require('../../../backend/models/assessment/Assessment');
const { createTestUser, createObjectId } = require('../../utils/test-utils');

describe('Assessment API', () => {
  let testUser, authToken;
  
  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = testUser.generateAuthToken();
  });
  
  test('POST /api/assessment/start - should start new assessment', async () => {
    const response = await request(app)
      .post('/api/assessment/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'comprehensive'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.type).toBe('comprehensive');
    expect(response.body.data.userId.toString()).toBe(testUser._id.toString());
    expect(response.body.data.status).toBe('started');
  });
  
  test('POST /api/assessment/start - should reject unauthorized access', async () => {
    const response = await request(app)
      .post('/api/assessment/start')
      .send({
        type: 'express'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  test('POST /api/assessment/:id/responses - should submit response', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'express',
      totalSteps: 5
    });
    
    const questionId = createObjectId();
    const response = await request(app)
      .post(`/api/assessment/${assessment._id}/responses`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId: questionId.toString(),
        response: 'yes'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('progress');
    
    const updatedAssessment = await Assessment.findById(assessment._id);
    expect(updatedAssessment.responses.length).toBe(1);
    expect(updatedAssessment.status).toBe('in_progress');
  });
  
  test('POST /api/assessment/:id/responses - should reject response to other user assessment', async () => {
    const anotherUser = await createTestUser({
      name: 'Another User',
      email: 'another@example.com'
    });
    
    const assessment = await Assessment.create({
      userId: anotherUser._id,
      type: 'express',
      totalSteps: 5
    });
    
    const response = await request(app)
      .post(`/api/assessment/${assessment._id}/responses`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId: createObjectId().toString(),
        response: 'yes'
      });
    
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
  
  test('GET /api/assessment/:id/result - should get assessment result', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      status: 'completed',
      completedAt: new Date(),
      resultId: createObjectId()
    });
    
    const response = await request(app)
      .get(`/api/assessment/${assessment._id}/result`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
  
  test('GET /api/assessment/:id/result - should reject result for incomplete assessment', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      status: 'in_progress'
    });
    
    const response = await request(app)
      .get(`/api/assessment/${assessment._id}/result`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  
  test('GET /api/assessment/user/:userId - should get all user assessments', async () => {
    await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      status: 'completed',
      completedAt: new Date()
    });
    
    await Assessment.create({
      userId: testUser._id,
      type: 'express',
      status: 'in_progress'
    });
    
    const response = await request(app)
      .get(`/api/assessment/user/${testUser._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(2);
  });
  
  test('GET /api/assessment/user/:userId/type/:type - should get assessments by type', async () => {
    await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      status: 'completed',
      completedAt: new Date()
    });
    
    await Assessment.create({
      userId: testUser._id,
      type: 'express',
      status: 'in_progress'
    });
    
    const response = await request(app)
      .get(`/api/assessment/user/${testUser._id}/type/express`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].type).toBe('express');
  });
  
  test('GET /api/assessment/:id/questions - should get assessment questions', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      status: 'started'
    });
    
    const response = await request(app)
      .get(`/api/assessment/${assessment._id}/questions`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('questions');
    expect(response.body.data).toHaveProperty('currentStep');
  });
  
  test('DELETE /api/assessment/:id - should delete assessment', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'express',
      status: 'started'
    });
    
    const response = await request(app)
      .delete(`/api/assessment/${assessment._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    const deletedAssessment = await Assessment.findById(assessment._id);
    expect(deletedAssessment).toBeNull();
  });
  
  test('DELETE /api/assessment/:id - should reject deleting other user assessment', async () => {
    const anotherUser = await createTestUser({
      name: 'Another User',
      email: 'another@example.com'
    });
    
    const assessment = await Assessment.create({
      userId: anotherUser._id,
      type: 'express',
      status: 'started'
    });
    
    const response = await request(app)
      .delete(`/api/assessment/${assessment._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    
    const notDeletedAssessment = await Assessment.findById(assessment._id);
    expect(notDeletedAssessment).not.toBeNull();
  });
});
