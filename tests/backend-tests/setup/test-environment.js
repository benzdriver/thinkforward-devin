/**
 * Test environment setup
 */
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.test')
});

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
process.env.PORT = 5001;
process.env.MONGODB_URI = 'mongodb://mock:27017/test';

if (!process.env.USE_REAL_DB) {
  mongoose.Schema.prototype.pre = function(hook, callback) {
    return this;
  };
  
  const createMockDocument = (data, modelName) => {
    const doc = {
      _id: data._id || new mongoose.Types.ObjectId(),
      ...data,
      save: jest.fn().mockImplementation(function() {
        if (modelName === 'Profile' && this.lastUpdated) {
          this.lastUpdated = new Date().toISOString();
        }
        return Promise.resolve(this);
      }),
      comparePassword: jest.fn().mockResolvedValue(true),
      generateAuthToken: jest.fn().mockImplementation(function() {
        return jwt.sign(
          { userId: this._id, email: this.email, role: this.role || 'user' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
      }),
      generateRefreshToken: jest.fn().mockImplementation(function() {
        const refreshToken = jwt.sign(
          { userId: this._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: '7d' }
        );
        this.refreshToken = refreshToken;
        return refreshToken;
      })
    };
    
    if (modelName === 'Profile') {
      if (!doc.completionStatus) {
        doc.completionStatus = {
          personalInfo: false,
          educationInfo: false,
          workExperience: false,
          languageSkills: false,
          immigrationInfo: false
        };
      }
      
      doc.isComplete = function() {
        const { personalInfo, educationInfo, workExperience, languageSkills, immigrationInfo } = this.completionStatus;
        return personalInfo && educationInfo && workExperience && languageSkills && immigrationInfo;
      };
      
      doc.updateCompletionStatus = function() {
        if (!this.personalInfo) this.personalInfo = {};
        if (!this.educationInfo) this.educationInfo = {};
        if (!this.workExperience) this.workExperience = {};
        if (!this.languageSkills) this.languageSkills = {};
        if (!this.immigrationInfo) this.immigrationInfo = {};
        
        this.completionStatus.personalInfo = !!(
          this.personalInfo.firstName &&
          this.personalInfo.lastName &&
          this.personalInfo.dateOfBirth &&
          this.personalInfo.nationality
        );
        
        this.completionStatus.educationInfo = !!(
          this.educationInfo.highestDegree &&
          this.educationInfo.institution
        );
        
        this.completionStatus.workExperience = !!(
          this.workExperience.occupation &&
          this.workExperience.yearsOfExperience
        );
        
        this.completionStatus.languageSkills = !!(
          this.languageSkills.englishProficiency &&
          this.languageSkills.englishProficiency !== 'none'
        );
        
        this.completionStatus.immigrationInfo = !!(
          this.immigrationInfo.desiredCountry &&
          this.immigrationInfo.desiredProvince
        );
      };
      
      doc.updateCompletionStatus();
    }
    
    return doc;
  };
  
  mongoose.model = jest.fn().mockImplementation((modelName, schema) => {
    let mockImplementation = {};
    
    if (modelName === 'User') {
      mockImplementation = {
        findOne: jest.fn().mockImplementation((query) => {
          if (query && query.email === 'test@example.com') {
            return Promise.resolve(createMockDocument({
              name: 'Test User',
              email: 'test@example.com',
              password: 'hashedpassword123',
              role: 'user'
            }, modelName));
          }
          return Promise.resolve(null);
        }),
        findById: jest.fn().mockImplementation((id) => {
          if (id) {
            return Promise.resolve(createMockDocument({
              _id: id,
              name: 'Test User',
              email: 'test@example.com',
              role: 'user'
            }, modelName));
          }
          return Promise.resolve(null);
        })
      };
    } else if (modelName === 'Profile') {
      const createTestProfile = (userId) => {
        return createMockDocument({
          userId: userId,
          personalInfo: {
            firstName: 'Test',
            lastName: 'User',
            dateOfBirth: new Date('1990-01-01'),
            nationality: 'Test Country'
          },
          educationInfo: {
            highestDegree: 'bachelor',
            institution: 'Test University'
          },
          workExperience: {
            occupation: 'Software Engineer',
            yearsOfExperience: 5
          },
          languageSkills: {
            englishProficiency: 'advanced'
          },
          immigrationInfo: {
            desiredCountry: 'Canada',
            desiredProvince: 'Ontario'
          }
        }, modelName);
      };
      
      mockImplementation = {
        findOne: jest.fn().mockImplementation((query) => {
          if (query && query.userId) {
            return Promise.resolve(createTestProfile(query.userId));
          }
          return Promise.resolve(null);
        }),
        findById: jest.fn().mockImplementation((id) => {
          if (id) {
            return Promise.resolve(createMockDocument({
              _id: id,
              userId: new mongoose.Types.ObjectId(),
              personalInfo: {
                firstName: 'Test',
                lastName: 'User'
              }
            }, modelName));
          }
          return Promise.resolve(null);
        }),
        findByUserId: jest.fn().mockImplementation((userId) => {
          if (userId) {
            return Promise.resolve(createTestProfile(userId));
          }
          return Promise.resolve(null);
        }),
        calculateCompletionStatus: jest.fn().mockImplementation(() => {
          return {
            personalInfo: true,
            educationInfo: true,
            workExperience: true,
            languageSkills: true,
            immigrationInfo: true,
            overall: 100
          };
        })
      };
    }
    
    const ValidationError = function(errors) {
      this.name = 'ValidationError';
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    };
    ValidationError.prototype = Object.create(Error.prototype);
    ValidationError.prototype.constructor = ValidationError;
    
    const mockModel = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(data => {
        if (modelName === 'Profile' && !data.userId) {
          throw new ValidationError({ userId: { message: 'Path `userId` is required.' } });
        }
        return createMockDocument(data, modelName);
      }),
      deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
      select: jest.fn().mockReturnThis(),
      ...mockImplementation
    };
    
    if (schema && schema.methods) {
      Object.keys(schema.methods).forEach(method => {
        mockModel[method] = schema.methods[method];
      });
    }
    
    if (schema && schema.statics) {
      Object.keys(schema.statics).forEach(method => {
        mockModel[method] = schema.statics[method];
      });
    }
    
    return mockModel;
  });
}

if (process.env.SILENT_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}
