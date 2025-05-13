/**
 * Mock User model for tests
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'consultant'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Hash password before saving
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare entered password with stored hash
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token
 */
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'thinkforward-secret-key',
    { expiresIn: '1h' }
  );
};

/**
 * Generate refresh token
 */
userSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET || 'thinkforward-refresh-secret-key',
    { expiresIn: '7d' }
  );
  
  this.refreshToken = refreshToken;
  return refreshToken;
};

userSchema.statics.findByUserId = async function(userId) {
  return this.findById(userId);
};

const originalFindById = mongoose.Query.prototype.findById;
if (originalFindById) {
  mongoose.Query.prototype.findById = function(...args) {
    return originalFindById.apply(this, args).catch(err => {
      if (err.message.includes('No document found for query')) {
        return null;
      }
      throw err;
    });
  };
}

userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email }).select('+password');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
