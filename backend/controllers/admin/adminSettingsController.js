/**
 * 管理员设置控制器
 * 处理系统设置相关的HTTP请求
 */

const adminSettingsService = require('../../services/admin/adminSettingsService');

/**
 * 获取系统设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getSystemSettings = async (req, res, next) => {
  try {
    const settings = await adminSettingsService.getSystemSettings();
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新系统设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateSystemSettings = async (req, res, next) => {
  try {
    const settings = req.body;
    const user = req.user;
    
    const requestInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const updatedSettings = await adminSettingsService.updateSystemSettings(
      settings,
      user,
      requestInfo
    );
    
    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: '系统设置已更新'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 重置系统设置为默认值
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const resetSystemSettings = async (req, res, next) => {
  try {
    const user = req.user;
    
    const requestInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const resetSettings = await adminSettingsService.resetSystemSettings(
      user,
      requestInfo
    );
    
    res.status(200).json({
      success: true,
      data: resetSettings,
      message: '系统设置已重置为默认值'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取设置历史记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getSettingsHistory = async (req, res, next) => {
  try {
    const { category, userId, startDate, endDate, limit = 20, skip = 0 } = req.query;
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (startDate || endDate) {
      filter.timestamp = {};
      
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }
    
    const history = await adminSettingsService.getSettingsHistory(
      filter,
      parseInt(limit),
      parseInt(skip)
    );
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 导出系统设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const exportSettings = async (req, res, next) => {
  try {
    const exportData = await adminSettingsService.exportSettings();
    
    const fileName = `system-settings-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json(exportData);
  } catch (error) {
    next(error);
  }
};

/**
 * 导入系统设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const importSettings = async (req, res, next) => {
  try {
    const importData = req.body;
    const user = req.user;
    
    const requestInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const updatedSettings = await adminSettingsService.importSettings(
      importData,
      user,
      requestInfo
    );
    
    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: '系统设置已导入'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 测试邮件配置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const testEmailConfig = async (req, res, next) => {
  try {
    const { emailConfig, testEmail } = req.body;
    
    if (!emailConfig || !testEmail) {
      return res.status(400).json({
        success: false,
        message: '邮件配置和测试邮箱地址是必需的'
      });
    }
    
    const result = await adminSettingsService.testEmailConfig(emailConfig, testEmail);
    
    res.status(200).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 清除系统缓存
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const clearSystemCache = async (req, res, next) => {
  try {
    const user = req.user;
    
    const requestInfo = {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const result = await adminSettingsService.clearSystemCache(user, requestInfo);
    
    res.status(200).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
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
