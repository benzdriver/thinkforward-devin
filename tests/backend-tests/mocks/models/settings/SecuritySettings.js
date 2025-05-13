/**
 * Mock SecuritySettings model for testing
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

securitySettingsSchema.methods.enableTwoFactor = function(method) {
  this.twoFactorEnabled = true;
  this.twoFactorMethod = method;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

securitySettingsSchema.methods.disableTwoFactor = function() {
  this.twoFactorEnabled = false;
  this.twoFactorMethod = undefined;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

securitySettingsSchema.methods.toggleLoginAlerts = function(enabled) {
  this.loginAlertsEnabled = enabled;
  this.updatedAt = new Date().toISOString();
  return this.save();
};

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

securitySettingsSchema.methods.removeSession = function(sessionId) {
  this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
  this.updatedAt = new Date().toISOString();
  return this.save();
};

securitySettingsSchema.methods.removeAllOtherSessions = function() {
  this.activeSessions = this.activeSessions.filter(s => s.current);
  this.updatedAt = new Date().toISOString();
  return this.save();
};

securitySettingsSchema.methods.updatePasswordChangeTime = function() {
  this.lastPasswordChange = new Date().toISOString();
  this.updatedAt = new Date().toISOString();
  return this.save();
};

securitySettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

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
