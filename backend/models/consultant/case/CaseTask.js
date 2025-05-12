/**
 * 案例任务模型
 * 用于管理案例相关的任务
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseTaskSchema = new Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assigneeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    index: true
  },
  completedAt: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'CaseTask'
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  checklist: [{
    item: String,
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  collection: 'caseTasks'
});

caseTaskSchema.index({ caseId: 1, status: 1 });
caseTaskSchema.index({ assigneeId: 1, status: 1 });
caseTaskSchema.index({ dueDate: 1, status: 1 });

caseTaskSchema.statics.getCaseTasks = function(caseId, options = {}) {
  const { status, assigneeId, sort = { dueDate: 1, priority: -1 } } = options;
  
  const query = { caseId };
  
  if (status) {
    query.status = status;
  }
  
  if (assigneeId) {
    query.assigneeId = assigneeId;
  }
  
  return this.find(query)
    .sort(sort)
    .populate('assigneeId', 'firstName lastName displayName email avatar')
    .exec();
};

caseTaskSchema.statics.getAssigneeTasks = function(assigneeId, options = {}) {
  const { status, sort = { dueDate: 1, priority: -1 }, page = 1, limit = 20 } = options;
  
  const query = { assigneeId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('caseId', 'title clientId consultantId')
    .populate('caseId.clientId', 'firstName lastName displayName')
    .exec();
};

caseTaskSchema.statics.getTaskStats = async function(caseId) {
  const stats = await this.aggregate([
    { $match: { caseId: mongoose.Types.ObjectId(caseId) } },
    { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
    cancelled: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

caseTaskSchema.statics.getOverdueTasks = function(assigneeId) {
  const now = new Date();
  
  return this.find({
    assigneeId,
    dueDate: { $lt: now },
    status: { $nin: ['completed', 'cancelled'] }
  })
  .sort({ dueDate: 1 })
  .populate('caseId', 'title clientId')
  .populate('caseId.clientId', 'firstName lastName displayName')
  .exec();
};

caseTaskSchema.statics.updateTaskStatus = async function(taskId, status, actualHours) {
  const task = await this.findById(taskId);
  
  if (!task) {
    throw new Error('任务不存在');
  }
  
  task.status = status;
  
  if (status === 'completed') {
    task.completedAt = new Date();
    if (actualHours !== undefined) {
      task.actualHours = actualHours;
    }
    
    const Case = mongoose.model('Case');
    const allTasks = await this.find({ caseId: task.caseId });
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const totalTasks = allTasks.length;
    
    if (totalTasks > 0) {
      const progress = Math.round((completedTasks / totalTasks) * 100);
      await Case.updateCaseProgress(task.caseId, progress);
    }
  } else if (status === 'in-progress' && !task.startedAt) {
    task.startedAt = new Date();
  }
  
  return task.save();
};

caseTaskSchema.methods.addChecklistItem = function(item) {
  this.checklist.push({ item, completed: false });
  return this.save();
};

caseTaskSchema.methods.updateChecklistItem = function(index, completed) {
  if (index >= 0 && index < this.checklist.length) {
    this.checklist[index].completed = completed;
    return this.save();
  }
  throw new Error('清单项不存在');
};

caseTaskSchema.methods.removeChecklistItem = function(index) {
  if (index >= 0 && index < this.checklist.length) {
    this.checklist.splice(index, 1);
    return this.save();
  }
  throw new Error('清单项不存在');
};

const CaseTask = mongoose.model('CaseTask', caseTaskSchema);

module.exports = CaseTask;
