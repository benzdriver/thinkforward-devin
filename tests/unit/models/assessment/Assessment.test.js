const Assessment = require('../../../../backend/models/assessment/Assessment');
const mongoose = require('mongoose');
const { createTestUser, createObjectId } = require('../../../utils/test-utils');

describe('Assessment Model', () => {
  let testUser;
  
  beforeEach(async () => {
    testUser = await createTestUser();
  });
  
  test('should create a new assessment', async () => {
    const assessmentData = {
      userId: testUser._id,
      type: 'comprehensive',
      totalSteps: 10
    };
    
    const assessment = await Assessment.create(assessmentData);
    
    expect(assessment).toHaveProperty('_id');
    expect(assessment.userId.toString()).toBe(testUser._id.toString());
    expect(assessment.type).toBe('comprehensive');
    expect(assessment.status).toBe('started');
    expect(assessment.progress).toBe(0);
  });
  
  test('should add response and update progress', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'express',
      totalSteps: 5
    });
    
    const questionId = createObjectId();
    const responseData = {
      questionId,
      response: 'yes',
      score: 10
    };
    
    assessment.addResponse(responseData);
    await assessment.save();
    
    expect(assessment.responses.length).toBe(1);
    expect(assessment.responses[0].questionId.toString()).toBe(questionId.toString());
    expect(assessment.responses[0].response).toBe('yes');
    expect(assessment.currentStep).toBe(2);
    expect(assessment.progress).toBe(20); // 1/5 = 20%
    expect(assessment.status).toBe('in_progress');
  });
  
  test('should mark assessment as completed when all steps are done', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'targeted',
      totalSteps: 2
    });
    
    assessment.addResponse({
      questionId: createObjectId(),
      response: 'response1'
    });
    
    assessment.addResponse({
      questionId: createObjectId(),
      response: 'response2'
    });
    
    await assessment.save();
    
    expect(assessment.progress).toBe(100);
    expect(assessment.status).toBe('completed');
    expect(assessment.completedAt).toBeDefined();
    expect(assessment.isComplete()).toBe(true);
  });
  
  test('should get response for a specific question', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      totalSteps: 3
    });
    
    const questionId1 = createObjectId();
    const questionId2 = createObjectId();
    
    assessment.addResponse({
      questionId: questionId1,
      response: 'answer1'
    });
    
    assessment.addResponse({
      questionId: questionId2,
      response: 'answer2'
    });
    
    await assessment.save();
    
    const response1 = assessment.getResponse(questionId1);
    const response2 = assessment.getResponse(questionId2);
    const nonExistentResponse = assessment.getResponse(createObjectId());
    
    expect(response1.response).toBe('answer1');
    expect(response2.response).toBe('answer2');
    expect(nonExistentResponse).toBeNull();
  });
  
  test('should calculate progress correctly', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'comprehensive',
      totalSteps: 4
    });
    
    expect(assessment.progress).toBe(0);
    
    assessment.addResponse({
      questionId: createObjectId(),
      response: 'answer1'
    });
    
    expect(assessment.progress).toBe(25);
    
    assessment.addResponse({
      questionId: createObjectId(),
      response: 'answer2'
    });
    
    expect(assessment.progress).toBe(50);
    
    const calculatedProgress = assessment.calculateProgress();
    expect(calculatedProgress).toBe(50);
    expect(assessment.progress).toBe(50);
  });
  
  test('should handle zero total steps', async () => {
    const assessment = await Assessment.create({
      userId: testUser._id,
      type: 'express',
      totalSteps: 0
    });
    
    const progress = assessment.calculateProgress();
    expect(progress).toBe(0);
  });
  
  test('should validate required fields', async () => {
    try {
      await Assessment.create({
        type: 'comprehensive'
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.userId).toBeDefined();
    }
    
    try {
      await Assessment.create({
        userId: testUser._id
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.type).toBeDefined();
    }
  });
  
  test('should validate enum fields', async () => {
    const assessment = new Assessment({
      userId: testUser._id,
      type: 'invalid-type' // 不在枚举列表中
    });
    
    try {
      await assessment.validate();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.type).toBeDefined();
    }
    
    const assessment2 = new Assessment({
      userId: testUser._id,
      type: 'comprehensive',
      status: 'invalid-status' // 不在枚举列表中
    });
    
    try {
      await assessment2.validate();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.status).toBeDefined();
    }
  });
});
