/**
 * Mock Profile model for testing
 */
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    nationality: String,
    currentCountry: String
  },
  contactInfo: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  education: [{
    degree: String,
    institution: String,
    field: String,
    graduationYear: Number,
    country: String
  }],
  workExperience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  languageSkills: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native']
    },
    certification: String
  }],
  immigrationHistory: {
    previousApplications: [{
      country: String,
      programType: String,
      applicationDate: Date,
      status: String,
      notes: String
    }]
  },
  preferences: {
    targetCountries: [String],
    immigrationGoals: [String],
    budgetRange: {
      min: Number,
      max: Number,
      currency: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
