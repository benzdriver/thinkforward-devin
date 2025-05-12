/**
 * 个人资料设置控制器
 * 处理用户个人资料设置的HTTP请求
 */

const profileSettingsService = require('../../services/settings/profileSettingsService');

/**
 * 获取所有设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getAllSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权访问此用户的设置'
      });
    }
    
    const settings = await profileSettingsService.getAllSettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 初始化用户设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.initializeSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { email, sessionInfo } = req.body;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权为此用户初始化设置'
      });
    }
    
    const settings = await profileSettingsService.initializeSettings(userId, email, sessionInfo, locale);
    
    res.status(201).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取账户设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getAccountSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权访问此用户的账户设置'
      });
    }
    
    const settings = await profileSettingsService.getAccountSettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新账户设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.updateAccountSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权更新此用户的账户设置'
      });
    }
    
    const settings = await profileSettingsService.updateAccountSettings(userId, updates, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取通知设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getNotificationSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权访问此用户的通知设置'
      });
    }
    
    const settings = await profileSettingsService.getNotificationSettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新通知设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权更新此用户的通知设置'
      });
    }
    
    const settings = await profileSettingsService.updateNotificationSettings(userId, updates, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取隐私设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getPrivacySettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权访问此用户的隐私设置'
      });
    }
    
    const settings = await profileSettingsService.getPrivacySettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新隐私设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.updatePrivacySettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权更新此用户的隐私设置'
      });
    }
    
    const settings = await profileSettingsService.updatePrivacySettings(userId, updates, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取安全设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.getSecuritySettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权访问此用户的安全设置'
      });
    }
    
    const settings = await profileSettingsService.getSecuritySettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新安全设置
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.updateSecuritySettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权更新此用户的安全设置'
      });
    }
    
    const settings = await profileSettingsService.updateSecuritySettings(userId, updates, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 添加会话
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.addSession = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sessionInfo = req.body;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权为此用户添加会话'
      });
    }
    
    const settings = await profileSettingsService.addSession(userId, sessionInfo, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 移除会话
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.removeSession = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权为此用户移除会话'
      });
    }
    
    const settings = await profileSettingsService.removeSession(userId, sessionId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 移除所有其他会话
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.removeAllOtherSessions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权为此用户移除会话'
      });
    }
    
    const settings = await profileSettingsService.removeAllOtherSessions(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新密码更改时间
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
exports.updatePasswordChangeTime = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const locale = req.locale || 'zh-CN';
    
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权为此用户更新密码更改时间'
      });
    }
    
    const settings = await profileSettingsService.updatePasswordChangeTime(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};
