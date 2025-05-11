/**
 * Mock Pathway model for testing
 */
const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['federal', 'provincial', 'territorial', 'business', 'family', 'refugee'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eligibilityCriteria: [{
    name: String,
    description: String,
    required: Boolean,
    points: Number
  }],
  processingTime: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years']
    }
  },
  applicationFee: {
    amount: Number,
    currency: String
  },
  officialLink: String,
  translations: {
    type: Map,
    of: {
      name: String,
      description: String,
      eligibilityCriteria: [{
        name: String,
        description: String
      }]
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

pathwaySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Pathway = mongoose.model('Pathway', pathwaySchema);

module.exports = Pathway;
