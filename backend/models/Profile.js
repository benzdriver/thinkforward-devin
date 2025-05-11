/**
 * Profile model for user profile management
 */
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    nationality: {
      type: String,
      trim: true
    },
    countryOfResidence: {
      type: String,
      trim: true
    },
    passportNumber: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String
    },
    phone: {
      type: String,
      trim: true
    }
  },
  educationInfo: {
    highestDegree: {
      type: String,
      enum: ['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other'],
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    graduationYear: {
      type: String,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    }
  },
  workExperience: {
    occupation: {
      type: String,
      trim: true
    },
    yearsOfExperience: {
      type: Number,
      default: 0
    },
    currentEmployer: {
      type: String,
      trim: true
    },
    jobTitle: {
      type: String,
      trim: true
    }
  },
  languageSkills: {
    englishProficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native', 'none'],
      default: 'none'
    },
    frenchProficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native', 'none'],
      default: 'none'
    },
    otherLanguages: [{
      type: String,
      trim: true
    }]
  },
  immigrationInfo: {
    desiredCountry: {
      type: String,
      trim: true
    },
    desiredProvince: {
      type: String,
      trim: true
    },
    immigrationPath: {
      type: String,
      trim: true
    },
    hasJobOffer: {
      type: Boolean,
      default: false
    },
    hasFamilyInCountry: {
      type: Boolean,
      default: false
    }
  },
  completionStatus: {
    personalInfo: {
      type: Boolean,
      default: false
    },
    educationInfo: {
      type: Boolean,
      default: false
    },
    workExperience: {
      type: Boolean,
      default: false
    },
    languageSkills: {
      type: Boolean,
      default: false
    },
    immigrationInfo: {
      type: Boolean,
      default: false
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
}, {
  timestamps: true
});

/**
 * Check if profile is complete
 * @returns {boolean} - Whether profile is complete
 */
profileSchema.methods.isComplete = function() {
  const { personalInfo, educationInfo, workExperience, languageSkills, immigrationInfo } = this.completionStatus;
  return personalInfo && educationInfo && workExperience && languageSkills && immigrationInfo;
};

/**
 * Update completion status based on profile data
 */
profileSchema.methods.updateCompletionStatus = function() {
  this.completionStatus.personalInfo = !!(
    this.personalInfo.firstName &&
    this.personalInfo.lastName &&
    this.personalInfo.dateOfBirth &&
    this.personalInfo.nationality
  );
  
  this.completionStatus.educationInfo = !!(
    this.educationInfo.highestDegree &&
    this.educationInfo.institution &&
    this.educationInfo.graduationYear &&
    this.educationInfo.fieldOfStudy
  );
  
  this.completionStatus.workExperience = !!(
    this.workExperience.occupation &&
    this.workExperience.yearsOfExperience &&
    this.workExperience.currentEmployer &&
    this.workExperience.jobTitle
  );
  
  this.completionStatus.languageSkills = !!(
    this.languageSkills.englishProficiency &&
    this.languageSkills.englishProficiency !== 'none'
  );
  
  this.completionStatus.immigrationInfo = !!(
    this.immigrationInfo.desiredCountry &&
    this.immigrationInfo.desiredProvince &&
    this.immigrationInfo.immigrationPath
  );
};

/**
 * Pre-save middleware to update completion status
 */
profileSchema.pre('save', function(next) {
  this.updateCompletionStatus();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
