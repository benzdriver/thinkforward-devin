/**
 * PathwayApplication model for tracking user applications to immigration pathways
 */
const mongoose = require('mongoose');

const pathwayApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pathwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathway',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in_progress', 'approved', 'rejected', 'withdrawn', 'completed'],
    default: 'draft'
  },
  submittedAt: {
    type: Date
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'uploaded', 'verified', 'rejected'],
      default: 'pending'
    },
    uploadedAt: {
      type: Date
    },
    notes: {
      type: String
    }
  }],
  timeline: [{
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    notes: {
      type: String
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: {
      type: String
    },
    submittedAt: {
      type: Date
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

/**
 * Add status update to timeline
 * @param {string} status - New status
 * @param {string} notes - Optional notes
 * @returns {Object} - Updated application
 */
pathwayApplicationSchema.methods.updateStatus = function(status, notes = '') {
  if (!this.status !== status) {
    this.status = status;
    
    this.timeline.push({
      date: new Date(),
      status,
      notes
    });
    
    this.lastUpdatedAt = new Date();
  }
  
  return this;
};

/**
 * Submit application
 * @returns {Object} - Updated application
 */
pathwayApplicationSchema.methods.submit = function() {
  if (this.status === 'draft') {
    this.status = 'submitted';
    this.submittedAt = new Date();
    this.lastUpdatedAt = new Date();
    
    this.timeline.push({
      date: new Date(),
      status: 'submitted',
      notes: 'Application submitted'
    });
  }
  
  return this;
};

/**
 * Add document to application
 * @param {Object} document - Document to add
 * @returns {Object} - Updated application
 */
pathwayApplicationSchema.methods.addDocument = function(document) {
  this.documents.push({
    ...document,
    uploadedAt: new Date()
  });
  
  this.lastUpdatedAt = new Date();
  
  return this;
};

/**
 * Update document status
 * @param {string} documentId - Document ID
 * @param {string} status - New status
 * @param {string} notes - Optional notes
 * @returns {Object} - Updated application
 */
pathwayApplicationSchema.methods.updateDocumentStatus = function(documentId, status, notes = '') {
  const document = this.documents.id(documentId);
  
  if (document) {
    document.status = status;
    document.notes = notes;
    this.lastUpdatedAt = new Date();
  }
  
  return this;
};

/**
 * Add feedback to application
 * @param {number} rating - Rating (1-5)
 * @param {string} comments - Comments
 * @returns {Object} - Updated application
 */
pathwayApplicationSchema.methods.addFeedback = function(rating, comments = '') {
  this.feedback = {
    rating,
    comments,
    submittedAt: new Date()
  };
  
  this.lastUpdatedAt = new Date();
  
  return this;
};

pathwayApplicationSchema.index({ userId: 1, pathwayId: 1 });

const PathwayApplication = mongoose.model('PathwayApplication', pathwayApplicationSchema);

module.exports = PathwayApplication;
