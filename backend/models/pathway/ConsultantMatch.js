/**
 * ConsultantMatch model for matching users with immigration consultants
 */
const mongoose = require('mongoose');

const consultantMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  pathwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathway'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  requestDetails: {
    message: {
      type: String
    },
    preferredLanguage: {
      type: String
    },
    preferredCommunicationMethod: {
      type: String,
      enum: ['email', 'phone', 'video', 'in_person'],
      default: 'email'
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    budget: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'CAD'
      }
    },
    availableTimes: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: {
        type: String
      },
      endTime: {
        type: String
      }
    }]
  },
  consultantResponse: {
    accepted: {
      type: Boolean
    },
    message: {
      type: String
    },
    responseTime: {
      type: Date
    },
    proposedTimes: [{
      date: {
        type: Date
      },
      startTime: {
        type: String
      },
      endTime: {
        type: String
      }
    }],
    estimatedFee: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'CAD'
      },
      description: {
        type: String
      }
    }
  },
  appointment: {
    date: {
      type: Date
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    location: {
      type: String,
      enum: ['online', 'consultant_office', 'user_location', 'other'],
      default: 'online'
    },
    address: {
      type: String
    },
    meetingLink: {
      type: String
    },
    notes: {
      type: String
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  communication: [{
    sender: {
      type: String,
      enum: ['user', 'consultant', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  feedback: {
    userFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String
      },
      submittedAt: {
        type: Date
      }
    },
    consultantFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String
      },
      submittedAt: {
        type: Date
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

/**
 * Update match status
 * @param {string} status - New status
 * @returns {Object} - Updated match
 */
consultantMatchSchema.methods.updateStatus = function(status) {
  this.status = status;
  this.updatedAt = new Date();
  
  return this;
};

/**
 * Add consultant response
 * @param {Object} response - Consultant response
 * @returns {Object} - Updated match
 */
consultantMatchSchema.methods.addConsultantResponse = function(response) {
  this.consultantResponse = {
    ...response,
    responseTime: new Date()
  };
  
  if (response.accepted) {
    this.status = 'accepted';
  } else {
    this.status = 'declined';
  }
  
  this.updatedAt = new Date();
  
  return this;
};

/**
 * Schedule appointment
 * @param {Object} appointment - Appointment details
 * @returns {Object} - Updated match
 */
consultantMatchSchema.methods.scheduleAppointment = function(appointment) {
  this.appointment = appointment;
  this.updatedAt = new Date();
  
  return this;
};

/**
 * Add communication message
 * @param {Object} message - Message details
 * @returns {Object} - Updated match
 */
consultantMatchSchema.methods.addMessage = function(message) {
  this.communication.push({
    ...message,
    timestamp: new Date()
  });
  
  this.updatedAt = new Date();
  
  return this;
};

/**
 * Add user feedback
 * @param {Object} feedback - User feedback
 * @returns {Object} - Updated match
 */
consultantMatchSchema.methods.addUserFeedback = function(feedback) {
  this.feedback.userFeedback = {
    ...feedback,
    submittedAt: new Date()
  };
  
  this.updatedAt = new Date();
  
  return this;
};

/**
 * Add consultant feedback
 * @param {Object} feedback - Consultant feedback
 * @returns {Object} - Updated match
 */
consultantMatchSchema.methods.addConsultantFeedback = function(feedback) {
  this.feedback.consultantFeedback = {
    ...feedback,
    submittedAt: new Date()
  };
  
  this.updatedAt = new Date();
  
  return this;
};

/**
 * Find matches by user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - User's matches
 */
consultantMatchSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('consultantId')
    .populate('pathwayId')
    .sort({ createdAt: -1 });
};

/**
 * Find matches by consultant
 * @param {string} consultantId - Consultant ID
 * @returns {Promise<Array>} - Consultant's matches
 */
consultantMatchSchema.statics.findByConsultant = function(consultantId) {
  return this.find({ consultantId })
    .populate('userId')
    .populate('pathwayId')
    .sort({ createdAt: -1 });
};

/**
 * Find matches by pathway
 * @param {string} pathwayId - Pathway ID
 * @returns {Promise<Array>} - Pathway matches
 */
consultantMatchSchema.statics.findByPathway = function(pathwayId) {
  return this.find({ pathwayId })
    .populate('userId')
    .populate('consultantId')
    .sort({ createdAt: -1 });
};

consultantMatchSchema.index({ userId: 1, createdAt: -1 });
consultantMatchSchema.index({ consultantId: 1, createdAt: -1 });
consultantMatchSchema.index({ pathwayId: 1, createdAt: -1 });
consultantMatchSchema.index({ status: 1 });

const ConsultantMatch = mongoose.model('ConsultantMatch', consultantMatchSchema);

module.exports = ConsultantMatch;
