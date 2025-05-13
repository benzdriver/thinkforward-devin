/**
 * Mock profileSettingsService for testing
 */

const AccountSettings = require('../../../mocks/models/settings/AccountSettings');
const NotificationSettings = require('../../../mocks/models/settings/NotificationSettings');
const PrivacySettings = require('../../../mocks/models/settings/PrivacySettings');
const SecuritySettings = require('../../../mocks/models/settings/SecuritySettings');

/**
 * Get all settings for a user
 */
exports.getAllSettings = async (userId, locale = 'en') => {
  const [accountSettings, notificationSettings, privacySettings, securitySettings] = await Promise.all([
    AccountSettings.findByUserId(userId),
    NotificationSettings.findByUserId(userId),
    PrivacySettings.findByUserId(userId),
    SecuritySettings.findByUserId(userId)
  ]);
  
  return {
    accountSettings,
    notificationSettings,
    privacySettings,
    securitySettings
  };
};

/**
 * Initialize settings for a user
 */
exports.initializeSettings = async (userId, email, sessionInfo = null, locale = 'en') => {
  const [accountSettings, notificationSettings, privacySettings, securitySettings] = await Promise.all([
    AccountSettings.createDefault(userId, email),
    NotificationSettings.createDefault(userId),
    PrivacySettings.createDefault(userId),
    SecuritySettings.createDefault(userId, sessionInfo)
  ]);
  
  return {
    accountSettings,
    notificationSettings,
    privacySettings,
    securitySettings
  };
};

/**
 * Get account settings for a user
 */
exports.getAccountSettings = async (userId, locale = 'en') => {
  let settings = await AccountSettings.findByUserId(userId);
  
  if (!settings) {
    const email = `user-${userId}@example.com`;
    settings = await AccountSettings.createDefault(userId, email);
  }
  
  return settings;
};

/**
 * Update account settings for a user
 */
exports.updateAccountSettings = async (userId, updates, locale = 'en') => {
  let settings = await AccountSettings.findByUserId(userId);
  
  if (!settings) {
    const email = `user-${userId}@example.com`;
    settings = await AccountSettings.createDefault(userId, email);
  }
  
  return await settings.updateSettings(updates);
};

/**
 * Get notification settings for a user
 */
exports.getNotificationSettings = async (userId, locale = 'en') => {
  let settings = await NotificationSettings.findByUserId(userId);
  
  if (!settings) {
    settings = await NotificationSettings.createDefault(userId);
  }
  
  return settings;
};

/**
 * Update notification settings for a user
 */
exports.updateNotificationSettings = async (userId, updates, locale = 'en') => {
  let settings = await NotificationSettings.findByUserId(userId);
  
  if (!settings) {
    settings = await NotificationSettings.createDefault(userId);
  }
  
  if (updates.email) {
    await settings.updateEmailSettings(updates.email);
  }
  
  if (updates.push) {
    await settings.updatePushSettings(updates.push);
  }
  
  if (updates.sms) {
    await settings.updateSmsSettings(updates.sms);
  }
  
  return settings;
};

/**
 * Get privacy settings for a user
 */
exports.getPrivacySettings = async (userId, locale = 'en') => {
  let settings = await PrivacySettings.findByUserId(userId);
  
  if (!settings) {
    settings = await PrivacySettings.createDefault(userId);
  }
  
  return settings;
};

/**
 * Update privacy settings for a user
 */
exports.updatePrivacySettings = async (userId, updates, locale = 'en') => {
  let settings = await PrivacySettings.findByUserId(userId);
  
  if (!settings) {
    settings = await PrivacySettings.createDefault(userId);
  }
  
  if (updates.profileVisibility || updates.activityVisibility || updates.documentVisibility) {
    const visibilityUpdates = {};
    
    if (updates.profileVisibility) {
      visibilityUpdates.profileVisibility = updates.profileVisibility;
    }
    
    if (updates.activityVisibility) {
      visibilityUpdates.activityVisibility = updates.activityVisibility;
    }
    
    if (updates.documentVisibility) {
      visibilityUpdates.documentVisibility = updates.documentVisibility;
    }
    
    await settings.updateVisibilitySettings(visibilityUpdates);
  }
  
  return settings;
};

/**
 * Get security settings for a user
 */
exports.getSecuritySettings = async (userId, locale = 'en') => {
  let settings = await SecuritySettings.findByUserId(userId);
  
  if (!settings) {
    settings = await SecuritySettings.createDefault(userId);
  }
  
  return settings;
};

/**
 * Update security settings for a user
 */
exports.updateSecuritySettings = async (userId, updates, locale = 'en') => {
  let settings = await SecuritySettings.findByUserId(userId);
  
  if (!settings) {
    settings = await SecuritySettings.createDefault(userId);
  }
  
  if (updates.twoFactorEnabled !== undefined) {
    if (updates.twoFactorEnabled && updates.twoFactorMethod) {
      await settings.enableTwoFactor(updates.twoFactorMethod);
    } else if (!updates.twoFactorEnabled) {
      await settings.disableTwoFactor();
    }
  }
  
  if (updates.loginAlertsEnabled !== undefined) {
    await settings.toggleLoginAlerts(updates.loginAlertsEnabled);
  }
  
  return settings;
};

/**
 * Add a session for a user
 */
exports.addSession = async (userId, sessionInfo, locale = 'en') => {
  let settings = await SecuritySettings.findByUserId(userId);
  
  if (!settings) {
    settings = await SecuritySettings.createDefault(userId);
  }
  
  return await settings.addSession(sessionInfo);
};

/**
 * Remove a session for a user
 */
exports.removeSession = async (userId, sessionId, locale = 'en') => {
  const settings = await SecuritySettings.findByUserId(userId);
  
  if (!settings) {
    const error = new Error('Security settings not found');
    error.statusCode = 404;
    throw error;
  }
  
  return await settings.removeSession(sessionId);
};

/**
 * Remove all other sessions for a user
 */
exports.removeAllOtherSessions = async (userId, locale = 'en') => {
  const settings = await SecuritySettings.findByUserId(userId);
  
  if (!settings) {
    const error = new Error('Security settings not found');
    error.statusCode = 404;
    throw error;
  }
  
  return await settings.removeAllOtherSessions();
};

/**
 * Update password change time for a user
 */
exports.updatePasswordChangeTime = async (userId, locale = 'en') => {
  let settings = await SecuritySettings.findByUserId(userId);
  
  if (!settings) {
    settings = await SecuritySettings.createDefault(userId);
  }
  
  return await settings.updatePasswordChangeTime();
};
