/**
 * 顾问可用性模型
 * 存储顾问的可用时间段
 */

const mongoose = require('mongoose');

const consultantAvailabilitySchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slots: [{
    start: String,
    end: String,
    isBooked: {
      type: Boolean,
      default: false
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
    }
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date
  }
}, {
  timestamps: true
});

consultantAvailabilitySchema.index({ consultantId: 1, date: 1 }, { unique: true });

/**
 * 查找可用时间段
 * @returns {Array} 可用时间段
 */
consultantAvailabilitySchema.methods.findAvailableSlots = function() {
  return this.slots.filter(slot => !slot.isBooked);
};

/**
 * 添加时间段
 * @param {String} start - 开始时间
 * @param {String} end - 结束时间
 * @returns {Promise<Object>} 更新后的可用性
 */
consultantAvailabilitySchema.methods.addSlot = function(start, end) {
  this.slots.push({ start, end, isBooked: false });
  return this.save();
};

/**
 * 移除时间段
 * @param {String} slotId - 时间段ID
 * @returns {Promise<Object>} 更新后的可用性
 */
consultantAvailabilitySchema.methods.removeSlot = function(slotId) {
  this.slots = this.slots.filter(slot => slot._id.toString() !== slotId);
  return this.save();
};

/**
 * 更新时间段
 * @param {String} slotId - 时间段ID
 * @param {Object} updates - 更新内容
 * @returns {Promise<Object>} 更新后的可用性
 */
consultantAvailabilitySchema.methods.updateSlot = function(slotId, updates) {
  const slotIndex = this.slots.findIndex(slot => slot._id.toString() === slotId);
  if (slotIndex !== -1) {
    this.slots[slotIndex] = { ...this.slots[slotIndex], ...updates };
  }
  return this.save();
};

/**
 * 预订时间段
 * @param {String} slotId - 时间段ID
 * @param {String} bookingId - 预订ID
 * @returns {Promise<Object>} 更新后的可用性
 */
consultantAvailabilitySchema.methods.bookSlot = function(slotId, bookingId) {
  const slotIndex = this.slots.findIndex(slot => slot._id.toString() === slotId);
  if (slotIndex !== -1) {
    this.slots[slotIndex].isBooked = true;
    this.slots[slotIndex].bookingId = bookingId;
  }
  return this.save();
};

/**
 * 取消预订时间段
 * @param {String} slotId - 时间段ID
 * @returns {Promise<Object>} 更新后的可用性
 */
consultantAvailabilitySchema.methods.unbookSlot = function(slotId) {
  const slotIndex = this.slots.findIndex(slot => slot._id.toString() === slotId);
  if (slotIndex !== -1) {
    this.slots[slotIndex].isBooked = false;
    this.slots[slotIndex].bookingId = null;
  }
  return this.save();
};

/**
 * 按日期范围查找可用性
 * @param {String} consultantId - 顾问ID
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {Promise<Array>} 可用性列表
 */
consultantAvailabilitySchema.statics.findByDateRange = function(consultantId, startDate, endDate) {
  return this.find({
    consultantId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

/**
 * 检查时间段是否可用
 * @param {String} consultantId - 顾问ID
 * @param {Date} date - 日期
 * @param {String} startTime - 开始时间
 * @param {String} endTime - 结束时间
 * @returns {Promise<Boolean>} 是否可用
 */
consultantAvailabilitySchema.statics.isSlotAvailable = async function(consultantId, date, startTime, endTime) {
  const availability = await this.findOne({
    consultantId,
    date: new Date(date)
  });
  
  if (!availability) {
    return false;
  }
  
  const availableSlots = availability.slots.filter(slot => !slot.isBooked);
  
  return availableSlots.some(slot => {
    return slot.start <= startTime && slot.end >= endTime;
  });
};

const ConsultantAvailability = mongoose.model('ConsultantAvailability', consultantAvailabilitySchema);

module.exports = ConsultantAvailability;
