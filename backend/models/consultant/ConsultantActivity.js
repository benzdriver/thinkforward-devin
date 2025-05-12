/**
 * 顾问活动模型
 * 记录顾问的活动历史
 */

const mongoose = require('mongoose');

const consultantActivitySchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'login', 'logout', 'profile_update', 'availability_update',
      'booking_created', 'booking_confirmed', 'booking_cancelled', 'booking_completed',
      'client_added', 'client_updated', 'client_note_added',
      'case_created', 'case_updated', 'case_completed', 'case_document_added',
      'task_created', 'task_updated', 'task_completed',
      'message_sent', 'message_received', 'system_notification'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedType'
  },
  relatedType: {
    type: String,
    enum: ['User', 'Client', 'Case', 'Booking', 'ConsultantTask', 'PathwayApplication', 'Message'],
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'consultantActivities'
});

/**
 * 记录顾问活动
 * @param {Object} activityData - 活动数据
 * @returns {Promise<Object>} 创建的活动记录
 */
consultantActivitySchema.statics.logActivity = function(activityData) {
  return this.create(activityData);
};

/**
 * 获取顾问活动
 * @param {String} consultantId - 顾问ID
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 活动列表
 */
consultantActivitySchema.statics.getActivities = function(consultantId, filter = {}, limit = 20, skip = 0) {
  return this.find({ consultantId, ...filter })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('relatedId')
    .exec();
};

/**
 * 获取未读活动数量
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Number>} 未读活动数量
 */
consultantActivitySchema.statics.getUnreadCount = function(consultantId) {
  return this.countDocuments({
    consultantId,
    isRead: false
  });
};

/**
 * 标记活动为已读
 * @param {String} activityId - 活动ID
 * @returns {Promise<Object>} 更新后的活动
 */
consultantActivitySchema.statics.markAsRead = function(activityId) {
  return this.findByIdAndUpdate(
    activityId,
    { isRead: true },
    { new: true }
  );
};

/**
 * 标记所有活动为已读
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 更新结果
 */
consultantActivitySchema.statics.markAllAsRead = function(consultantId) {
  return this.updateMany(
    { consultantId, isRead: false },
    { isRead: true }
  );
};

/**
 * 获取最近活动
 * @param {String} consultantId - 顾问ID
 * @param {Number} limit - 限制数量
 * @returns {Promise<Array>} 最近活动列表
 */
consultantActivitySchema.statics.getRecentActivities = function(consultantId, limit = 5) {
  return this.getActivities(consultantId, {}, limit, 0);
};

/**
 * 获取特定类型的活动
 * @param {String} consultantId - 顾问ID
 * @param {String} type - 活动类型
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 活动列表
 */
consultantActivitySchema.statics.getActivitiesByType = function(consultantId, type, limit = 20, skip = 0) {
  return this.getActivities(consultantId, { type }, limit, skip);
};

/**
 * 获取与特定实体相关的活动
 * @param {String} consultantId - 顾问ID
 * @param {String} relatedId - 相关实体ID
 * @param {String} relatedType - 相关实体类型
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 活动列表
 */
consultantActivitySchema.statics.getActivitiesByRelatedEntity = function(consultantId, relatedId, relatedType, limit = 20, skip = 0) {
  return this.getActivities(consultantId, { relatedId, relatedType }, limit, skip);
};

const ConsultantActivity = mongoose.model('ConsultantActivity', consultantActivitySchema);

module.exports = ConsultantActivity;
