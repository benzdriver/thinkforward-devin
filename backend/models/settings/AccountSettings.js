/**
 * 账户设置模型
 * 存储用户的账户相关设置
 */

const mongoose = require('mongoose');

const accountSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'zh-CN',
    trim: true
  },
  timezone: {
    type: String,
    default: 'Asia/Shanghai',
    trim: true
  },
  dateFormat: {
    type: String,
    default: 'YYYY-MM-DD',
    trim: true
  },
  timeFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '24h'
  },
  currency: {
    type: String,
    default: 'CNY',
    trim: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorMethod: {
    type: String,
    enum: ['sms', 'app', 'email'],
    trim: true
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
accountSettingsSchema.methods.enableTwoFactor = function(method) {
  this.twoFactorEnabled = true;
  this.twoFactorMethod = method;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 禁用两因素认证
 * @returns {Promise<Object>} 更新后的设置
 */
accountSettingsSchema.methods.disableTwoFactor = function() {
  this.twoFactorEnabled = false;
  this.twoFactorMethod = undefined;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 验证邮箱
 * @returns {Promise<Object>} 更新后的设置
 */
accountSettingsSchema.methods.verifyEmail = function() {
  this.emailVerified = true;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 验证手机
 * @returns {Promise<Object>} 更新后的设置
 */
accountSettingsSchema.methods.verifyPhone = function() {
  this.phoneVerified = true;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新账户设置
 * @param {Object} settings - 设置数据
 * @returns {Promise<Object>} 更新后的设置
 */
accountSettingsSchema.methods.updateSettings = function(settings) {
  const allowedFields = [
    'email', 'phone', 'language', 'timezone', 
    'dateFormat', 'timeFormat', 'currency'
  ];
  
  allowedFields.forEach(field => {
    if (settings[field] !== undefined) {
      this[field] = settings[field];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 按用户ID查找账户设置
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 账户设置
 */
accountSettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

/**
 * 创建默认账户设置
 * @param {String} userId - 用户ID
 * @param {String} email - 用户邮箱
 * @returns {Promise<Object>} 新创建的账户设置
 */
accountSettingsSchema.statics.createDefault = function(userId, email) {
  return this.create({
    userId,
    email,
    emailVerified: false,
    phoneVerified: false,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'CNY',
    twoFactorEnabled: false
  });
};

const AccountSettings = mongoose.model('AccountSettings', accountSettingsSchema);

module.exports = AccountSettings;
