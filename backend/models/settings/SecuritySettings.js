/**
 * 安全设置模型
 * 存储用户的安全相关设置
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  location: String,
  lastActive: {
    type: String,
    default: () => new Date().toISOString()
  },
  current: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const securitySettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorMethod: {
    type: String,
    enum: ['sms', 'app', 'email']
  },
  loginAlertsEnabled: {
    type: Boolean,
    default: true
  },
  activeSessions: [sessionSchema],
  lastPasswordChange: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true
});

/**
 * 启用两因素认证
 * @param {String} method - 认证方法
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.enableTwoFactor = function(method) {
  this.twoFactorEnabled = true;
  this.twoFactorMethod = method;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 禁用两因素认证
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.disableTwoFactor = function() {
  this.twoFactorEnabled = false;
  this.twoFactorMethod = undefined;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 切换登录提醒
 * @param {Boolean} enabled - 是否启用
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.toggleLoginAlerts = function(enabled) {
  this.loginAlertsEnabled = enabled;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 添加会话
 * @param {Object} session - 会话信息
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.addSession = function(session) {
  this.activeSessions.push({
    id: session.id,
    device: session.device,
    location: session.location,
    lastActive: new Date().toISOString(),
    current: session.current || false
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新会话活动时间
 * @param {String} sessionId - 会话ID
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.updateSessionActivity = function(sessionId) {
  const session = this.activeSessions.find(s => s.id === sessionId);
  
  if (session) {
    session.lastActive = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    return this.save();
  }
  
  return Promise.resolve(this);
};

/**
 * 移除会话
 * @param {String} sessionId - 会话ID
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.removeSession = function(sessionId) {
  this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 移除所有会话（除当前会话外）
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.removeAllOtherSessions = function() {
  this.activeSessions = this.activeSessions.filter(s => s.current);
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新密码更改时间
 * @returns {Promise<Object>} 更新后的设置
 */
securitySettingsSchema.methods.updatePasswordChangeTime = function() {
  this.lastPasswordChange = new Date().toISOString();
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 按用户ID查找安全设置
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 安全设置
 */
securitySettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

/**
 * 创建默认安全设置
 * @param {String} userId - 用户ID
 * @param {Object} currentSession - 当前会话信息
 * @returns {Promise<Object>} 新创建的安全设置
 */
securitySettingsSchema.statics.createDefault = function(userId, currentSession = null) {
  const settings = {
    userId,
    twoFactorEnabled: false,
    loginAlertsEnabled: true,
    activeSessions: [],
    lastPasswordChange: new Date().toISOString()
  };
  
  if (currentSession) {
    settings.activeSessions.push({
      id: currentSession.id,
      device: currentSession.device,
      location: currentSession.location || 'Unknown',
      lastActive: new Date().toISOString(),
      current: true
    });
  }
  
  return this.create(settings);
};

const SecuritySettings = mongoose.model('SecuritySettings', securitySettingsSchema);

module.exports = SecuritySettings;
