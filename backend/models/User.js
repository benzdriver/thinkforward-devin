/**
 * 用户模型
 * 定义用户相关的数据结构和方法
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'consultant', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  phoneNumber: {
    type: String,
    trim: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  preferredLanguage: {
    type: String,
    enum: ['en', 'fr', 'zh'],
    default: 'en'
  },
  createdProfiles: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  consultantProfile: {
    type: Schema.Types.ObjectId,
    ref: 'Consultant'
  },
  notifications: [{
    message: String,
    type: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
      default: 'info'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    link: String
  }],
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  collection: 'users'
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'notifications.read': 1 });

userSchema.pre('save', async function(next) {
  const user = this;
  
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateVerificationToken = function() {
  this.verificationToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
  return this.verificationToken;
};

userSchema.methods.generatePasswordResetToken = function() {
  this.resetPasswordToken = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15);
  this.resetPasswordExpires = Date.now() + 3600000; // 1小时后过期
  return this.resetPasswordToken;
};

userSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.lockUntil) {
    updates.$set = { lockUntil: Date.now() + 3600000 };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

userSchema.methods.addNotification = function(message, type = 'info', link = '') {
  this.notifications.push({
    message,
    type,
    read: false,
    createdAt: Date.now(),
    link
  });
  return this.save();
};

userSchema.methods.markNotificationAsRead = function(notificationId) {
  const notification = this.notifications.id(notificationId);
  if (notification) {
    notification.read = true;
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.markAllNotificationsAsRead = function() {
  this.notifications.forEach(notification => {
    notification.read = true;
  });
  return this.save();
};

userSchema.methods.getUnreadNotificationCount = function() {
  return this.notifications.filter(notification => !notification.read).length;
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByVerificationToken = function(token) {
  return this.findOne({ verificationToken: token });
};

userSchema.statics.findByPasswordResetToken = function(token) {
  return this.findOne({ 
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
};

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isConsultant').get(function() {
  return this.role === 'consultant';
});

userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

const User = mongoose.model('User', userSchema);

module.exports = User;
