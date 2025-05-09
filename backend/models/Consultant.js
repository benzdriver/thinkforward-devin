/**
 * Consultant Model
 * Defines the schema for consultant data
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  expertise: [{
    type: String,
    trim: true
  }],
  available: {
    type: Boolean,
    default: true
  },
  availabilitySchedule: {
    type: Map,
    of: [{
      startTime: Date,
      endTime: Date
    }]
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ConsultantSchema.virtual('clients', {
  ref: 'Client',
  localField: '_id',
  foreignField: 'consultantId'
});

ConsultantSchema.methods.checkAvailability = function(date) {
  const dayOfWeek = date.getDay();
  const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
  
  const daySchedule = this.availabilitySchedule.get(dayKey) || [];
  
  return daySchedule.some(slot => {
    return date >= slot.startTime && date <= slot.endTime;
  });
};

module.exports = mongoose.model('Consultant', ConsultantSchema);
