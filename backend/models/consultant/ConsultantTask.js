/**
 * 顾问任务模型
 * 用于管理顾问的任务列表
 */

const mongoose = require('mongoose');

const consultantTaskSchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  dueDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedType'
  },
  relatedType: {
    type: String,
    enum: ['Client', 'Case', 'Booking', 'PathwayApplication'],
  },
  tags: [{
    type: String,
    trim: true
  }],
  completedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'consultantTasks'
});

/**
 * 根据顾问ID获取任务
 * @param {String} consultantId - 顾问ID
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 任务列表
 */
consultantTaskSchema.statics.getTasksByConsultant = function(consultantId, filter = {}, limit = 20, skip = 0) {
  return this.find({ consultantId, ...filter })
    .sort({ dueDate: 1, priority: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email')
    .populate('relatedId')
    .exec();
};

/**
 * 获取顾问的待办任务
 * @param {String} consultantId - 顾问ID
 * @param {Number} limit - 限制数量
 * @returns {Promise<Array>} 待办任务列表
 */
consultantTaskSchema.statics.getPendingTasks = function(consultantId, limit = 10) {
  return this.getTasksByConsultant(
    consultantId, 
    { status: { $in: ['pending', 'in_progress'] } },
    limit,
    0
  );
};

/**
 * 获取顾问的逾期任务
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Array>} 逾期任务列表
 */
consultantTaskSchema.statics.getOverdueTasks = function(consultantId) {
  return this.getTasksByConsultant(
    consultantId,
    { 
      status: { $in: ['pending', 'in_progress'] },
      dueDate: { $lt: new Date() }
    }
  );
};

/**
 * 获取顾问的今日任务
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Array>} 今日任务列表
 */
consultantTaskSchema.statics.getTodayTasks = function(consultantId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.getTasksByConsultant(
    consultantId,
    { 
      dueDate: { 
        $gte: today,
        $lt: tomorrow
      }
    }
  );
};

/**
 * 更新任务状态
 * @param {String} taskId - 任务ID
 * @param {String} status - 新状态
 * @returns {Promise<Object>} 更新后的任务
 */
consultantTaskSchema.statics.updateTaskStatus = function(taskId, status) {
  const update = { status };
  
  if (status === 'completed') {
    update.completedAt = new Date();
  } else {
    update.$unset = { completedAt: 1 };
  }
  
  return this.findByIdAndUpdate(
    taskId,
    update,
    { new: true }
  );
};

/**
 * 创建新任务
 * @param {Object} taskData - 任务数据
 * @returns {Promise<Object>} 创建的任务
 */
consultantTaskSchema.statics.createTask = function(taskData) {
  return this.create(taskData);
};

/**
 * 获取任务统计
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 任务统计
 */
consultantTaskSchema.statics.getTaskStats = async function(consultantId) {
  const stats = await this.aggregate([
    { $match: { consultantId: mongoose.Types.ObjectId(consultantId) } },
    { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
    overdue: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  const overdueTasks = await this.countDocuments({
    consultantId,
    status: { $in: ['pending', 'in_progress'] },
    dueDate: { $lt: new Date() }
  });
  
  result.overdue = overdueTasks;
  
  return result;
};

const ConsultantTask = mongoose.model('ConsultantTask', consultantTaskSchema);

module.exports = ConsultantTask;
