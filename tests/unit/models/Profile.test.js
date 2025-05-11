const Profile = require('../../../backend/models/Profile');
const User = require('../../../backend/models/User');
const mongoose = require('mongoose');
const { createTestUser } = require('../../utils/test-utils');

describe('Profile Model', () => {
  let testUser;
  
  beforeEach(async () => {
    testUser = await createTestUser();
  });
  
  test('should create a new profile', async () => {
    const profileData = {
      userId: testUser._id,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Canadian',
        countryOfResidence: 'Canada'
      }
    };
    
    const profile = await Profile.create(profileData);
    
    expect(profile).toHaveProperty('_id');
    expect(profile.userId.toString()).toBe(testUser._id.toString());
    expect(profile.personalInfo.firstName).toBe('John');
  });
  
  test('should update completion status based on profile data', async () => {
    const profile = await Profile.create({
      userId: testUser._id,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Canadian',
        countryOfResidence: 'Canada'
      }
    });
    
    expect(profile.completionStatus.personalInfo).toBe(true);
    expect(profile.completionStatus.educationInfo).toBe(false);
    
    profile.educationInfo.push({
      highestDegree: 'bachelor',
      institution: 'University of Toronto',
      graduationYear: 2012,
      fieldOfStudy: 'Computer Science'
    });
    
    await profile.save();
    
    expect(profile.completionStatus.educationInfo).toBe(true);
  });
  
  test('should correctly report completion status', async () => {
    const profile = await Profile.create({
      userId: testUser._id
    });
    
    expect(profile.isComplete()).toBe(false);
    
    profile.personalInfo = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Canadian',
      countryOfResidence: 'Canada'
    };
    
    profile.educationInfo.push({
      highestDegree: 'bachelor',
      institution: 'University of Toronto',
      graduationYear: 2012,
      fieldOfStudy: 'Computer Science'
    });
    
    profile.workExperience.push({
      company: 'Tech Corp',
      position: 'Developer',
      startDate: new Date('2012-06-01'),
      endDate: new Date('2018-12-31'),
      country: 'Canada'
    });
    
    profile.languageSkills.push({
      language: 'English',
      proficiencyLevel: 'native',
      readingScore: 10,
      writingScore: 10,
      speakingScore: 10,
      listeningScore: 10
    });
    
    profile.immigrationInfo = {
      interestedPrograms: ['Express Entry'],
      preferredDestination: 'Canada',
      immigrationStatus: 'permanent_resident'
    };
    
    await profile.save();
    
    expect(profile.completionStatus.personalInfo).toBe(true);
    expect(profile.completionStatus.educationInfo).toBe(true);
    expect(profile.completionStatus.workExperience).toBe(true);
    expect(profile.completionStatus.languageSkills).toBe(true);
    expect(profile.completionStatus.immigrationInfo).toBe(true);
    expect(profile.isComplete()).toBe(true);
  });
  
  test('should validate required fields', async () => {
    try {
      await Profile.create({});
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.userId).toBeDefined();
    }
  });
  
  test('should enforce userId uniqueness', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    try {
      await Profile.create({
        userId: testUser._id
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('MongoError');
      expect(error.code).toBe(11000); // 重复键错误代码
    }
  });
  
  test('should validate nested schema fields', async () => {
    const profile = new Profile({
      userId: testUser._id,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: 'invalid-date' // 应该是 Date 类型
      }
    });
    
    try {
      await profile.validate();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors['personalInfo.dateOfBirth']).toBeDefined();
    }
  });
  
  test('should validate enum fields', async () => {
    const profile = new Profile({
      userId: testUser._id,
      immigrationInfo: {
        immigrationStatus: 'invalid-status' // 不在枚举列表中
      }
    });
    
    try {
      await profile.validate();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors['immigrationInfo.immigrationStatus']).toBeDefined();
    }
  });
});
