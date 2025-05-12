/**
 * Pathway model for immigration pathways
 */
const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['federal', 'provincial', 'regional', 'business', 'family', 'humanitarian', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eligibilityCriteria: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['required', 'optional', 'bonus'],
      default: 'required'
    },
    points: {
      type: Number,
      default: 0
    }
  }],
  processingTime: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years'],
      default: 'months'
    }
  },
  applicationFee: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'CAD'
    }
  },
  requiredDocuments: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  steps: [{
    order: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    estimatedTime: {
      value: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    }
  }],
  officialLink: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  translations: {
    type: Map,
    of: {
      name: String,
      description: String,
      eligibilityCriteria: [{
        name: String,
        description: String
      }],
      requiredDocuments: [{
        name: String,
        description: String
      }],
      steps: [{
        title: String,
        description: String
      }]
    },
    default: {}
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

/**
 * Get translated pathway
 * @param {string} locale - Locale code
 * @returns {Object} - Translated pathway
 */
pathwaySchema.methods.getTranslation = function(locale = 'en') {
  if (!this.translations.has(locale)) {
    return {
      name: this.name,
      description: this.description,
      eligibilityCriteria: this.eligibilityCriteria,
      requiredDocuments: this.requiredDocuments,
      steps: this.steps
    };
  }
  
  const translation = this.translations.get(locale);
  
  return {
    name: translation.name || this.name,
    description: translation.description || this.description,
    eligibilityCriteria: translation.eligibilityCriteria || this.eligibilityCriteria,
    requiredDocuments: translation.requiredDocuments || this.requiredDocuments,
    steps: translation.steps || this.steps
  };
};

/**
 * Check if user meets eligibility criteria
 * @param {Object} userProfile - User profile
 * @returns {Object} - Eligibility result
 */
pathwaySchema.methods.checkEligibility = function(userProfile) {
  const requiredCriteria = this.eligibilityCriteria.filter(c => c.type === 'required');
  const optionalCriteria = this.eligibilityCriteria.filter(c => c.type === 'optional');
  const bonusCriteria = this.eligibilityCriteria.filter(c => c.type === 'bonus');
  
  
  const requiredResults = requiredCriteria.map(criteria => {
    return {
      name: criteria.name,
      met: Math.random() > 0.3, // Mock implementation
      points: 0
    };
  });
  
  const optionalResults = optionalCriteria.map(criteria => {
    const met = Math.random() > 0.5; // Mock implementation
    return {
      name: criteria.name,
      met,
      points: met ? criteria.points : 0
    };
  });
  
  const bonusResults = bonusCriteria.map(criteria => {
    const met = Math.random() > 0.7; // Mock implementation
    return {
      name: criteria.name,
      met,
      points: met ? criteria.points : 0
    };
  });
  
  const totalPoints = [...requiredResults, ...optionalResults, ...bonusResults]
    .reduce((sum, result) => sum + result.points, 0);
  
  const allRequiredMet = requiredResults.every(result => result.met);
  
  let eligibilityStatus;
  if (allRequiredMet) {
    eligibilityStatus = 'eligible';
  } else if (requiredResults.filter(r => r.met).length >= requiredResults.length * 0.7) {
    eligibilityStatus = 'potentially_eligible';
  } else {
    eligibilityStatus = 'not_eligible';
  }
  
  return {
    status: eligibilityStatus,
    points: totalPoints,
    maxPoints: this.eligibilityCriteria.reduce((sum, criteria) => sum + criteria.points, 0),
    results: {
      required: requiredResults,
      optional: optionalResults,
      bonus: bonusResults
    }
  };
};

const Pathway = mongoose.model('Pathway', pathwaySchema);

module.exports = Pathway;
