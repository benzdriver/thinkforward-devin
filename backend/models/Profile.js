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
  educationInfo: [{
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
      type: Number
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: true
    },
    additionalInfo: {
      type: String,
      trim: true
    }
  }],
  workExperience: [{
    company: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isCurrentJob: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    nocCode: {
      type: String,
      trim: true
    }
  }],
  languageSkills: [{
    language: {
      type: String,
      trim: true
    },
    proficiencyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native'],
      default: 'intermediate'
    },
    readingScore: {
      type: Number,
      min: 0,
      max: 12
    },
    writingScore: {
      type: Number,
      min: 0,
      max: 12
    },
    speakingScore: {
      type: Number,
      min: 0,
      max: 12
    },
    listeningScore: {
      type: Number,
      min: 0,
      max: 12
    },
    testType: {
      type: String,
      enum: ['ielts', 'celpip', 'tef', 'tcf', 'other'],
      default: 'ielts'
    },
    testDate: {
      type: Date
    }
  }],
  immigrationInfo: {
    interestedPrograms: [{
      type: String,
      trim: true
    }],
    preferredDestination: {
      type: String,
      trim: true
    },
    immigrationStatus: {
      type: String,
      enum: ['citizen', 'permanent_resident', 'work_permit', 'study_permit', 'visitor', 'none'],
      default: 'none'
    },
    previousApplications: [{
      program: {
        type: String,
        trim: true
      },
      year: {
        type: Number
      },
      status: {
        type: String,
        enum: ['approved', 'rejected', 'in_progress', 'withdrawn'],
        default: 'in_progress'
      }
    }]
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
    this.personalInfo.nationality &&
    this.personalInfo.countryOfResidence
  );
  
  this.completionStatus.educationInfo = !!(
    this.educationInfo.length > 0 &&
    this.educationInfo.every(edu => 
      edu.highestDegree && 
      edu.institution && 
      edu.graduationYear && 
      edu.fieldOfStudy
    )
  );
  
  this.completionStatus.workExperience = !!(
    this.workExperience.length > 0 &&
    this.workExperience.every(work => 
      work.company && 
      work.position && 
      work.startDate && 
      (work.isCurrentJob || work.endDate)
    )
  );
  
  this.completionStatus.languageSkills = !!(
    this.languageSkills.length > 0 &&
    this.languageSkills.every(lang => 
      lang.language && 
      lang.proficiencyLevel
    )
  );
  
  this.completionStatus.immigrationInfo = !!(
    this.immigrationInfo.interestedPrograms.length > 0 &&
    this.immigrationInfo.preferredDestination &&
    this.immigrationInfo.immigrationStatus
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
