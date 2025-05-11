/**
 * Assessment result model
 */
const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scores: {
    overall: {
      type: Number,
      default: 0
    },
    categories: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  recommendations: [{
    pathwayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pathway'
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    score: {
      type: Number,
      default: 0
    },
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    eligibility: {
      type: String,
      enum: ['eligible', 'potentially_eligible', 'not_eligible'],
      default: 'potentially_eligible'
    },
    reasons: [{
      type: String
    }]
  }],
  pathways: [{
    pathwayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pathway'
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    score: {
      type: Number,
      default: 0
    },
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  summary: {
    type: String
  },
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  nextSteps: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Get top recommendations
 * @param {number} limit - Number of recommendations to return
 * @returns {Array} - Top recommendations
 */
assessmentResultSchema.methods.getTopRecommendations = function(limit = 3) {
  return this.recommendations
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, limit);
};

/**
 * Get eligible pathways
 * @returns {Array} - Eligible pathways
 */
assessmentResultSchema.methods.getEligiblePathways = function() {
  return this.recommendations.filter(rec => rec.eligibility === 'eligible');
};

/**
 * Get potentially eligible pathways
 * @returns {Array} - Potentially eligible pathways
 */
assessmentResultSchema.methods.getPotentiallyEligiblePathways = function() {
  return this.recommendations.filter(rec => rec.eligibility === 'potentially_eligible');
};

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

module.exports = AssessmentResult;
