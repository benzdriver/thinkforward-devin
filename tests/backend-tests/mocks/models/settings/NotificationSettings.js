/**
 * Mock NotificationSettings model for testing
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
    assessmentResults: {
      type: Boolean,
      default: true
    },
    pathwayUpdates: {
      type: Boolean,
      default: true
    },
    consultantMessages: {
      type: Boolean,
      default: true
    },
    systemAnnouncements: {
      type: Boolean,
      default: true
    }
  },
  push: {
    assessmentResults: {
      type: Boolean,
      default: true
    },
    pathwayUpdates: {
      type: Boolean,
      default: true
    },
    consultantMessages: {
      type: Boolean,
      default: true
    },
    systemAnnouncements: {
      type: Boolean,
      default: false
    }
  },
  sms: {
    assessmentResults: {
      type: Boolean,
      default: false
    },
    pathwayUpdates: {
      type: Boolean,
      default: false
    },
    consultantMessages: {
      type: Boolean,
      default: true
    },
    systemAnnouncements: {
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

notificationSettingsSchema.methods.updateEmailSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.email[key] !== undefined && typeof settings[key] === 'boolean') {
      this.email[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

notificationSettingsSchema.methods.updatePushSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.push[key] !== undefined && typeof settings[key] === 'boolean') {
      this.push[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

notificationSettingsSchema.methods.updateSmsSettings = function(settings) {
  Object.keys(settings).forEach(key => {
    if (this.sms[key] !== undefined && typeof settings[key] === 'boolean') {
      this.sms[key] = settings[key];
    }
  });
  
  this.updatedAt = new Date().toISOString();
  return this.save();
};

notificationSettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

notificationSettingsSchema.statics.createDefault = function(userId) {
  return this.create({
    userId,
    email: {
      assessmentResults: true,
      pathwayUpdates: true,
      consultantMessages: true,
      systemAnnouncements: true
    },
    push: {
      assessmentResults: true,
      pathwayUpdates: true,
      consultantMessages: true,
      systemAnnouncements: false
    },
    sms: {
      assessmentResults: false,
      pathwayUpdates: false,
      consultantMessages: true,
      systemAnnouncements: false
    }
  });
};

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
