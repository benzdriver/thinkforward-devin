/**
 * 通知设置模型
 * 存储用户的通知偏好设置
 */

const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    marketing: {
      type: Boolean,
      default: true
    },
    updates: {
      type: Boolean,
      default: true
    },
    security: {
      type: Boolean,
      default: true
    },
    reminders: {
      type: Boolean,
      default: true
    }
  },
  push: {
    messages: {
      type: Boolean,
      default: true
    },
    taskUpdates: {
      type: Boolean,
      default: true
    },
    appointments: {
      type: Boolean,
      default: true
    },
    documentUpdates: {
      type: Boolean,
      default: true
    }
  },
  sms: {
    security: {
      type: Boolean,
      default: true
    },
    appointments: {
      type: Boolean,
      default: true
    },
    importantUpdates: {
      type: Boolean,
      default: true
    }
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true
});

/**
 * 更新邮件通知设置
 * @param {Object} settings - 邮件通知设置
 * @returns {Promise<Object>} 更新后的设置
 */
notificationSettingsSchema.methods.updateEmailSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.email[key] !== undefined && typeof settings[key] === 'boolean') {
      this.email[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新推送通知设置
 * @param {Object} settings - 推送通知设置
 * @returns {Promise<Object>} 更新后的设置
 */
notificationSettingsSchema.methods.updatePushSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.push[key] !== undefined && typeof settings[key] === 'boolean') {
      this.push[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新短信通知设置
 * @param {Object} settings - 短信通知设置
 * @returns {Promise<Object>} 更新后的设置
 */
notificationSettingsSchema.methods.updateSmsSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.sms[key] !== undefined && typeof settings[key] === 'boolean') {
      this.sms[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 禁用所有通知
 * @returns {Promise<Object>} 更新后的设置
 */
notificationSettingsSchema.methods.disableAllNotifications = function() {
  Object.keys(this.email).forEach(key => {
    this.email[key] = false;
  });
  
  Object.keys(this.push).forEach(key => {
    this.push[key] = false;
  });
  
  Object.keys(this.sms).forEach(key => {
    this.sms[key] = false;
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 启用所有通知
 * @returns {Promise<Object>} 更新后的设置
 */
notificationSettingsSchema.methods.enableAllNotifications = function() {
  Object.keys(this.email).forEach(key => {
    this.email[key] = true;
  });
  
  Object.keys(this.push).forEach(key => {
    this.push[key] = true;
  });
  
  Object.keys(this.sms).forEach(key => {
    this.sms[key] = true;
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 按用户ID查找通知设置
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 通知设置
 */
notificationSettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

/**
 * 创建默认通知设置
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 新创建的通知设置
 */
notificationSettingsSchema.statics.createDefault = function(userId) {
  return this.create({
    userId,
    email: {
      marketing: true,
      updates: true,
      security: true,
      reminders: true
    },
    push: {
      messages: true,
      taskUpdates: true,
      appointments: true,
      documentUpdates: true
    },
    sms: {
      security: true,
      appointments: true,
      importantUpdates: true
    }
  });
};

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
