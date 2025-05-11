/**
 * 预约控制器
 * 处理预约相关的HTTP请求
 */

const bookingService = require('../../services/consultant/bookingService');
const { translateMessage } = require('../../utils/localization');

/**
 * 获取用户预约列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getUserBookings(req, res, next) {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const bookings = await bookingService.getUserBookings(userId, status, req.locale);
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取预约详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getBookingById(req, res, next) {
  try {
    const { bookingId } = req.params;
    
    const booking = await bookingService.getBookingById(bookingId, req.user.id, req.locale);
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 创建预约
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function createBooking(req, res, next) {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const bookingData = {
      ...req.body,
      userId
    };
    
    const booking = await bookingService.createBooking(bookingData, req.locale);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新预约
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function updateBooking(req, res, next) {
  try {
    const { userId, bookingId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const updates = req.body;
    
    const booking = await bookingService.updateBooking(bookingId, updates, userId, req.locale);
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取消预约
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function cancelBooking(req, res, next) {
  try {
    const { userId, bookingId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const booking = await bookingService.cancelBooking(bookingId, userId, req.locale);
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 检查时间段可用性
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function checkAvailability(req, res, next) {
  try {
    const { consultantId } = req.params;
    const { date, startTime, endTime } = req.query;
    
    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingTimeSlot', req.locale)
        }
      });
    }
    
    const isAvailable = await bookingService.checkAvailability(
      consultantId,
      date,
      startTime,
      endTime,
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: { isAvailable }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 添加会议链接
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function addMeetingLink(req, res, next) {
  try {
    const { consultantId, bookingId } = req.params;
    const { meetingLink } = req.body;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    if (!meetingLink) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingMeetingLink', req.locale)
        }
      });
    }
    
    const booking = await bookingService.addMeetingLink(
      bookingId,
      meetingLink,
      consultantId,
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 添加预约反馈
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function addBookingFeedback(req, res, next) {
  try {
    const { userId, bookingId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const { rating, comment } = req.body;
    
    if (!rating) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingRating', req.locale)
        }
      });
    }
    
    const feedbackData = {
      rating: parseInt(rating),
      comment,
      userName: req.user.name
    };
    
    const booking = await bookingService.addBookingFeedback(
      bookingId,
      feedbackData,
      userId,
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
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
