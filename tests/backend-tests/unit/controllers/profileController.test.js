/**
 * Profile controller tests
 */
const profileController = require('../../../../backend/controllers/profileController');
const profileService = require('../../../../backend/services/profileService');
const { validationResult } = require('express-validator');

jest.mock('../../../../backend/services/profileService');
jest.mock('express-validator');

describe('Profile Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123', role: 'user' },
      params: {},
      locale: 'en'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
    
    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });

  describe('getProfile', () => {
    it('should return 200 and profile data for own profile', async () => {
      const mockProfile = {
        userId: 'user123',
        personalInfo: { firstName: 'John', lastName: 'Doe' }
      };
      
      profileService.fetchProfile.mockResolvedValue(mockProfile);
      
      await profileController.getProfile(req, res);
      
      expect(profileService.fetchProfile).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProfile
      });
    });

    it('should return 200 and profile data for other user if admin', async () => {
      req.user.role = 'admin';
      req.params.userId = 'other123';
      
      const mockProfile = {
        userId: 'other123',
        personalInfo: { firstName: 'Jane', lastName: 'Smith' }
      };
      
      profileService.fetchProfile.mockResolvedValue(mockProfile);
      
      await profileController.getProfile(req, res);
      
      expect(profileService.fetchProfile).toHaveBeenCalledWith('other123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProfile
      });
    });

    it('should return 403 if trying to access other user profile without admin role', async () => {
      req.params.userId = 'other123';
      
      await profileController.getProfile(req, res);
      
      expect(profileService.fetchProfile).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });

    it('should return 404 if profile not found', async () => {
      profileService.fetchProfile.mockResolvedValue(null);
      
      await profileController.getProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });

    it('should return error status and message if service throws error', async () => {
      const mockError = new Error('Database error');
      mockError.statusCode = 500;
      
      profileService.fetchProfile.mockRejectedValue(mockError);
      
      await profileController.getProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('updateProfile', () => {
    it('should return 200 and updated profile data', async () => {
      req.body = {
        personalInfo: { firstName: 'John', lastName: 'Doe' },
        educationInfo: { highestDegree: 'bachelor' }
      };
      
      const mockUpdatedProfile = {
        userId: 'user123',
        personalInfo: { firstName: 'John', lastName: 'Doe' },
        educationInfo: { highestDegree: 'bachelor' }
      };
      
      profileService.saveProfile.mockResolvedValue(mockUpdatedProfile);
      
      await profileController.updateProfile(req, res);
      
      expect(profileService.saveProfile).toHaveBeenCalledWith('user123', req.body, 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedProfile
      });
    });

    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Invalid data' }])
      });
      
      await profileController.updateProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array)
      });
      expect(profileService.saveProfile).not.toHaveBeenCalled();
    });

    it('should return 403 if trying to update other user profile without admin role', async () => {
      req.params.userId = 'other123';
      
      await profileController.updateProfile(req, res);
      
      expect(profileService.saveProfile).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });

    it('should return error status and message if service throws error', async () => {
      req.body = {
        personalInfo: { firstName: 'John', lastName: 'Doe' }
      };
      
      const mockError = new Error('Database error');
      mockError.statusCode = 500;
      
      profileService.saveProfile.mockRejectedValue(mockError);
      
      await profileController.updateProfile(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('updatePersonalInfo', () => {
    it('should return 200 and updated profile data', async () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };
      
      const mockUpdatedProfile = {
        userId: 'user123',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }
      };
      
      profileService.updatePersonalInfo.mockResolvedValue(mockUpdatedProfile);
      
      await profileController.updatePersonalInfo(req, res);
      
      expect(profileService.updatePersonalInfo).toHaveBeenCalledWith('user123', req.body, 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedProfile
      });
    });
  });

  describe('getCompletionStatus', () => {
    it('should return 200 and completion status', async () => {
      const mockCompletionStatus = {
        personalInfo: true,
        educationInfo: false,
        workExperience: false,
        languageSkills: true,
        immigrationInfo: false,
        isComplete: false
      };
      
      profileService.getCompletionStatus.mockResolvedValue(mockCompletionStatus);
      
      await profileController.getCompletionStatus(req, res);
      
      expect(profileService.getCompletionStatus).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCompletionStatus
      });
    });

    it('should return 403 if trying to access other user completion status without admin role', async () => {
      req.params.userId = 'other123';
      
      await profileController.getCompletionStatus(req, res);
      
      expect(profileService.getCompletionStatus).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });
  });
});
