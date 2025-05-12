/**
 * 预约模型
 * 存储用户与顾问的预约信息
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'phone', 'in-person'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  topic: {
    type: String,
    required: true
  },
  questions: String,
  notes: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentCurrency: {
    type: String,
    default: 'CAD'
  },
  meetingLink: String,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

/**
 * 更新预约状态
 * @param {String} status - 状态
 * @returns {Promise<Object>} 更新后的预约
 */
bookingSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

/**
 * 取消预约
 * @returns {Promise<Object>} 更新后的预约
 */
bookingSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

/**
 * 重新安排预约
 * @param {String} date - 日期
 * @param {String} startTime - 开始时间
 * @param {String} endTime - 结束时间
 * @returns {Promise<Object>} 更新后的预约
 */
bookingSchema.methods.reschedule = function(date, startTime, endTime) {
  this.date = date;
  this.startTime = startTime;
  this.endTime = endTime;
  return this.save();
};

/**
 * 添加会议链接
 * @param {String} link - 会议链接
 * @returns {Promise<Object>} 更新后的预约
 */
bookingSchema.methods.addMeetingLink = function(link) {
  this.meetingLink = link;
  return this.save();
};

/**
 * 添加反馈
 * @param {Number} rating - 评分
 * @param {String} comment - 评论
 * @returns {Promise<Object>} 更新后的预约
 */
bookingSchema.methods.addFeedback = function(rating, comment) {
  this.feedback = {
    rating,
    comment,
    submittedAt: new Date()
  };
  return this.save();
};

/**
 * 按用户ID查找预约
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 预约列表
 */
bookingSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

/**
 * 按顾问ID查找预约
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Array>} 预约列表
 */
bookingSchema.statics.findByConsultant = function(consultantId) {
  return this.find({ consultantId }).sort({ createdAt: -1 });
};

/**
 * 查找即将到来的预约
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 预约列表
 */
bookingSchema.statics.findUpcoming = function(userId) {
  const today = new Date().toISOString().split('T')[0];
  return this.find({
    userId,
    date: { $gte: today },
    status: { $in: ['pending', 'confirmed'] }
  }).sort({ date: 1, startTime: 1 });
};

/**
 * 查找历史预约
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 预约列表
 */
bookingSchema.statics.findHistory = function(userId) {
  const today = new Date().toISOString().split('T')[0];
  return this.find({
    userId,
    $or: [
      { date: { $lt: today } },
      { status: { $in: ['cancelled', 'completed'] } }
    ]
  }).sort({ date: -1, startTime: -1 });
};

/**
 * 查找特定日期的预约
 * @param {String} consultantId - 顾问ID
 * @param {String} date - 日期
 * @returns {Promise<Array>} 预约列表
 */
bookingSchema.statics.findByDate = function(consultantId, date) {
  return this.find({
    consultantId,
    date,
    status: { $ne: 'cancelled' }
  }).sort({ startTime: 1 });
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
