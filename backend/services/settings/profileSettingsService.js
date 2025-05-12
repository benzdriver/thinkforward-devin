/**
 * 个人资料设置服务
 * 处理用户个人资料设置的业务逻辑
 */

const AccountSettings = require('../../models/settings/AccountSettings');
const NotificationSettings = require('../../models/settings/NotificationSettings');
const PrivacySettings = require('../../models/settings/PrivacySettings');
const SecuritySettings = require('../../models/settings/SecuritySettings');
const User = require('../../models/User');
const { translateError } = require('../../utils/errorHandler');

/**
 * 获取用户所有设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 所有设置
 */
exports.getAllSettings = async (userId, locale = 'zh-CN') => {
  try {
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
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 初始化用户设置
 * @param {string} userId - 用户ID
 * @param {string} email - 用户邮箱
 * @param {Object} sessionInfo - 会话信息
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 初始化的设置
 */
exports.initializeSettings = async (userId, email, sessionInfo = null, locale = 'zh-CN') => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
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
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取账户设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 账户设置
 */
exports.getAccountSettings = async (userId, locale = 'zh-CN') => {
  try {
    let settings = await AccountSettings.findByUserId(userId);
    
    if (!settings) {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      settings = await AccountSettings.createDefault(userId, user.email);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新账户设置
 * @param {string} userId - 用户ID
 * @param {Object} updates - 更新数据
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.updateAccountSettings = async (userId, updates, locale = 'zh-CN') => {
  try {
    let settings = await AccountSettings.findByUserId(userId);
    
    if (!settings) {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      settings = await AccountSettings.createDefault(userId, user.email);
    }
    
    return await settings.updateSettings(updates);
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取通知设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 通知设置
 */
exports.getNotificationSettings = async (userId, locale = 'zh-CN') => {
  try {
    let settings = await NotificationSettings.findByUserId(userId);
    
    if (!settings) {
      settings = await NotificationSettings.createDefault(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新通知设置
 * @param {string} userId - 用户ID
 * @param {Object} updates - 更新数据
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.updateNotificationSettings = async (userId, updates, locale = 'zh-CN') => {
  try {
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
    
    settings.updatedAt = new Date().toISOString();
    await settings.save();
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取隐私设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 隐私设置
 */
exports.getPrivacySettings = async (userId, locale = 'zh-CN') => {
  try {
    let settings = await PrivacySettings.findByUserId(userId);
    
    if (!settings) {
      settings = await PrivacySettings.createDefault(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新隐私设置
 * @param {string} userId - 用户ID
 * @param {Object} updates - 更新数据
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.updatePrivacySettings = async (userId, updates, locale = 'zh-CN') => {
  try {
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
    
    if (updates.shareDataWithPartners !== undefined || 
        updates.allowPersonalizedRecommendations !== undefined ||
        updates.allowAnonymousDataCollection !== undefined ||
        updates.allowSearchEngineIndexing !== undefined) {
      
      const dataSharingUpdates = {};
      
      if (updates.shareDataWithPartners !== undefined) {
        dataSharingUpdates.shareDataWithPartners = updates.shareDataWithPartners;
      }
      
      if (updates.allowPersonalizedRecommendations !== undefined) {
        dataSharingUpdates.allowPersonalizedRecommendations = updates.allowPersonalizedRecommendations;
      }
      
      if (updates.allowAnonymousDataCollection !== undefined) {
        dataSharingUpdates.allowAnonymousDataCollection = updates.allowAnonymousDataCollection;
      }
      
      if (updates.allowSearchEngineIndexing !== undefined) {
        dataSharingUpdates.allowSearchEngineIndexing = updates.allowSearchEngineIndexing;
      }
      
      await settings.updateDataSharingSettings(dataSharingUpdates);
    }
    
    if (updates.cookies) {
      await settings.updateCookieSettings(updates.cookies);
    }
    
    if (updates.dataSharing) {
      await settings.updateDataSharingDetails(updates.dataSharing);
    }
    
    settings.updatedAt = new Date().toISOString();
    await settings.save();
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取安全设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 安全设置
 */
exports.getSecuritySettings = async (userId, locale = 'zh-CN') => {
  try {
    let settings = await SecuritySettings.findByUserId(userId);
    
    if (!settings) {
      settings = await SecuritySettings.createDefault(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新安全设置
 * @param {string} userId - 用户ID
 * @param {Object} updates - 更新数据
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.updateSecuritySettings = async (userId, updates, locale = 'zh-CN') => {
  try {
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
    
    if (updates.activeSessions) {
      settings.activeSessions = updates.activeSessions;
      settings.updatedAt = new Date().toISOString();
      await settings.save();
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 添加会话
 * @param {string} userId - 用户ID
 * @param {Object} sessionInfo - 会话信息
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.addSession = async (userId, sessionInfo, locale = 'zh-CN') => {
  try {
    let settings = await SecuritySettings.findByUserId(userId);
    
    if (!settings) {
      settings = await SecuritySettings.createDefault(userId);
    }
    
    return await settings.addSession(sessionInfo);
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 移除会话
 * @param {string} userId - 用户ID
 * @param {string} sessionId - 会话ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.removeSession = async (userId, sessionId, locale = 'zh-CN') => {
  try {
    const settings = await SecuritySettings.findByUserId(userId);
    
    if (!settings) {
      const error = new Error('Security settings not found');
      error.statusCode = 404;
      throw error;
    }
    
    return await settings.removeSession(sessionId);
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 移除所有其他会话
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.removeAllOtherSessions = async (userId, locale = 'zh-CN') => {
  try {
    const settings = await SecuritySettings.findByUserId(userId);
    
    if (!settings) {
      const error = new Error('Security settings not found');
      error.statusCode = 404;
      throw error;
    }
    
    return await settings.removeAllOtherSessions();
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新密码更改时间
 * @param {string} userId - 用户ID
 * @param {string} locale - 用户语言
 * @returns {Promise<Object>} - 更新后的设置
 */
exports.updatePasswordChangeTime = async (userId, locale = 'zh-CN') => {
  try {
    let settings = await SecuritySettings.findByUserId(userId);
    
    if (!settings) {
      settings = await SecuritySettings.createDefault(userId);
    }
    
    return await settings.updatePasswordChangeTime();
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};
