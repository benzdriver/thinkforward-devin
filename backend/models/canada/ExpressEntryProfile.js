/**
 * Express Entry资料模型
 * 用于存储和管理加拿大Express Entry申请人的详细信息
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expressEntryProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  profileId: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in_progress', 'completed', 'archived'],
    default: 'draft'
  },
  submissionDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  personalInfo: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    countryOfBirth: String,
    citizenship: [String],
    passportNumber: String,
    passportExpiryDate: Date,
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'common_law', 'separated', 'divorced', 'widowed']
    },
    hasSpouseOrPartner: Boolean,
    spouseWillAccompany: Boolean,
    numberOfDependents: {
      type: Number,
      default: 0
    }
  },
  
  contactInfo: {
    email: String,
    phone: String,
    currentAddress: {
      street: String,
      city: String,
      province: String,
      country: String,
      postalCode: String
    },
    mailingAddress: {
      sameAsCurrentAddress: {
        type: Boolean,
        default: true
      },
      street: String,
      city: String,
      province: String,
      country: String,
      postalCode: String
    }
  },
  
  languageAbility: {
    firstLanguage: {
      type: String,
      enum: ['english', 'french']
    },
    firstLanguageTest: {
      type: String,
      enum: ['ielts', 'celpip', 'tef', 'tcf']
    },
    firstLanguageResults: {
      reading: Number,
      writing: Number,
      listening: Number,
      speaking: Number,
      testDate: Date,
      certificateNumber: String
    },
    secondLanguage: {
      type: String,
      enum: ['english', 'french', 'none']
    },
    secondLanguageTest: {
      type: String,
      enum: ['ielts', 'celpip', 'tef', 'tcf', 'none']
    },
    secondLanguageResults: {
      reading: Number,
      writing: Number,
      listening: Number,
      speaking: Number,
      testDate: Date,
      certificateNumber: String
    }
  },
  
  education: [{
    level: {
      type: String,
      enum: [
        'secondary', 
        'one_year_degree', 
        'two_year_degree', 
        'bachelors', 
        'masters', 
        'doctoral', 
        'professional'
      ]
    },
    fieldOfStudy: String,
    institution: String,
    country: String,
    startDate: Date,
    endDate: Date,
    completed: Boolean,
    credentialAssessed: Boolean,
    ecaAuthority: String,
    ecaNumber: String,
    ecaDate: Date
  }],
  
  canadianWorkExperience: [{
    noc: String,
    jobTitle: String,
    employer: String,
    city: String,
    province: String,
    startDate: Date,
    endDate: Date,
    hoursPerWeek: Number,
    duties: [String],
    currentlyEmployed: Boolean
  }],
  
  foreignWorkExperience: [{
    noc: String,
    jobTitle: String,
    employer: String,
    city: String,
    country: String,
    startDate: Date,
    endDate: Date,
    hoursPerWeek: Number,
    duties: [String],
    currentlyEmployed: Boolean
  }],
  
  spouseInfo: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    countryOfBirth: String,
    citizenship: [String],
    passportNumber: String,
    passportExpiryDate: Date,
    
    languageAbility: {
      firstLanguage: {
        type: String,
        enum: ['english', 'french']
      },
      firstLanguageTest: {
        type: String,
        enum: ['ielts', 'celpip', 'tef', 'tcf']
      },
      firstLanguageResults: {
        reading: Number,
        writing: Number,
        listening: Number,
        speaking: Number,
        testDate: Date,
        certificateNumber: String
      }
    },
    
    education: {
      level: {
        type: String,
        enum: [
          'secondary', 
          'one_year_degree', 
          'two_year_degree', 
          'bachelors', 
          'masters', 
          'doctoral', 
          'professional'
        ]
      },
      fieldOfStudy: String,
      institution: String,
      country: String,
      startDate: Date,
      endDate: Date,
      completed: Boolean,
      credentialAssessed: Boolean,
      ecaAuthority: String,
      ecaNumber: String,
      ecaDate: Date
    },
    
    canadianWorkExperience: [{
      noc: String,
      jobTitle: String,
      employer: String,
      city: String,
      province: String,
      startDate: Date,
      endDate: Date,
      hoursPerWeek: Number,
      duties: [String],
      currentlyEmployed: Boolean
    }]
  },
  
  adaptabilityFactors: {
    relativesInCanada: {
      hasRelatives: Boolean,
      relationship: String,
      province: String,
      citizenOrPR: Boolean
    },
    spouseEducationInCanada: {
      hasEducation: Boolean,
      level: String,
      durationYears: Number,
      institution: String,
      province: String
    },
    previousStudyInCanada: {
      hasStudied: Boolean,
      level: String,
      durationYears: Number,
      institution: String,
      province: String,
      completionDate: Date
    },
    previousWorkInCanada: {
      hasWorked: Boolean,
      noc: String,
      durationYears: Number,
      employer: String,
      province: String
    },
    jobOffer: {
      hasJobOffer: Boolean,
      noc: String,
      employer: String,
      province: String,
      lmiaApproved: Boolean
    },
    provincialNomination: {
      hasNomination: Boolean,
      province: String,
      nominationDate: Date,
      nominationCertificateNumber: String
    }
  },
  
  crsScore: {
    total: Number,
    coreHumanCapital: Number,
    spouseFactors: Number,
    skillTransferability: Number,
    additionalPoints: Number,
    lastCalculated: Date,
    scoreBreakdown: {
      type: Map,
      of: Number
    }
  },
  
  applicationHistory: [{
    drawDate: Date,
    cutoffScore: Number,
    eligible: Boolean,
    invited: Boolean,
    invitationDate: Date,
    applicationSubmitted: Boolean,
    applicationDate: Date,
    applicationStatus: {
      type: String,
      enum: ['not_submitted', 'submitted', 'in_process', 'approved', 'rejected']
    },
    notes: String
  }],
  
  documents: [{
    type: {
      type: String,
      enum: [
        'passport', 
        'language_test', 
        'education_credential', 
        'work_reference', 
        'police_certificate', 
        'medical_exam', 
        'proof_of_funds', 
        'other'
      ]
    },
    name: String,
    description: String,
    fileUrl: String,
    uploadDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['required', 'uploaded', 'verified', 'rejected', 'expired']
    },
    notes: String
  }],
  
  notes: [{
    content: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: Boolean
  }]
}, {
  timestamps: true,
  collection: 'expressEntryProfiles'
});

expressEntryProfileSchema.index({ userId: 1, status: 1 });
expressEntryProfileSchema.index({ profileId: 1 });
expressEntryProfileSchema.index({ 'crsScore.total': -1 });
expressEntryProfileSchema.index({ 'applicationHistory.drawDate': -1 });

expressEntryProfileSchema.methods.calculateCRSScore = function() {
  return {
    total: 0, // 占位符，实际实现将返回真实计算结果
    coreHumanCapital: 0,
    spouseFactors: 0,
    skillTransferability: 0,
    additionalPoints: 0,
    lastCalculated: new Date(),
    scoreBreakdown: new Map()
  };
};

expressEntryProfileSchema.methods.checkEligibility = function() {
  return {
    eligible: false, // 占位符，实际实现将返回真实检查结果
    program: '', // 符合的项目：FSW, CEC, FST
    reasons: [],
    missingRequirements: []
  };
};

expressEntryProfileSchema.methods.addDrawHistory = function(drawDate, cutoffScore) {
  const eligible = this.crsScore && this.crsScore.total >= cutoffScore;
  
  this.applicationHistory.push({
    drawDate,
    cutoffScore,
    eligible,
    invited: false,
    applicationSubmitted: false,
    applicationStatus: 'not_submitted'
  });
  
  return this.save();
};

expressEntryProfileSchema.methods.updateApplicationStatus = function(drawDate, status, notes = '') {
  const drawRecord = this.applicationHistory.find(
    record => record.drawDate.getTime() === new Date(drawDate).getTime()
  );
  
  if (drawRecord) {
    drawRecord.applicationStatus = status;
    if (status === 'submitted') {
      drawRecord.applicationSubmitted = true;
      drawRecord.applicationDate = new Date();
    }
    if (notes) {
      drawRecord.notes = notes;
    }
    return this.save();
  }
  
  return Promise.resolve(this);
};

expressEntryProfileSchema.methods.updateDocument = function(documentData) {
  const { type, name, fileUrl } = documentData;
  
  const existingDocIndex = this.documents.findIndex(
    doc => doc.type === type && doc.name === name
  );
  
  if (existingDocIndex >= 0) {
    this.documents[existingDocIndex] = {
      ...this.documents[existingDocIndex].toObject(),
      ...documentData,
      uploadDate: new Date()
    };
  } else {
    this.documents.push({
      ...documentData,
      uploadDate: new Date(),
      status: 'uploaded'
    });
  }
  
  return this.save();
};

expressEntryProfileSchema.methods.addNote = function(content, userId, isPrivate = false) {
  this.notes.push({
    content,
    createdBy: userId,
    createdAt: new Date(),
    isPrivate
  });
  
  return this.save();
};

expressEntryProfileSchema.statics.findByUserId = function(userId) {
  return this.find({ userId })
    .sort({ updatedAt: -1 })
    .exec();
};

expressEntryProfileSchema.statics.findByProfileId = function(profileId) {
  return this.findOne({ profileId })
    .exec();
};

expressEntryProfileSchema.statics.findEligibleForDraw = function(cutoffScore) {
  return this.find({
    'crsScore.total': { $gte: cutoffScore },
    status: { $in: ['submitted', 'in_progress', 'completed'] }
  })
    .sort({ 'crsScore.total': -1 })
    .exec();
};

const ExpressEntryProfile = mongoose.model('ExpressEntryProfile', expressEntryProfileSchema);

module.exports = ExpressEntryProfile;
