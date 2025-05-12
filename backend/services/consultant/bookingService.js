/**
 * 预约服务
 * 提供顾问预约的业务逻辑
 */

const Booking = require('../../models/consultant/Booking');
const Consultant = require('../../models/consultant/Consultant');
const ConsultantAvailability = require('../../models/consultant/ConsultantAvailability');
const User = require('../../models/User');
const { translateMessage } = require('../../utils/localization');

/**
 * 获取用户预约列表
 * @param {String} userId - 用户ID
 * @param {String} status - 预约状态
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 预约列表
 */
async function getUserBookings(userId, status, locale = 'en') {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error(translateMessage('errors.userNotFound', locale));
    }
    
    let bookings;
    
    if (status === 'upcoming') {
      bookings = await Booking.findUpcoming(userId);
    } else if (status === 'history') {
      bookings = await Booking.findHistory(userId);
    } else {
      bookings = await Booking.findByUser(userId);
    }
    
    await Booking.populate(bookings, {
      path: 'consultantId',
      select: 'name avatar title company rating'
    });
    
    return bookings;
  } catch (error) {
    console.error('获取用户预约失败:', error);
    throw new Error(translateMessage('errors.bookingList', locale));
  }
}

/**
 * 获取预约详情
 * @param {String} bookingId - 预约ID
 * @param {String} userId - 用户ID
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 预约详情
 */
async function getBookingById(bookingId, userId, locale = 'en') {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error(translateMessage('errors.bookingNotFound', locale));
    }
    
    if (booking.userId.toString() !== userId && booking.consultantId.toString() !== userId) {
      throw new Error(translateMessage('errors.unauthorized', locale));
    }
    
    await Booking.populate(booking, {
      path: 'consultantId',
      select: 'name avatar title company rating email phone'
    });
    
    await Booking.populate(booking, {
      path: 'userId',
      select: 'name email'
    });
    
    return booking;
  } catch (error) {
    console.error('获取预约详情失败:', error);
    throw new Error(translateMessage('errors.bookingDetails', locale));
  }
}

/**
 * 创建预约
 * @param {Object} bookingData - 预约数据
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 创建的预约
 */
async function createBooking(bookingData, locale = 'en') {
  try {
    const { userId, consultantId, date, startTime, endTime, type, topic, questions } = bookingData;
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error(translateMessage('errors.userNotFound', locale));
    }
    
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    const isAvailable = await ConsultantAvailability.isSlotAvailable(
      consultantId,
      date,
      startTime,
      endTime
    );
    
    if (!isAvailable) {
      throw new Error(translateMessage('errors.slotUnavailable', locale));
    }
    
    const hourlyRate = consultant.price.hourly;
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);
    
    const durationHours = (endHour - startHour) + (endMinute - startMinute) / 60;
    const paymentAmount = Math.round(hourlyRate * durationHours * 100) / 100;
    
    const booking = new Booking({
      userId,
      consultantId,
      date,
      startTime,
      endTime,
      type: type || 'video',
      topic,
      questions,
      paymentAmount,
      paymentCurrency: consultant.price.currency
    });
    
    await booking.save();
    
    const availability = await ConsultantAvailability.findOne({
      consultantId,
      date: new Date(date)
    });
    
    if (availability) {
      const slot = availability.slots.find(s => 
        s.start <= startTime && s.end >= endTime && !s.isBooked
      );
      
      if (slot) {
        await availability.bookSlot(slot._id, booking._id);
      }
    }
    
    return booking;
  } catch (error) {
    console.error('创建预约失败:', error);
    throw new Error(translateMessage('errors.bookingCreate', locale));
  }
}

/**
 * 更新预约
 * @param {String} bookingId - 预约ID
 * @param {Object} updates - 更新内容
 * @param {String} userId - 用户ID
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 更新后的预约
 */
async function updateBooking(bookingId, updates, userId, locale = 'en') {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error(translateMessage('errors.bookingNotFound', locale));
    }
    
    if (booking.userId.toString() !== userId) {
      throw new Error(translateMessage('errors.unauthorized', locale));
    }
    
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new Error(translateMessage('errors.bookingClosed', locale));
    }
    
    if (updates.date || updates.startTime || updates.endTime) {
      const date = updates.date || booking.date;
      const startTime = updates.startTime || booking.startTime;
      const endTime = updates.endTime || booking.endTime;
      
      const isAvailable = await ConsultantAvailability.isSlotAvailable(
        booking.consultantId,
        date,
        startTime,
        endTime
      );
      
      if (!isAvailable) {
        throw new Error(translateMessage('errors.slotUnavailable', locale));
      }
      
      const oldAvailability = await ConsultantAvailability.findOne({
        consultantId: booking.consultantId,
        date: new Date(booking.date)
      });
      
      if (oldAvailability) {
        const oldSlot = oldAvailability.slots.find(s => s.bookingId && s.bookingId.toString() === bookingId);
        
        if (oldSlot) {
          await oldAvailability.unbookSlot(oldSlot._id);
        }
      }
      
      const newAvailability = await ConsultantAvailability.findOne({
        consultantId: booking.consultantId,
        date: new Date(date)
      });
      
      if (newAvailability) {
        const newSlot = newAvailability.slots.find(s => 
          s.start <= startTime && s.end >= endTime && !s.isBooked
        );
        
        if (newSlot) {
          await newAvailability.bookSlot(newSlot._id, booking._id);
        }
      }
    }
    
    Object.keys(updates).forEach(key => {
      booking[key] = updates[key];
    });
    
    await booking.save();
    
    return booking;
  } catch (error) {
    console.error('更新预约失败:', error);
    throw new Error(translateMessage('errors.bookingUpdate', locale));
  }
}

/**
 * 取消预约
 * @param {String} bookingId - 预约ID
 * @param {String} userId - 用户ID
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 取消后的预约
 */
async function cancelBooking(bookingId, userId, locale = 'en') {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error(translateMessage('errors.bookingNotFound', locale));
    }
    
    if (booking.userId.toString() !== userId && booking.consultantId.toString() !== userId) {
      throw new Error(translateMessage('errors.unauthorized', locale));
    }
    
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new Error(translateMessage('errors.bookingClosed', locale));
    }
    
    const availability = await ConsultantAvailability.findOne({
      consultantId: booking.consultantId,
      date: new Date(booking.date)
    });
    
    if (availability) {
      const slot = availability.slots.find(s => s.bookingId && s.bookingId.toString() === bookingId);
      
      if (slot) {
        await availability.unbookSlot(slot._id);
      }
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    return booking;
  } catch (error) {
    console.error('取消预约失败:', error);
    throw new Error(translateMessage('errors.bookingCancel', locale));
  }
}

/**
 * 检查时间段可用性
 * @param {String} consultantId - 顾问ID
 * @param {String} date - 日期
 * @param {String} startTime - 开始时间
 * @param {String} endTime - 结束时间
 * @param {String} locale - 语言
 * @returns {Promise<Boolean>} 是否可用
 */
async function checkAvailability(consultantId, date, startTime, endTime, locale = 'en') {
  try {
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    const isAvailable = await ConsultantAvailability.isSlotAvailable(
      consultantId,
      date,
      startTime,
      endTime
    );
    
    return isAvailable;
  } catch (error) {
    console.error('检查时间段可用性失败:', error);
    throw new Error(translateMessage('errors.availabilityCheck', locale));
  }
}

/**
 * 添加会议链接
 * @param {String} bookingId - 预约ID
 * @param {String} meetingLink - 会议链接
 * @param {String} consultantId - 顾问ID
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 更新后的预约
 */
async function addMeetingLink(bookingId, meetingLink, consultantId, locale = 'en') {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error(translateMessage('errors.bookingNotFound', locale));
    }
    
    if (booking.consultantId.toString() !== consultantId) {
      throw new Error(translateMessage('errors.unauthorized', locale));
    }
    
    if (booking.status === 'cancelled') {
      throw new Error(translateMessage('errors.bookingCancelled', locale));
    }
    
    booking.meetingLink = meetingLink;
    booking.status = 'confirmed';
    await booking.save();
    
    return booking;
  } catch (error) {
    console.error('添加会议链接失败:', error);
    throw new Error(translateMessage('errors.meetingLinkAdd', locale));
  }
}

/**
 * 添加预约反馈
 * @param {String} bookingId - 预约ID
 * @param {Object} feedbackData - 反馈数据
 * @param {String} userId - 用户ID
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 更新后的预约
 */
async function addBookingFeedback(bookingId, feedbackData, userId, locale = 'en') {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error(translateMessage('errors.bookingNotFound', locale));
    }
    
    if (booking.userId.toString() !== userId) {
      throw new Error(translateMessage('errors.unauthorized', locale));
    }
    
    if (booking.status !== 'completed') {
      throw new Error(translateMessage('errors.bookingNotCompleted', locale));
    }
    
    booking.feedback = {
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      submittedAt: new Date()
    };
    
    await booking.save();
    
    const consultant = await Consultant.findById(booking.consultantId);
    
    if (consultant) {
      await consultant.addReview({
        userId: booking.userId,
        userName: feedbackData.userName,
        rating: feedbackData.rating,
        comment: feedbackData.comment
      });
    }
    
    return booking;
  } catch (error) {
    console.error('添加预约反馈失败:', error);
    throw new Error(translateMessage('errors.feedbackAdd', locale));
  }
}

module.exports = {
  getUserBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  checkAvailability,
  addMeetingLink,
  addBookingFeedback
};
