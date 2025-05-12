/**
 * 客户活动模型
 * 用于记录与客户相关的所有活动历史
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientActivitySchema = new Schema({
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
    enum: [
      'profile_update',      // 资料更新
      'note_added',          // 添加笔记
      'document_uploaded',   // 上传文档
      'document_shared',     // 分享文档
      'email_sent',          // 发送邮件
      'email_received',      // 接收邮件
      'call_made',           // 拨打电话
      'call_received',       // 接收电话
      'meeting_scheduled',   // 安排会议
      'meeting_completed',   // 完成会议
      'meeting_cancelled',   // 取消会议
      'task_created',        // 创建任务
      'task_completed',      // 完成任务
      'application_updated', // 更新申请
      'payment_received',    // 收到付款
      'status_changed',      // 状态变更
      'tag_added',           // 添加标签
      'tag_removed',         // 移除标签
      'message_sent',        // 发送消息
      'message_received',    // 接收消息
      'other'                // 其他
    ],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedType'
  },
  relatedType: {
    type: String,
    enum: [
      'ClientNote',
      'CaseDocument',
      'Case',
      'CaseTask',
      'Booking',
      'PathwayApplication',
      'Payment',
      'Message'
    ]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'clientActivities'
});

clientActivitySchema.statics.logActivity = function(activityData) {
  return this.create(activityData);
};

clientActivitySchema.statics.getClientActivities = function(clientId, options = {}) {
  const { consultantId, type, isRead, sort = { createdAt: -1 }, skip = 0, limit = 20 } = options;
  
  const query = { clientId };
  
  if (consultantId) {
    query.consultantId = consultantId;
  }
  
  if (type && type !== 'all') {
    query.type = type;
  }
  
  if (isRead !== undefined) {
    query.isRead = isRead;
  }
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('consultantId', 'name email')
    .populate('relatedId')
    .exec();
};

clientActivitySchema.statics.getConsultantClientActivities = function(consultantId, options = {}) {
  const { clientId, type, isRead, sort = { createdAt: -1 }, skip = 0, limit = 20 } = options;
  
  const query = { consultantId };
  
  if (clientId) {
    query.clientId = clientId;
  }
  
  if (type && type !== 'all') {
    query.type = type;
  }
  
  if (isRead !== undefined) {
    query.isRead = isRead;
  }
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('clientId', 'firstName lastName displayName email')
    .populate('relatedId')
    .exec();
};

clientActivitySchema.statics.getUnreadCount = function(consultantId, clientId = null) {
  const query = { consultantId, isRead: false };
  
  if (clientId) {
    query.clientId = clientId;
  }
  
  return this.countDocuments(query);
};

clientActivitySchema.statics.markAsRead = function(activityId) {
  return this.findByIdAndUpdate(
    activityId,
    { isRead: true },
    { new: true }
  );
};

clientActivitySchema.statics.markAllAsRead = function(consultantId, clientId = null) {
  const query = { consultantId, isRead: false };
  
  if (clientId) {
    query.clientId = clientId;
  }
  
  return this.updateMany(
    query,
    { isRead: true }
  );
};

clientActivitySchema.statics.getActivityStats = async function(consultantId) {
  const stats = await this.aggregate([
    { $match: { consultantId: mongoose.Types.ObjectId(consultantId) } },
    { $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    unread: 0
  };
  
  const activityTypes = [
    'profile_update', 'note_added', 'document_uploaded', 'document_shared',
    'email_sent', 'email_received', 'call_made', 'call_received',
    'meeting_scheduled', 'meeting_completed', 'meeting_cancelled',
    'task_created', 'task_completed', 'application_updated',
    'payment_received', 'status_changed', 'tag_added', 'tag_removed',
    'message_sent', 'message_received', 'other'
  ];
  
  activityTypes.forEach(type => {
    result[type] = 0;
  });
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  const unreadCount = await this.countDocuments({
    consultantId,
    isRead: false
  });
  
  result.unread = unreadCount;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentActivities = await this.countDocuments({
    consultantId,
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  result.recent = recentActivities;
  
  return result;
};

clientActivitySchema.statics.getRecentActivities = function(consultantId, limit = 10) {
  return this.find({ consultantId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('clientId', 'firstName lastName displayName email')
    .populate('relatedId')
    .exec();
};

clientActivitySchema.statics.getActivitiesByType = function(consultantId, type, options = {}) {
  const { sort = { createdAt: -1 }, skip = 0, limit = 20 } = options;
  
  return this.find({ consultantId, type })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('clientId', 'firstName lastName displayName email')
    .populate('relatedId')
    .exec();
};

clientActivitySchema.statics.getActivitiesByRelatedEntity = function(relatedId, relatedType, options = {}) {
  const { sort = { createdAt: -1 }, skip = 0, limit = 20 } = options;
  
  return this.find({ relatedId, relatedType })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('clientId', 'firstName lastName displayName email')
    .populate('consultantId', 'name email')
    .exec();
};

clientActivitySchema.index({ consultantId: 1, clientId: 1, createdAt: -1 });
clientActivitySchema.index({ consultantId: 1, type: 1, createdAt: -1 });
clientActivitySchema.index({ relatedId: 1, relatedType: 1 });

const ClientActivity = mongoose.model('ClientActivity', clientActivitySchema);

module.exports = ClientActivity;
