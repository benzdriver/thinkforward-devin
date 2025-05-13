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
  try {
    let accountSettings = await AccountSettings.findByUserId(userId);
    let notificationSettings = await NotificationSettings.findByUserId(userId);
    let privacySettings = await PrivacySettings.findByUserId(userId);
    let securitySettings = await SecuritySettings.findByUserId(userId);
    
    if (!accountSettings) {
      accountSettings = await AccountSettings.createDefault(userId, 'test@example.com');
    }
    
    if (!notificationSettings) {
      notificationSettings = await NotificationSettings.createDefault(userId);
    }
    
    if (!privacySettings) {
      privacySettings = await PrivacySettings.createDefault(userId);
    }
    
    if (!securitySettings) {
      securitySettings = await SecuritySettings.createDefault(userId);
    }
    
    return {
      accountSettings,
      notificationSettings,
      privacySettings,
      securitySettings
    };
  } catch (error) {
    console.error('Error in getAllSettings:', error);
    throw error;
  }
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
  try {
    let settings = await AccountSettings.findByUserId(userId);
    
    if (!settings) {
      const email = 'test@example.com';
      settings = await AccountSettings.createDefault(userId, email);
    }
    
    return settings;
  } catch (error) {
    console.error('Error in getAccountSettings:', error);
    throw error;
  }
};

/**
 * Update account settings for a user
 */
exports.updateAccountSettings = async (userId, updates, locale = 'en') => {
  try {
    let settings = await AccountSettings.findByUserId(userId);
    
    if (!settings) {
      const email = 'test@example.com';
      settings = await AccountSettings.createDefault(userId, email);
    }
    
    if (typeof settings.updateSettings !== 'function') {
      console.error('updateSettings method not found on AccountSettings');
      settings.email = updates.email || settings.email;
      settings.language = updates.language || settings.language;
      settings.timezone = updates.timezone || settings.timezone;
      settings.updatedAt = new Date().toISOString();
      return await settings.save();
    }
    
    return await settings.updateSettings(updates);
  } catch (error) {
    console.error('Error in updateAccountSettings:', error);
    throw error;
  }
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
  try {
    let settings = await SecuritySettings.findByUserId(userId);
    
    if (!settings) {
      settings = await SecuritySettings.createDefault(userId);
    }
    
    if (updates.twoFactorEnabled !== undefined) {
      if (updates.twoFactorEnabled && updates.twoFactorMethod) {
        if (typeof settings.enableTwoFactor === 'function') {
          await settings.enableTwoFactor(updates.twoFactorMethod);
        } else {
          settings.twoFactorEnabled = true;
          settings.twoFactorMethod = updates.twoFactorMethod;
          settings.updatedAt = new Date().toISOString();
          await settings.save();
        }
      } else if (!updates.twoFactorEnabled) {
        if (typeof settings.disableTwoFactor === 'function') {
          await settings.disableTwoFactor();
        } else {
          settings.twoFactorEnabled = false;
          settings.twoFactorMethod = undefined;
          settings.updatedAt = new Date().toISOString();
          await settings.save();
        }
      }
    }
    
    if (updates.loginAlertsEnabled !== undefined) {
      if (typeof settings.toggleLoginAlerts === 'function') {
        await settings.toggleLoginAlerts(updates.loginAlertsEnabled);
      } else {
        settings.loginAlertsEnabled = updates.loginAlertsEnabled;
        settings.updatedAt = new Date().toISOString();
        await settings.save();
      }
    }
    
    return settings;
  } catch (error) {
    console.error('Error in updateSecuritySettings:', error);
    throw error;
  }
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
