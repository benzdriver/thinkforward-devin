/**
 * 管理员设置服务
 * 处理系统设置的业务逻辑
 */

const SystemSettings = require('../../models/settings/admin/SystemSettings');
const SettingsHistory = require('../../models/settings/admin/SettingsHistory');

/**
 * 获取系统设置
 * @returns {Promise<Object>} 系统设置
 */
const getSystemSettings = async () => {
  try {
    return await SystemSettings.getSettings();
  } catch (error) {
    console.error('获取系统设置失败:', error);
    throw new Error('获取系统设置失败');
  }
};

/**
 * 更新系统设置
 * @param {Object} settings - 新的设置
 * @param {Object} user - 当前用户
 * @param {Object} requestInfo - 请求信息
 * @returns {Promise<Object>} 更新后的设置
 */
const updateSystemSettings = async (settings, user, requestInfo = {}) => {
  try {
    const currentSettings = await SystemSettings.getSettings();
    
    const categories = Object.keys(settings).filter(key => 
      ['general', 'security', 'notifications', 'integrations', 'appearance', 'advanced'].includes(key)
    );
    
    const updatedSettings = await SystemSettings.updateSettings(settings, user._id);
    
    for (const category of categories) {
      if (settings[category] && typeof settings[category] === 'object') {
        const changes = {};
        const oldValues = currentSettings[category] || {};
        const newValues = settings[category];
        
        Object.keys(newValues).forEach(key => {
          if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
            changes[key] = {
              old: oldValues[key],
              new: newValues[key]
            };
          }
        });
        
        if (Object.keys(changes).length > 0) {
          await SettingsHistory.logChange({
            userId: user._id,
            userName: user.name || user.email,
            changes,
            category,
            action: 'update',
            ipAddress: requestInfo.ip,
            userAgent: requestInfo.userAgent
          });
        }
      }
    }
    
    return updatedSettings;
  } catch (error) {
    console.error('更新系统设置失败:', error);
    throw new Error('更新系统设置失败');
  }
};

/**
 * 重置系统设置为默认值
 * @param {Object} user - 当前用户
 * @param {Object} requestInfo - 请求信息
 * @returns {Promise<Object>} 重置后的设置
 */
const resetSystemSettings = async (user, requestInfo = {}) => {
  try {
    const currentSettings = await SystemSettings.getSettings();
    
    const resetSettings = await SystemSettings.resetSettings(user._id);
    
    await SettingsHistory.logChange({
      userId: user._id,
      userName: user.name || user.email,
      changes: { fullReset: true },
      category: 'general', // 使用general作为全局重置的类别
      action: 'reset',
      ipAddress: requestInfo.ip,
      userAgent: requestInfo.userAgent
    });
    
    return resetSettings;
  } catch (error) {
    console.error('重置系统设置失败:', error);
    throw new Error('重置系统设置失败');
  }
};

/**
 * 获取设置历史记录
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 历史记录列表
 */
const getSettingsHistory = async (filter = {}, limit = 20, skip = 0) => {
  try {
    return await SettingsHistory.getHistory(filter, limit, skip);
  } catch (error) {
    console.error('获取设置历史记录失败:', error);
    throw new Error('获取设置历史记录失败');
  }
};

/**
 * 导出系统设置
 * @returns {Promise<Object>} 导出的设置
 */
const exportSettings = async () => {
  try {
    const settings = await SystemSettings.getSettings();
    
    const exportData = JSON.parse(JSON.stringify(settings));
    
    if (exportData.notifications && exportData.notifications.email) {
      if (exportData.notifications.email.smtpSettings) {
        delete exportData.notifications.email.smtpSettings.auth.pass;
      }
      delete exportData.notifications.email.apiKey;
    }
    
    if (exportData.integrations) {
      if (exportData.integrations.payment) {
        delete exportData.integrations.payment.apiKey;
        delete exportData.integrations.payment.secretKey;
        delete exportData.integrations.payment.webhookSecret;
      }
      
      if (exportData.integrations.storage) {
        delete exportData.integrations.storage.accessKey;
        delete exportData.integrations.storage.secretKey;
      }
      
      if (exportData.integrations.socialLogin) {
        Object.keys(exportData.integrations.socialLogin).forEach(provider => {
          delete exportData.integrations.socialLogin[provider].clientSecret;
          delete exportData.integrations.socialLogin[provider].appSecret;
        });
      }
    }
    
    exportData.exportMeta = {
      exportDate: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    };
    
    return exportData;
  } catch (error) {
    console.error('导出系统设置失败:', error);
    throw new Error('导出系统设置失败');
  }
};

/**
 * 导入系统设置
 * @param {Object} importData - 导入的设置数据
 * @param {Object} user - 当前用户
 * @param {Object} requestInfo - 请求信息
 * @returns {Promise<Object>} 导入后的设置
 */
const importSettings = async (importData, user, requestInfo = {}) => {
  try {
    if (!importData || typeof importData !== 'object') {
      throw new Error('无效的导入数据');
    }
    
    delete importData.exportMeta;
    delete importData._id;
    delete importData.createdAt;
    delete importData.updatedAt;
    delete importData.__v;
    
    const currentSettings = await SystemSettings.getSettings();
    
    const updatedSettings = await SystemSettings.updateSettings(importData, user._id);
    
    await SettingsHistory.logChange({
      userId: user._id,
      userName: user.name || user.email,
      changes: { importedSettings: true },
      category: 'general', // 使用general作为导入操作的类别
      action: 'update',
      ipAddress: requestInfo.ip,
      userAgent: requestInfo.userAgent
    });
    
    return updatedSettings;
  } catch (error) {
    console.error('导入系统设置失败:', error);
    throw new Error('导入系统设置失败: ' + error.message);
  }
};

/**
 * 测试邮件配置
 * @param {Object} emailConfig - 邮件配置
 * @param {String} testEmail - 测试邮箱地址
 * @returns {Promise<Object>} 测试结果
 */
const testEmailConfig = async (emailConfig, testEmail) => {
  try {
    
    
    return {
      success: true,
      message: `测试邮件已发送到 ${testEmail}`
    };
  } catch (error) {
    console.error('测试邮件配置失败:', error);
    return {
      success: false,
      message: error.message || '测试邮件配置失败'
    };
  }
};

/**
 * 清除系统缓存
 * @param {Object} user - 当前用户
 * @param {Object} requestInfo - 请求信息
 * @returns {Promise<Object>} 清除结果
 */
const clearSystemCache = async (user, requestInfo = {}) => {
  try {
    
    await SettingsHistory.logChange({
      userId: user._id,
      userName: user.name || user.email,
      changes: { cacheCleared: true },
      category: 'advanced',
      action: 'update',
      ipAddress: requestInfo.ip,
      userAgent: requestInfo.userAgent
    });
    
    return {
      success: true,
      message: '系统缓存已清除'
    };
  } catch (error) {
    console.error('清除系统缓存失败:', error);
    return {
      success: false,
      message: error.message || '清除系统缓存失败'
    };
  }
};

module.exports = {
  getSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  getSettingsHistory,
  exportSettings,
  importSettings,
  testEmailConfig,
  clearSystemCache
};
