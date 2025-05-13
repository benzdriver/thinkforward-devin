/**
 * Mock AccountSettings model for testing
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
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true
});

accountSettingsSchema.methods.updateSettings = function(settings) {
  const allowedFields = ['email', 'language', 'timezone'];
  
  allowedFields.forEach(field => {
    if (settings[field] !== undefined) {
      this[field] = settings[field];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

accountSettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

accountSettingsSchema.statics.createDefault = function(userId, email) {
  return this.create({
    userId,
    email,
    emailVerified: false,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai'
  });
};

const AccountSettings = mongoose.model('AccountSettings', accountSettingsSchema);

module.exports = AccountSettings;
