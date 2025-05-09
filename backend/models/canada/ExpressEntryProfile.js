const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Language Proficiency Schema
 * Stores language test scores and CLB equivalents
 */
const LanguageProficiencySchema = new Schema({
  language: {
    type: String,
    enum: ['english', 'french'],
    required: true
  },
  test: {
    type: String,
    enum: ['IELTS', 'CELPIP', 'TEF', 'TCF'],
    required: true
  },
  speaking: {
    type: Number,
    required: true
  },
  listening: {
    type: Number,
    required: true
  },
  reading: {
    type: Number,
    required: true
  },
  writing: {
    type: Number,
    required: true
  },
  clbEquivalent: {
    speaking: Number,
    listening: Number,
    reading: Number,
    writing: Number
  }
});

/**
 * Education Schema
 * Stores education details and Canadian equivalency
 */
const EducationSchema = new Schema({
  level: {
    type: String,
    enum: [
      'highSchool',
      'oneYearDiploma',
      'twoYearDiploma',
      'bachelors',
      'twoOrMoreDegrees',
      'masters',
      'phd'
    ],
    required: true
  },
  field: String,
  institution: String,
  country: String,
  completionDate: Date,
  canadianEquivalency: {
    hasECA: {
      type: Boolean,
      default: false
    },
    ecaAuthority: String,
    ecaDate: Date,
    ecaReport: String
  }
});

/**
 * Express Entry Profile Schema
 * Main schema for Express Entry profiles
 */
const ExpressEntryProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profileId: {
    type: String,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'commonLaw', 'divorced', 'separated', 'widowed'],
    required: true
  },
  languageProficiency: [LanguageProficiencySchema],
  education: [EducationSchema],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'invited', 'applied', 'approved', 'rejected'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ExpressEntryProfileSchema.pre('save', async function(next) {
  if (!this.profileId) {
    const currentYear = new Date().getFullYear().toString().substr(-2);
    const randomPart = Math.floor(1000000 + Math.random() * 9000000);
    this.profileId = `EE-${currentYear}-${randomPart}`;
  }
  next();
});

module.exports = mongoose.model('ExpressEntryProfile', ExpressEntryProfileSchema);
