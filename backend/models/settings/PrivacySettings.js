/**
 * 隐私设置模型
 * 存储用户的隐私偏好设置
 */

const mongoose = require('mongoose');

const privacySettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'private', 'connections'],
    default: 'connections'
  },
  activityVisibility: {
    type: String,
    enum: ['public', 'private', 'connections'],
    default: 'connections'
  },
  documentVisibility: {
    type: String,
    enum: ['public', 'private', 'connections'],
    default: 'private'
  },
  shareDataWithPartners: {
    type: Boolean,
    default: false
  },
  allowPersonalizedRecommendations: {
    type: Boolean,
    default: true
  },
  allowAnonymousDataCollection: {
    type: Boolean,
    default: true
  },
  allowSearchEngineIndexing: {
    type: Boolean,
    default: false
  },
  cookies: {
    essential: {
      type: Boolean,
      default: true
    },
    preferences: {
      type: Boolean,
      default: true
    },
    analytics: {
      type: Boolean,
      default: true
    },
    marketing: {
      type: Boolean,
      default: false
    }
  },
  dataSharing: {
    analytics: {
      type: Boolean,
      default: true
    },
    thirdParty: {
      type: Boolean,
      default: false
    },
    improvementProgram: {
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
 * 更新可见性设置
 * @param {Object} settings - 可见性设置
 * @returns {Promise<Object>} 更新后的设置
 */
privacySettingsSchema.methods.updateVisibilitySettings = function(settings) {
  const visibilityFields = ['profileVisibility', 'activityVisibility', 'documentVisibility'];
  
  visibilityFields.forEach(field => {
    if (settings[field] && ['public', 'private', 'connections'].includes(settings[field])) {
      this[field] = settings[field];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新数据共享设置
 * @param {Object} settings - 数据共享设置
 * @returns {Promise<Object>} 更新后的设置
 */
privacySettingsSchema.methods.updateDataSharingSettings = function(settings) {
  const dataSharingFields = [
    'shareDataWithPartners', 
    'allowPersonalizedRecommendations', 
    'allowAnonymousDataCollection',
    'allowSearchEngineIndexing'
  ];
  
  dataSharingFields.forEach(field => {
    if (typeof settings[field] === 'boolean') {
      this[field] = settings[field];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新Cookie设置
 * @param {Object} settings - Cookie设置
 * @returns {Promise<Object>} 更新后的设置
 */
privacySettingsSchema.methods.updateCookieSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.cookies[key] !== undefined && typeof settings[key] === 'boolean') {
      this.cookies[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 更新数据共享详细设置
 * @param {Object} settings - 数据共享详细设置
 * @returns {Promise<Object>} 更新后的设置
 */
privacySettingsSchema.methods.updateDataSharingDetails = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.dataSharing[key] !== undefined && typeof settings[key] === 'boolean') {
      this.dataSharing[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 设置最高隐私保护
 * @returns {Promise<Object>} 更新后的设置
 */
privacySettingsSchema.methods.setMaximumPrivacy = function() {
  this.profileVisibility = 'private';
  this.activityVisibility = 'private';
  this.documentVisibility = 'private';
  this.shareDataWithPartners = false;
  this.allowPersonalizedRecommendations = false;
  this.allowAnonymousDataCollection = false;
  this.allowSearchEngineIndexing = false;
  
  this.cookies.preferences = false;
  this.cookies.analytics = false;
  this.cookies.marketing = false;
  
  this.dataSharing.analytics = false;
  this.dataSharing.thirdParty = false;
  this.dataSharing.improvementProgram = false;
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

/**
 * 按用户ID查找隐私设置
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 隐私设置
 */
privacySettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

/**
 * 创建默认隐私设置
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 新创建的隐私设置
 */
privacySettingsSchema.statics.createDefault = function(userId) {
  return this.create({
    userId,
    profileVisibility: 'connections',
    activityVisibility: 'connections',
    documentVisibility: 'private',
    shareDataWithPartners: false,
    allowPersonalizedRecommendations: true,
    allowAnonymousDataCollection: true,
    allowSearchEngineIndexing: false,
    cookies: {
      essential: true,
      preferences: true,
      analytics: true,
      marketing: false
    },
    dataSharing: {
      analytics: true,
      thirdParty: false,
      improvementProgram: true
    }
  });
};

const PrivacySettings = mongoose.model('PrivacySettings', privacySettingsSchema);

module.exports = PrivacySettings;
