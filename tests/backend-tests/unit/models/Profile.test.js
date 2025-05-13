/**
 * Profile model tests
 */
const mongoose = require('mongoose');
const Profile = require('../../../../backend/models/Profile');
const { clearDatabase } = require('../../setup/db');

describe('Profile Model', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should create a new profile with valid data', async () => {
    const userId = new mongoose.Types.ObjectId();
    const profileData = {
      userId,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Canadian',
        passportNumber: 'AB123456',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      address: {
        street: '123 Main St',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M5V 2N4',
        country: 'Canada'
      },
      educationInfo: {
        highestDegree: 'bachelor',
        institution: 'University of Toronto',
        graduationYear: '2015',
        fieldOfStudy: 'Computer Science'
      },
      workExperience: {
        occupation: 'Software Developer',
        yearsOfExperience: 5,
        currentEmployer: 'Tech Company',
        jobTitle: 'Senior Developer'
      },
      languageSkills: {
        englishProficiency: 'advanced',
        frenchProficiency: 'intermediate',
        otherLanguages: ['Spanish']
      },
      immigrationInfo: {
        desiredCountry: 'Canada',
        desiredProvince: 'Ontario',
        immigrationPath: 'Express Entry',
        hasJobOffer: true,
        hasFamilyInCountry: false
      }
    };

    const profile = await Profile.create(profileData);

    expect(profile).toBeDefined();
    expect(profile.userId.toString()).toBe(userId.toString());
    expect(profile.personalInfo.firstName).toBe(profileData.personalInfo.firstName);
    expect(profile.personalInfo.lastName).toBe(profileData.personalInfo.lastName);
    expect(profile.educationInfo.highestDegree).toBe(profileData.educationInfo.highestDegree);
    expect(profile.workExperience.occupation).toBe(profileData.workExperience.occupation);
    expect(profile.languageSkills.englishProficiency).toBe(profileData.languageSkills.englishProficiency);
    expect(profile.immigrationInfo.desiredCountry).toBe(profileData.immigrationInfo.desiredCountry);
  });

  it('should validate required fields', async () => {
    const profileData = {};
    
    try {
      await Profile.create(profileData);
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.userId).toBeDefined();
    }
  });

  it('should update completion status on save', async () => {
    const userId = new mongoose.Types.ObjectId();
    const profileData = {
      userId,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Canadian',
        passportNumber: 'AB123456',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      }
    };

    const profile = await Profile.create(profileData);
    
    expect(profile.completionStatus.personalInfo).toBe(true);
    expect(profile.completionStatus.educationInfo).toBe(false);
    expect(profile.completionStatus.workExperience).toBe(false);
    expect(profile.completionStatus.languageSkills).toBe(false);
    expect(profile.completionStatus.immigrationInfo).toBe(false);
    
    expect(profile.isComplete()).toBe(false);
    
    profile.educationInfo = {
      highestDegree: 'bachelor',
      institution: 'University of Toronto',
      graduationYear: '2015',
      fieldOfStudy: 'Computer Science'
    };
    
    await profile.save();
    
    expect(profile.completionStatus.personalInfo).toBe(true);
    expect(profile.completionStatus.educationInfo).toBe(true);
    expect(profile.completionStatus.workExperience).toBe(false);
    expect(profile.completionStatus.languageSkills).toBe(false);
    expect(profile.completionStatus.immigrationInfo).toBe(false);
    
    expect(profile.isComplete()).toBe(false);
  });

  it('should mark profile as complete when all sections are complete', async () => {
    const userId = new mongoose.Types.ObjectId();
    const profileData = {
      userId,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Canadian',
        passportNumber: 'AB123456',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      educationInfo: {
        highestDegree: 'bachelor',
        institution: 'University of Toronto',
        graduationYear: '2015',
        fieldOfStudy: 'Computer Science'
      },
      workExperience: {
        occupation: 'Software Developer',
        yearsOfExperience: 5,
        currentEmployer: 'Tech Company',
        jobTitle: 'Senior Developer'
      },
      languageSkills: {
        englishProficiency: 'advanced',
        frenchProficiency: 'intermediate',
        otherLanguages: ['Spanish']
      },
      immigrationInfo: {
        desiredCountry: 'Canada',
        desiredProvince: 'Ontario',
        immigrationPath: 'Express Entry',
        hasJobOffer: true,
        hasFamilyInCountry: false
      }
    };

    const profile = await Profile.create(profileData);
    
    expect(profile.completionStatus.personalInfo).toBe(true);
    expect(profile.completionStatus.educationInfo).toBe(true);
    expect(profile.completionStatus.workExperience).toBe(true);
    expect(profile.completionStatus.languageSkills).toBe(true);
    expect(profile.completionStatus.immigrationInfo).toBe(true);
    
    expect(profile.isComplete()).toBe(true);
  });

  it('should update lastUpdated timestamp on save', async () => {
    const userId = new mongoose.Types.ObjectId();
    const profileData = {
      userId,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe'
      }
    };

    const profile = await Profile.create(profileData);
    const initialLastUpdated = profile.lastUpdated;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    profile.personalInfo.firstName = 'Jane';
    await profile.save();
    
    expect(profile.lastUpdated).not.toBe(initialLastUpdated);
  });
});
