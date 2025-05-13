/**
 * Profile Settings Controller tests
 */
const profileSettingsController = require('../../../../../backend/controllers/settings/profileSettingsController');
const profileSettingsService = require('../../../../../backend/services/settings/profileSettingsService');
const { validationResult } = require('express-validator');

jest.mock('../../../../../backend/services/settings/profileSettingsService');
jest.mock('express-validator');

describe('Profile Settings Controller', () => {
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

  describe('getAllSettings', () => {
    it('should return 200 and all settings data for own profile', async () => {
      const mockSettings = {
        accountSettings: { userId: 'user123', email: 'test@example.com' },
        notificationSettings: { userId: 'user123' },
        privacySettings: { userId: 'user123' },
        securitySettings: { userId: 'user123' }
      };
      
      profileSettingsService.getAllSettings.mockResolvedValue(mockSettings);
      
      await profileSettingsController.getAllSettings(req, res);
      
      expect(profileSettingsService.getAllSettings).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSettings
      });
    });

    it('should return 403 if trying to access other user settings without admin role', async () => {
      req.params.userId = 'other123';
      
      await profileSettingsController.getAllSettings(req, res);
      
      expect(profileSettingsService.getAllSettings).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String)
      });
    });

    it('should return error status and message if service throws error', async () => {
      const mockError = new Error('Database error');
      mockError.statusCode = 500;
      
      profileSettingsService.getAllSettings.mockRejectedValue(mockError);
      
      await profileSettingsController.getAllSettings(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('getAccountSettings', () => {
    it('should return 200 and account settings data', async () => {
      const mockSettings = {
        userId: 'user123',
        email: 'test@example.com',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai'
      };
      
      profileSettingsService.getAccountSettings.mockResolvedValue(mockSettings);
      
      await profileSettingsController.getAccountSettings(req, res);
      
      expect(profileSettingsService.getAccountSettings).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSettings
      });
    });
  });

  describe('updateAccountSettings', () => {
    it('should return 200 and updated account settings data', async () => {
      req.body = {
        email: 'updated@example.com',
        language: 'en-US',
        timezone: 'America/New_York'
      };
      
      const mockUpdatedSettings = {
        userId: 'user123',
        email: 'updated@example.com',
        language: 'en-US',
        timezone: 'America/New_York'
      };
      
      profileSettingsService.updateAccountSettings.mockResolvedValue(mockUpdatedSettings);
      
      await profileSettingsController.updateAccountSettings(req, res);
      
      expect(profileSettingsService.updateAccountSettings).toHaveBeenCalledWith('user123', req.body, 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedSettings
      });
    });

    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Invalid data' }])
      });
      
      await profileSettingsController.updateAccountSettings(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array)
      });
      expect(profileSettingsService.updateAccountSettings).not.toHaveBeenCalled();
    });
  });

  describe('getNotificationSettings', () => {
    it('should return 200 and notification settings data', async () => {
      const mockSettings = {
        userId: 'user123',
        email: {
          assessmentResults: true,
          pathwayUpdates: true
        },
        push: {
          assessmentResults: true,
          pathwayUpdates: false
        }
      };
      
      profileSettingsService.getNotificationSettings.mockResolvedValue(mockSettings);
      
      await profileSettingsController.getNotificationSettings(req, res);
      
      expect(profileSettingsService.getNotificationSettings).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSettings
      });
    });
  });

  describe('getPrivacySettings', () => {
    it('should return 200 and privacy settings data', async () => {
      const mockSettings = {
        userId: 'user123',
        profileVisibility: 'connections',
        activityVisibility: 'private'
      };
      
      profileSettingsService.getPrivacySettings.mockResolvedValue(mockSettings);
      
      await profileSettingsController.getPrivacySettings(req, res);
      
      expect(profileSettingsService.getPrivacySettings).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSettings
      });
    });
  });

  describe('getSecuritySettings', () => {
    it('should return 200 and security settings data', async () => {
      const mockSettings = {
        userId: 'user123',
        twoFactorEnabled: false,
        loginAlertsEnabled: true
      };
      
      profileSettingsService.getSecuritySettings.mockResolvedValue(mockSettings);
      
      await profileSettingsController.getSecuritySettings(req, res);
      
      expect(profileSettingsService.getSecuritySettings).toHaveBeenCalledWith('user123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSettings
      });
    });
  });

  describe('removeSession', () => {
    it('should return 200 and updated security settings after removing session', async () => {
      req.params.sessionId = 'session123';
      
      const mockSettings = {
        userId: 'user123',
        twoFactorEnabled: false,
        loginAlertsEnabled: true,
        activeSessions: []
      };
      
      profileSettingsService.removeSession.mockResolvedValue(mockSettings);
      
      await profileSettingsController.removeSession(req, res);
      
      expect(profileSettingsService.removeSession).toHaveBeenCalledWith('user123', 'session123', 'en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSettings
      });
    });
  });
});
