/**
 * Client Model
 * Defines the schema for client data
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  wechat: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'LEAD'],
    default: 'ACTIVE'
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  immigrationHistory: [{
    country: String,
    status: String,
    startDate: Date,
    endDate: Date,
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ClientSchema.virtual('assessments', {
  ref: 'Assessment',
  localField: '_id',
  foreignField: 'clientId'
});

ClientSchema.methods.getProfileSummary = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    country: this.country,
    status: this.status,
    consultantId: this.consultantId
  };
};

module.exports = mongoose.model('Client', ClientSchema);
