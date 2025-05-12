/**
 * 顾问案例模型
 * 用于管理顾问处理的移民案例
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['express-entry', 'family-sponsorship', 'study-permit', 'work-permit', 'visitor-visa', 'citizenship', 'refugee', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'in-progress', 'pending', 'on-hold', 'completed', 'cancelled'],
    default: 'draft',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  dueDate: {
    type: Date,
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  collection: 'cases'
});

caseSchema.index({ consultantId: 1, status: 1 });
caseSchema.index({ clientId: 1, status: 1 });
caseSchema.index({ dueDate: 1, status: 1, priority: 1 });
caseSchema.index({ createdAt: -1 });

caseSchema.statics.getConsultantCases = function(consultantId, options = {}) {
  const { status, priority, type, search, sort = { createdAt: -1 }, page = 1, limit = 20 } = options;
  
  const query = { consultantId };
  
  if (status) {
    query.status = status;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('clientId', 'firstName lastName displayName email avatar')
    .exec();
};

caseSchema.statics.getClientCases = function(clientId, options = {}) {
  const { status, sort = { createdAt: -1 }, page = 1, limit = 20 } = options;
  
  const query = { clientId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('consultantId', 'firstName lastName displayName email avatar')
    .exec();
};

caseSchema.statics.getCaseStats = async function(consultantId) {
  const stats = await this.aggregate([
    { $match: { consultantId: mongoose.Types.ObjectId(consultantId) } },
    { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    draft: 0,
    'in-progress': 0,
    pending: 0,
    'on-hold': 0,
    completed: 0,
    cancelled: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

caseSchema.statics.getUpcomingDeadlines = function(consultantId, limit = 5) {
  const now = new Date();
  
  return this.find({
    consultantId,
    dueDate: { $gt: now },
    status: { $nin: ['completed', 'cancelled'] }
  })
  .sort({ dueDate: 1 })
  .limit(limit)
  .populate('clientId', 'firstName lastName displayName email avatar')
  .exec();
};

caseSchema.statics.updateCaseProgress = async function(caseId, progress) {
  const caseDoc = await this.findById(caseId);
  
  if (!caseDoc) {
    throw new Error('案例不存在');
  }
  
  caseDoc.progress = progress;
  
  if (progress === 100 && caseDoc.status !== 'completed') {
    caseDoc.status = 'completed';
    caseDoc.completedDate = new Date();
  } else if (progress < 100 && caseDoc.status === 'completed') {
    caseDoc.status = 'in-progress';
    caseDoc.completedDate = null;
  }
  
  return caseDoc.save();
};

caseSchema.methods.updateStatus = function(status) {
  this.status = status;
  
  if (status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
    this.progress = 100;
  } else if (status === 'in-progress' && this.status !== 'in-progress') {
    if (!this.startDate) {
      this.startDate = new Date();
    }
  }
  
  return this.save();
};

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
