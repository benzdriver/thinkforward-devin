/**
 * Mock PrivacySettings model for testing
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
    enum: ['public', 'connections', 'private'],
    default: 'connections'
  },
  activityVisibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
    default: 'connections'
  },
  documentVisibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
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
    necessary: {
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
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true
});

privacySettingsSchema.methods.updateVisibilitySettings = function(settings) {
  const visibilityFields = ['profileVisibility', 'activityVisibility', 'documentVisibility'];
  
  visibilityFields.forEach(field => {
    if (settings[field] !== undefined) {
      this[field] = settings[field];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

privacySettingsSchema.methods.updateDataSharingSettings = function(settings) {
  const dataSharingFields = [
    'shareDataWithPartners', 
    'allowPersonalizedRecommendations', 
    'allowAnonymousDataCollection',
    'allowSearchEngineIndexing'
  ];
  
  dataSharingFields.forEach(field => {
    if (settings[field] !== undefined) {
      this[field] = settings[field];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

privacySettingsSchema.methods.updateCookieSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.cookies[key] !== undefined && typeof settings[key] === 'boolean') {
      this.cookies[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

privacySettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

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
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: false
    }
  });
};

const PrivacySettings = mongoose.model('PrivacySettings', privacySettingsSchema);

module.exports = PrivacySettings;
