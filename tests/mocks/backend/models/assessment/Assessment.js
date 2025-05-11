/**
 * Mock Assessment model for testing
 */
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['eligibility', 'points', 'comprehensive'],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  results: {
    score: Number,
    eligibility: {
      type: String,
      enum: ['eligible', 'ineligible', 'conditional']
    },
    details: [{
      category: String,
      points: Number,
      maxPoints: Number,
      breakdown: [{
        factor: String,
        points: Number,
        maxPoints: Number,
        description: String
      }]
    }],
    recommendations: [{
      type: String,
      description: String,
      impact: String
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
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
});

assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
