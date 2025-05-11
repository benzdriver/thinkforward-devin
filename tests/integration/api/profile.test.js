const request = require('supertest');
const app = require('../../../backend/app');
const User = require('../../../backend/models/User');
const Profile = require('../../../backend/models/Profile');
const { createTestUser } = require('../../utils/test-utils');

describe('Profile API', () => {
  let testUser, authToken;
  
  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = testUser.generateAuthToken();
  });
  
  test('GET /api/profile/:userId - should get user profile', async () => {
    await Profile.create({
      userId: testUser._id,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe'
      }
    });
    
    const response = await request(app)
      .get(`/api/profile/${testUser._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('personalInfo');
    expect(response.body.data.personalInfo.firstName).toBe('John');
  });
  
  test('GET /api/profile/:userId - should reject unauthorized access', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    const response = await request(app)
      .get(`/api/profile/${testUser._id}`);
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
  
  test('GET /api/profile/:userId - should reject access to other user profile', async () => {
    const anotherUser = await createTestUser({
      name: 'Another User',
      email: 'another@example.com'
    });
    
    await Profile.create({
      userId: anotherUser._id
    });
    
    const response = await request(app)
      .get(`/api/profile/${anotherUser._id}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
  
  test('PATCH /api/profile/:userId - should update user profile', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    const updateData = {
      personalInfo: {
        firstName: 'Updated',
        lastName: 'User',
        nationality: 'Canadian'
      }
    };
    
    const response = await request(app)
      .patch(`/api/profile/${testUser._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.personalInfo.firstName).toBe('Updated');
    
    const updatedProfile = await Profile.findOne({ userId: testUser._id });
    expect(updatedProfile.personalInfo.firstName).toBe('Updated');
  });
  
  test('PATCH /api/profile/:userId/personal-info - should update personal info', async () => {
    await Profile.create({
      userId: testUser._id,
      personalInfo: {
        firstName: 'Original'
      }
    });
    
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
      dateOfBirth: '1990-01-01'
    };
    
    const response = await request(app)
      .patch(`/api/profile/${testUser._id}/personal-info`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.personalInfo.firstName).toBe('Updated');
    expect(response.body.data.personalInfo.lastName).toBe('Name');
  });
  
  test('PATCH /api/profile/:userId/education-info - should add education info', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    const educationData = {
      highestDegree: 'master',
      institution: 'University of Toronto',
      graduationYear: 2020,
      fieldOfStudy: 'Computer Science'
    };
    
    const response = await request(app)
      .patch(`/api/profile/${testUser._id}/education-info`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(educationData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.educationInfo).toHaveLength(1);
    expect(response.body.data.educationInfo[0].institution).toBe('University of Toronto');
    
    expect(response.body.data.completionStatus.educationInfo).toBe(true);
  });
  
  test('PATCH /api/profile/:userId/work-experience - should add work experience', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    const workData = {
      company: 'Tech Corp',
      position: 'Software Engineer',
      startDate: '2018-01-01',
      endDate: '2022-12-31',
      country: 'Canada',
      description: 'Developed web applications'
    };
    
    const response = await request(app)
      .patch(`/api/profile/${testUser._id}/work-experience`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(workData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.workExperience).toHaveLength(1);
    expect(response.body.data.workExperience[0].company).toBe('Tech Corp');
    
    expect(response.body.data.completionStatus.workExperience).toBe(true);
  });
  
  test('PATCH /api/profile/:userId/language-skills - should add language skills', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    const languageData = {
      language: 'English',
      proficiencyLevel: 'fluent',
      readingScore: 9,
      writingScore: 8,
      speakingScore: 8,
      listeningScore: 9,
      testType: 'IELTS',
      testDate: '2022-06-15'
    };
    
    const response = await request(app)
      .patch(`/api/profile/${testUser._id}/language-skills`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(languageData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.languageSkills).toHaveLength(1);
    expect(response.body.data.languageSkills[0].language).toBe('English');
    
    expect(response.body.data.completionStatus.languageSkills).toBe(true);
  });
  
  test('PATCH /api/profile/:userId/immigration-info - should update immigration info', async () => {
    await Profile.create({
      userId: testUser._id
    });
    
    const immigrationData = {
      interestedPrograms: ['Express Entry', 'Provincial Nominee'],
      preferredDestination: 'Canada',
      immigrationStatus: 'visitor',
      previousApplications: false
    };
    
    const response = await request(app)
      .patch(`/api/profile/${testUser._id}/immigration-info`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(immigrationData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.immigrationInfo.preferredDestination).toBe('Canada');
    
    expect(response.body.data.completionStatus.immigrationInfo).toBe(true);
  });
  
  test('GET /api/profile/:userId/completion-status - should get completion status', async () => {
    const profile = await Profile.create({
      userId: testUser._id,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Canadian',
        countryOfResidence: 'Canada'
      },
      educationInfo: [{
        highestDegree: 'bachelor',
        institution: 'University of Toronto',
        graduationYear: 2012,
        fieldOfStudy: 'Computer Science'
      }],
      workExperience: [{
        company: 'Tech Corp',
        position: 'Developer',
        startDate: new Date('2012-06-01'),
        endDate: new Date('2018-12-31'),
        country: 'Canada'
      }],
      languageSkills: [{
        language: 'English',
        proficiencyLevel: 'native',
        readingScore: 10,
        writingScore: 10,
        speakingScore: 10,
        listeningScore: 10
      }],
      immigrationInfo: {
        interestedPrograms: ['Express Entry'],
        preferredDestination: 'Canada',
        immigrationStatus: 'permanent_resident'
      }
    });
    
    await profile.updateCompletionStatus();
    await profile.save();
    
    const response = await request(app)
      .get(`/api/profile/${testUser._id}/completion-status`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('completionStatus');
    expect(response.body.data).toHaveProperty('isComplete');
    expect(response.body.data.isComplete).toBe(true);
    expect(response.body.data.completionStatus.personalInfo).toBe(true);
    expect(response.body.data.completionStatus.educationInfo).toBe(true);
    expect(response.body.data.completionStatus.workExperience).toBe(true);
    expect(response.body.data.completionStatus.languageSkills).toBe(true);
    expect(response.body.data.completionStatus.immigrationInfo).toBe(true);
  });
});
