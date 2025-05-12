/**
 * 设置历史记录模型
 * 跟踪系统设置的变更历史
 */

const mongoose = require('mongoose');

const settingsHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  changes: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'security', 'notifications', 'integrations', 'appearance', 'advanced'],
    required: true
  },
  action: {
    type: String,
    enum: ['update', 'reset'],
    default: 'update'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'settingsHistory'
});

/**
 * 记录设置变更
 * @param {Object} data - 变更数据
 * @param {String} data.userId - 用户ID
 * @param {String} data.userName - 用户名
 * @param {Object} data.changes - 变更内容
 * @param {String} data.category - 设置类别
 * @param {String} data.action - 操作类型
 * @param {String} data.ipAddress - IP地址
 * @param {String} data.userAgent - 用户代理
 * @returns {Promise<Object>} 创建的历史记录
 */
settingsHistorySchema.statics.logChange = function(data) {
  return this.create(data);
};

/**
 * 获取设置历史记录
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 历史记录列表
 */
settingsHistorySchema.statics.getHistory = function(filter = {}, limit = 20, skip = 0) {
  return this.find(filter)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email')
    .exec();
};

/**
 * 获取特定类别的设置历史记录
 * @param {String} category - 设置类别
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 历史记录列表
 */
settingsHistorySchema.statics.getCategoryHistory = function(category, limit = 20, skip = 0) {
  return this.getHistory({ category }, limit, skip);
};

/**
 * 获取特定用户的设置历史记录
 * @param {String} userId - 用户ID
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 历史记录列表
 */
settingsHistorySchema.statics.getUserHistory = function(userId, limit = 20, skip = 0) {
  return this.getHistory({ userId }, limit, skip);
};

/**
 * 获取特定时间范围的设置历史记录
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 历史记录列表
 */
settingsHistorySchema.statics.getHistoryByDateRange = function(startDate, endDate, limit = 20, skip = 0) {
  return this.getHistory({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }, limit, skip);
};

/**
 * 清除特定日期之前的历史记录
 * @param {Date} date - 日期
 * @returns {Promise<Object>} 删除结果
 */
settingsHistorySchema.statics.clearHistoryBefore = function(date) {
  return this.deleteMany({
    timestamp: { $lt: date }
  });
};

/**
 * 获取最近的设置变更
 * @param {Number} limit - 限制数量
 * @returns {Promise<Array>} 历史记录列表
 */
settingsHistorySchema.statics.getRecentChanges = function(limit = 5) {
  return this.getHistory({}, limit, 0);
};

const SettingsHistory = mongoose.model('SettingsHistory', settingsHistorySchema);

module.exports = SettingsHistory;
