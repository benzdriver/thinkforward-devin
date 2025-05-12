/**
 * 顾问客户模型
 * 用于存储和管理顾问的客户信息
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'archived'],
    default: 'active',
    index: true
  },
  assignedConsultantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  lastContactDate: {
    type: Date
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'advertisement', 'direct', 'other'],
    default: 'website'
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  notes: {
    type: String
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  collection: 'clients'
});

clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

clientSchema.pre('save', function(next) {
  if (!this.displayName) {
    this.displayName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

clientSchema.statics.getClientsByConsultant = function(consultantId, options = {}) {
  const { status, search, sort = { lastContactDate: -1 }, skip = 0, limit = 20 } = options;
  
  const query = { assignedConsultantId: consultantId };
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { displayName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ];
  }
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();
};

clientSchema.statics.getClientStats = async function(consultantId) {
  const stats = await this.aggregate([
    { $match: { assignedConsultantId: mongoose.Types.ObjectId(consultantId) } },
    { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    active: 0,
    inactive: 0,
    pending: 0,
    archived: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentlyAdded = await this.countDocuments({
    assignedConsultantId: consultantId,
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  result.recentlyAdded = recentlyAdded;
  
  const recentlyContacted = await this.countDocuments({
    assignedConsultantId: consultantId,
    lastContactDate: { $gte: thirtyDaysAgo }
  });
  
  result.recentlyContacted = recentlyContacted;
  
  return result;
};

clientSchema.statics.searchClients = function(consultantId, searchTerm, limit = 10) {
  const searchRegex = new RegExp(searchTerm, 'i');
  
  return this.find({
    assignedConsultantId: consultantId,
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { displayName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ]
  })
  .limit(limit)
  .exec();
};

clientSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

clientSchema.methods.updateLastContactDate = function(date = new Date()) {
  this.lastContactDate = date;
  return this.save();
};

clientSchema.methods.assignConsultant = function(consultantId) {
  this.assignedConsultantId = consultantId;
  return this.save();
};

clientSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text' });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
