/**
 * Profile API integration tests
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../mocks/app');
const User = require('../../../mocks/models/User');
const Profile = require('../../../mocks/models/Profile');
const { clearDatabase } = require('../../../setup/db');

describe('Profile API', () => {
  let user, token;

  beforeEach(async () => {
    await clearDatabase();
    
    user = await User.create({
      name: 'Test User',
      email: 'profile-test@example.com',
      password: 'password123'
    });
    
    token = user.generateAuthToken();
  });

  describe('GET /api/profile', () => {
    it('should return 200 and profile data if profile exists', async () => {
      await Profile.create({
        userId: user._id,
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }
      });
      
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.personalInfo).toBeDefined();
      expect(response.body.data.personalInfo.firstName).toBe('John');
      expect(response.body.data.personalInfo.lastName).toBe('Doe');
    });

    it('should return 404 if profile does not exist', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('PATCH /api/profile', () => {
    it('should create profile if it does not exist', async () => {
      const profileData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        educationInfo: {
          highestDegree: 'bachelor',
          institution: 'University of Toronto'
        }
      };
      
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(profileData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.personalInfo.firstName).toBe(profileData.personalInfo.firstName);
      expect(response.body.data.personalInfo.lastName).toBe(profileData.personalInfo.lastName);
      expect(response.body.data.educationInfo.highestDegree).toBe(profileData.educationInfo.highestDegree);
      
      const profile = await Profile.findOne({ userId: user._id });
      expect(profile).toBeDefined();
      expect(profile.personalInfo.firstName).toBe(profileData.personalInfo.firstName);
    });

    it('should update profile if it exists', async () => {
      await Profile.create({
        userId: user._id,
        personalInfo: {
          firstName: 'Initial',
          lastName: 'User'
        }
      });
      
      const updatedData = {
        personalInfo: {
          firstName: 'Updated',
          lastName: 'Name',
          email: 'updated@example.com'
        }
      };
      
      const response = await request(app)
        .patch('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.personalInfo.firstName).toBe(updatedData.personalInfo.firstName);
      expect(response.body.data.personalInfo.lastName).toBe(updatedData.personalInfo.lastName);
      
      const profile = await Profile.findOne({ userId: user._id });
      expect(profile.personalInfo.firstName).toBe(updatedData.personalInfo.firstName);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .send({})
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/profile/completion', () => {
    it('should return 200 and completion status', async () => {
      await Profile.create({
        userId: user._id,
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          nationality: 'Canadian',
          passportNumber: 'AB123456',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        },
        languageSkills: {
          englishProficiency: 'advanced',
          frenchProficiency: 'intermediate'
        }
      });
      
      const response = await request(app)
        .get('/api/profile/completion')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.personalInfo).toBe(true);
      expect(response.body.data.educationInfo).toBe(false);
      expect(response.body.data.workExperience).toBe(false);
      expect(response.body.data.languageSkills).toBe(true);
      expect(response.body.data.immigrationInfo).toBe(false);
      expect(response.body.data.isComplete).toBe(false);
    });

    it('should return 404 if profile does not exist', async () => {
      const response = await request(app)
        .get('/api/profile/completion')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});
