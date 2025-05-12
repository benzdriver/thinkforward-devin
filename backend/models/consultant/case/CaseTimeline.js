/**
 * 案例时间线模型
 * 用于记录案例的重要事件和活动历史
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseTimelineSchema = new Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'status-change', 
      'document-upload', 
      'note-added', 
      'task-created', 
      'task-completed',
      'application-submitted',
      'decision-received',
      'client-communication',
      'government-communication',
      'milestone',
      'other'
    ],
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  isImportant: {
    type: Boolean,
    default: false,
    index: true
  },
  relatedEntityId: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedEntityType'
  },
  relatedEntityType: {
    type: String,
    enum: ['CaseTask', 'CaseNote', 'CaseDocument', 'User', null]
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'caseTimelines'
});

caseTimelineSchema.index({ caseId: 1, timestamp: -1 });
caseTimelineSchema.index({ caseId: 1, type: 1, timestamp: -1 });
caseTimelineSchema.index({ caseId: 1, isImportant: 1, timestamp: -1 });

caseTimelineSchema.statics.getCaseTimeline = function(caseId, options = {}) {
  const { type, isImportant, startDate, endDate, sort = { timestamp: -1 }, page = 1, limit = 50 } = options;
  
  const query = { caseId };
  
  if (type) {
    query.type = type;
  }
  
  if (isImportant !== undefined) {
    query.isImportant = isImportant;
  }
  
  if (startDate || endDate) {
    query.timestamp = {};
    
    if (startDate) {
      query.timestamp.$gte = new Date(startDate);
    }
    
    if (endDate) {
      query.timestamp.$lte = new Date(endDate);
    }
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'firstName lastName displayName email avatar')
    .populate('relatedEntityId')
    .exec();
};

caseTimelineSchema.statics.getImportantEvents = function(caseId) {
  return this.find({
    caseId,
    isImportant: true
  })
  .sort({ timestamp: -1 })
  .populate('userId', 'firstName lastName displayName email avatar')
  .populate('relatedEntityId')
  .exec();
};

caseTimelineSchema.statics.getTimelineByType = function(caseId, type) {
  return this.find({
    caseId,
    type
  })
  .sort({ timestamp: -1 })
  .populate('userId', 'firstName lastName displayName email avatar')
  .populate('relatedEntityId')
  .exec();
};

caseTimelineSchema.statics.getRecentTimeline = function(caseIds, limit = 10) {
  return this.find({
    caseId: { $in: caseIds }
  })
  .sort({ timestamp: -1 })
  .limit(limit)
  .populate('caseId', 'title clientId')
  .populate('caseId.clientId', 'firstName lastName displayName')
  .populate('userId', 'firstName lastName displayName email avatar')
  .exec();
};

caseTimelineSchema.statics.addStatusChangeEvent = function(caseId, userId, oldStatus, newStatus) {
  return this.create({
    caseId,
    type: 'status-change',
    description: `案例状态从 "${oldStatus}" 更改为 "${newStatus}"`,
    userId,
    metadata: {
      oldStatus,
      newStatus
    },
    isImportant: newStatus === 'completed' || newStatus === 'cancelled'
  });
};

caseTimelineSchema.statics.addDocumentEvent = function(caseId, userId, documentId, documentName, action = 'uploaded') {
  return this.create({
    caseId,
    type: 'document-upload',
    description: `文档 "${documentName}" 已${action === 'uploaded' ? '上传' : '更新'}`,
    userId,
    relatedEntityId: documentId,
    relatedEntityType: 'CaseDocument',
    metadata: {
      documentName,
      action
    }
  });
};

caseTimelineSchema.statics.addNoteEvent = function(caseId, userId, noteId, isPrivate) {
  return this.create({
    caseId,
    type: 'note-added',
    description: `添加了${isPrivate ? '私密' : ''}笔记`,
    userId,
    relatedEntityId: noteId,
    relatedEntityType: 'CaseNote'
  });
};

caseTimelineSchema.statics.addTaskEvent = function(caseId, userId, taskId, taskTitle, action = 'created') {
  let description;
  let type;
  
  if (action === 'created') {
    description = `创建了任务 "${taskTitle}"`;
    type = 'task-created';
  } else if (action === 'completed') {
    description = `完成了任务 "${taskTitle}"`;
    type = 'task-completed';
  } else {
    description = `${action}了任务 "${taskTitle}"`;
    type = 'task-created';
  }
  
  return this.create({
    caseId,
    type,
    description,
    userId,
    relatedEntityId: taskId,
    relatedEntityType: 'CaseTask',
    metadata: {
      taskTitle,
      action
    }
  });
};

caseTimelineSchema.statics.addMilestoneEvent = function(caseId, userId, description, metadata = {}) {
  return this.create({
    caseId,
    type: 'milestone',
    description,
    userId,
    metadata,
    isImportant: true
  });
};

caseTimelineSchema.statics.addApplicationEvent = function(caseId, userId, description, metadata = {}) {
  return this.create({
    caseId,
    type: 'application-submitted',
    description,
    userId,
    metadata,
    isImportant: true
  });
};

caseTimelineSchema.statics.addDecisionEvent = function(caseId, userId, decision, description, metadata = {}) {
  return this.create({
    caseId,
    type: 'decision-received',
    description,
    userId,
    metadata: {
      ...metadata,
      decision
    },
    isImportant: true
  });
};

caseTimelineSchema.methods.markAsImportant = function() {
  this.isImportant = true;
  return this.save();
};

caseTimelineSchema.methods.unmarkAsImportant = function() {
  this.isImportant = false;
  return this.save();
};

const CaseTimeline = mongoose.model('CaseTimeline', caseTimelineSchema);

module.exports = CaseTimeline;
