/**
 * Profile Settings API integration tests
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../mocks/app');
const User = require('../../../mocks/models/User');
const AccountSettings = require('../../../mocks/models/settings/AccountSettings');
const NotificationSettings = require('../../../mocks/models/settings/NotificationSettings');
const PrivacySettings = require('../../../mocks/models/settings/PrivacySettings');
const SecuritySettings = require('../../../mocks/models/settings/SecuritySettings');
const { clearDatabase } = require('../../../setup/db');

describe('Profile Settings API', () => {
  let user, token;

  beforeEach(async () => {
    await clearDatabase();
    
    user = await User.create({
      name: 'Test User',
      email: 'settings-test@example.com',
      password: 'password123'
    });
    
    token = user.generateAuthToken();
  });

  describe('GET /api/profile-settings/:userId', () => {
    it('should return 200 and all settings if they exist', async () => {
      await Promise.all([
        AccountSettings.createDefault(user._id, 'test@example.com'),
        NotificationSettings.createDefault(user._id),
        PrivacySettings.createDefault(user._id),
        SecuritySettings.createDefault(user._id)
      ]);
      
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.accountSettings).toBeDefined();
      expect(response.body.data.notificationSettings).toBeDefined();
      expect(response.body.data.privacySettings).toBeDefined();
      expect(response.body.data.securitySettings).toBeDefined();
      expect(response.body.data.accountSettings.userId.toString()).toBe(user._id.toString());
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}`)
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/profile-settings/:userId/account', () => {
    it('should return 200 and account settings if they exist', async () => {
      await AccountSettings.createDefault(user._id, 'test@example.com');
      
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}/account`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should create and return default account settings if they do not exist', async () => {
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}/account`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.email).toBe('test@example.com');
    });
  });

  describe('PUT /api/profile-settings/:userId/account', () => {
    it('should update account settings and return 200', async () => {
      await AccountSettings.createDefault(user._id, 'test@example.com');
      
      const updatedData = {
        language: 'en-US',
        timezone: 'America/New_York'
      };
      
      const response = await request(app)
        .put(`/api/profile-settings/${user._id}/account`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.language).toBe(updatedData.language);
      expect(response.body.data.timezone).toBe(updatedData.timezone);
      
      const settings = await AccountSettings.findByUserId(user._id);
      expect(settings.language).toBe(updatedData.language);
      expect(settings.timezone).toBe(updatedData.timezone);
    });
  });

  describe('GET /api/profile-settings/:userId/notifications', () => {
    it('should return 200 and notification settings if they exist', async () => {
      await NotificationSettings.createDefault(user._id);
      
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}/notifications`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.email).toBeDefined();
      expect(response.body.data.push).toBeDefined();
      expect(response.body.data.sms).toBeDefined();
    });
  });

  describe('GET /api/profile-settings/:userId/privacy', () => {
    it('should return 200 and privacy settings if they exist', async () => {
      await PrivacySettings.createDefault(user._id);
      
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}/privacy`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.profileVisibility).toBeDefined();
      expect(response.body.data.activityVisibility).toBeDefined();
      expect(response.body.data.documentVisibility).toBeDefined();
    });
  });

  describe('GET /api/profile-settings/:userId/security', () => {
    it('should return 200 and security settings if they exist', async () => {
      await SecuritySettings.createDefault(user._id);
      
      const response = await request(app)
        .get(`/api/profile-settings/${user._id}/security`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(user._id.toString());
      expect(response.body.data.twoFactorEnabled).toBeDefined();
      expect(response.body.data.loginAlertsEnabled).toBeDefined();
    });
  });

  describe('PUT /api/profile-settings/:userId/security', () => {
    it('should update security settings and return 200', async () => {
      await SecuritySettings.createDefault(user._id);
      
      const updatedData = {
        loginAlertsEnabled: false
      };
      
      const response = await request(app)
        .put(`/api/profile-settings/${user._id}/security`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.loginAlertsEnabled).toBe(false);
      
      const settings = await SecuritySettings.findByUserId(user._id);
      expect(settings.loginAlertsEnabled).toBe(false);
    });
  });
});
