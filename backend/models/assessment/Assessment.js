/**
 * Assessment model for user assessments
 */
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['comprehensive', 'express', 'targeted'],
    required: true
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'abandoned'],
    default: 'started'
  },
  currentStep: {
    type: Number,
    default: 1
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentQuestion',
      required: true
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  resultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentResult'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

/**
 * Calculate assessment progress
 */
assessmentSchema.methods.calculateProgress = function() {
  if (this.totalSteps === 0) {
    return 0;
  }
  
  const progress = (this.responses.length / this.totalSteps) * 100;
  this.progress = Math.min(Math.round(progress), 100);
  return this.progress;
};

/**
 * Check if assessment is complete
 * @returns {boolean} - Whether assessment is complete
 */
assessmentSchema.methods.isComplete = function() {
  return this.status === 'completed' && this.completedAt !== null;
};

/**
 * Add response to assessment
 * @param {Object} responseData - Response data
 * @returns {Object} - Added response
 */
assessmentSchema.methods.addResponse = function(responseData) {
  this.responses.push(responseData);
  this.currentStep = this.responses.length + 1;
  this.calculateProgress();
  
  if (this.progress === 100) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.status === 'started') {
    this.status = 'in_progress';
  }
  
  return this.responses[this.responses.length - 1];
};

/**
 * Get response for a specific question
 * @param {string} questionId - Question ID
 * @returns {Object|null} - Response or null if not found
 */
assessmentSchema.methods.getResponse = function(questionId) {
  return this.responses.find(response => 
    response.questionId.toString() === questionId.toString()
  ) || null;
};

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
