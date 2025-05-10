const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const WorkExperienceSchema = new Schema({
  occupation: {
    noc: String,
    title: String
  },
  employer: String,
  country: String,
  isCanadianExperience: {
    type: Boolean,
    default: false
  },
  startDate: Date,
  endDate: Date,
  hoursPerWeek: Number,
  duties: [String]
});

const SpouseProfileSchema = new Schema({
  languageProficiency: [LanguageProficiencySchema],
  education: EducationSchema,
  canadianWorkExperience: [WorkExperienceSchema]
});

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
  spouseProfile: SpouseProfileSchema,
  languageProficiency: [LanguageProficiencySchema],
  education: [EducationSchema],
  workExperience: [WorkExperienceSchema],
  adaptabilityFactors: {
    relativesInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      relationship: String
    },
    spouseEducationInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      details: String
    },
    previousWorkInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      duration: Number
    },
    previousStudyInCanada: {
      has: {
        type: Boolean,
        default: false
      },
      program: String,
      institution: String
    }
  },
  hasProvincialNomination: {
    type: Boolean,
    default: false
  },
  provincialNominationDetails: {
    province: String,
    program: String,
    nominationDate: Date,
    certificateNumber: String
  },
  hasJobOffer: {
    type: Boolean,
    default: false
  },
  jobOfferDetails: {
    employer: String,
    position: String,
    noc: String,
    lmiaExempt: Boolean,
    lmiaNumber: String
  },
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

ExpressEntryProfileSchema.pre('save', function(next) {
  if (this.languageProficiency) {
    this.languageProficiency.forEach(lang => {
      if (!lang.clbEquivalent) {
        lang.clbEquivalent = {};
      }
      
      if (lang.test === 'IELTS') {
        lang.clbEquivalent.speaking = calculateCLBForIELTS('speaking', lang.speaking);
        lang.clbEquivalent.listening = calculateCLBForIELTS('listening', lang.listening);
        lang.clbEquivalent.reading = calculateCLBForIELTS('reading', lang.reading);
        lang.clbEquivalent.writing = calculateCLBForIELTS('writing', lang.writing);
      } else if (lang.test === 'CELPIP') {
        lang.clbEquivalent.speaking = lang.speaking;
        lang.clbEquivalent.listening = lang.listening;
        lang.clbEquivalent.reading = lang.reading;
        lang.clbEquivalent.writing = lang.writing;
      }
    });
  }
  next();
});

function calculateCLBForIELTS(skill, score) {
  if (skill === 'speaking' || skill === 'writing') {
    if (score >= 7.5) return 10;
    if (score >= 7.0) return 9;
    if (score >= 6.5) return 8;
    if (score >= 6.0) return 7;
    if (score >= 5.5) return 6;
    if (score >= 5.0) return 5;
    if (score >= 4.0) return 4;
    return 0;
  } else if (skill === 'reading' || skill === 'listening') {
    if (score >= 8.0) return 10;
    if (score >= 7.5) return 9;
    if (score >= 6.5) return 8;
    if (score >= 6.0) return 7;
    if (score >= 5.0) return 6;
    if (score >= 4.0) return 5;
    if (score >= 3.5) return 4;
    return 0;
  }
  return 0;
}

module.exports = mongoose.model('ExpressEntryProfile', ExpressEntryProfileSchema);
