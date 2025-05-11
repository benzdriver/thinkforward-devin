/**
 * Assessment question model
 */
const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'single_choice', 'text', 'number', 'date', 'boolean', 'scale'],
    required: true
  },
  options: [{
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  category: {
    type: String,
    enum: ['personal', 'education', 'work', 'language', 'immigration', 'preferences'],
    required: true
  },
  assessmentType: {
    type: String,
    enum: ['comprehensive', 'express', 'targeted', 'all'],
    default: 'all'
  },
  order: {
    type: Number,
    required: true
  },
  required: {
    type: Boolean,
    default: true
  },
  dependsOn: {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentQuestion'
    },
    value: mongoose.Schema.Types.Mixed
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  translations: {
    type: Map,
    of: {
      questionText: String,
      options: [{
        value: String,
        label: String
      }]
    },
    default: {}
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

/**
 * Get translated question
 * @param {string} locale - Locale code
 * @returns {Object} - Translated question
 */
assessmentQuestionSchema.methods.getTranslation = function(locale = 'en') {
  if (!this.translations.has(locale)) {
    return {
      questionText: this.questionText,
      options: this.options
    };
  }
  
  const translation = this.translations.get(locale);
  
  return {
    questionText: translation.questionText || this.questionText,
    options: translation.options || this.options
  };
};

/**
 * Check if question applies to assessment type
 * @param {string} type - Assessment type
 * @returns {boolean} - Whether question applies to assessment type
 */
assessmentQuestionSchema.methods.appliesToType = function(type) {
  return this.assessmentType === 'all' || this.assessmentType === type;
};

/**
 * Validate response based on question type
 * @param {*} response - Response to validate
 * @returns {boolean} - Whether response is valid
 */
assessmentQuestionSchema.methods.validateResponse = function(response) {
  switch (this.type) {
    case 'multiple_choice':
      return Array.isArray(response) && 
        response.every(r => this.options.some(o => o.value === r));
    
    case 'single_choice':
      return this.options.some(o => o.value === response);
    
    case 'text':
      return typeof response === 'string';
    
    case 'number':
      return typeof response === 'number' || 
        (typeof response === 'string' && !isNaN(Number(response)));
    
    case 'date':
      return !isNaN(Date.parse(response));
    
    case 'boolean':
      return typeof response === 'boolean' || 
        response === 'true' || 
        response === 'false';
    
    case 'scale':
      const num = Number(response);
      return !isNaN(num) && 
        num >= this.metadata.min && 
        num <= this.metadata.max;
    
    default:
      return false;
  }
};

/**
 * Calculate score for a response
 * @param {*} response - Response to score
 * @returns {number} - Score for response
 */
assessmentQuestionSchema.methods.calculateScore = function(response) {
  switch (this.type) {
    case 'multiple_choice':
      if (!Array.isArray(response)) return 0;
      
      return response.reduce((total, value) => {
        const option = this.options.find(o => o.value === value);
        return total + (option ? option.score : 0);
      }, 0);
    
    case 'single_choice':
      const option = this.options.find(o => o.value === response);
      return option ? option.score : 0;
    
    case 'scale':
      const num = Number(response);
      if (isNaN(num)) return 0;
      
      const min = this.metadata.minScore || 0;
      const max = this.metadata.maxScore || 0;
      const scale = this.metadata.max - this.metadata.min;
      
      if (scale === 0) return min;
      
      const normalized = (num - this.metadata.min) / scale;
      return min + normalized * (max - min);
    
    default:
      return 0;
  }
};

const AssessmentQuestion = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);

module.exports = AssessmentQuestion;
