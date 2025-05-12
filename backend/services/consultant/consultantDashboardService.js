/**
 * 顾问仪表盘服务
 * 提供顾问仪表盘相关的业务逻辑
 */

const ConsultantTask = require('../../models/consultant/ConsultantTask');
const ConsultantActivity = require('../../models/consultant/ConsultantActivity');
const Booking = require('../../models/consultant/Booking');
const Consultant = require('../../models/consultant/Consultant');
const User = require('../../models/User');

/**
 * 获取顾问仪表盘数据
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 仪表盘数据
 */
const getConsultantDashboard = async (consultantId) => {
  try {
    const consultant = await Consultant.findOne({ userId: consultantId }).populate('userId', 'name email');
    
    if (!consultant) {
      throw new Error('顾问不存在');
    }
    
    const taskStats = await ConsultantTask.getTaskStats(consultantId);
    
    const pendingTasks = await ConsultantTask.getPendingTasks(consultantId, 5);
    
    const todayTasks = await ConsultantTask.getTodayTasks(consultantId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Booking.find({
      consultantId: consultant._id,
      date: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ['confirmed', 'in_progress'] }
    }).populate('userId', 'name email profileImage');
    
    const unreadActivitiesCount = await ConsultantActivity.getUnreadCount(consultantId);
    
    const recentActivities = await ConsultantActivity.getRecentActivities(consultantId);
    
    const clientStats = {
      total: 0,
      active: 0,
      new: 0
    };
    
    const caseStats = {
      total: 0,
      active: 0,
      completed: 0
    };
    
    return {
      consultant: {
        id: consultant._id,
        name: consultant.userId.name,
        email: consultant.userId.email,
        status: consultant.status || 'offline',
        avatar: consultant.profileImage,
        rating: consultant.rating,
        reviewCount: consultant.reviewCount || 0
      },
      taskStats,
      pendingTasks,
      todayTasks,
      todayAppointments,
      unreadActivitiesCount,
      recentActivities,
      clientStats,
      caseStats
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 更新顾问状态
 * @param {String} consultantId - 顾问ID
 * @param {String} status - 新状态
 * @returns {Promise<Object>} 更新后的顾问
 */
const updateConsultantStatus = async (consultantId, status) => {
  try {
    const consultant = await Consultant.findOne({ userId: consultantId });
    
    if (!consultant) {
      throw new Error('顾问不存在');
    }
    
    consultant.status = status;
    await consultant.save();
    
    await ConsultantActivity.logActivity({
      consultantId,
      type: 'profile_update',
      description: `顾问状态更新为 ${status}`,
      metadata: { status }
    });
    
    return consultant;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取顾问预约列表
 * @param {String} consultantId - 顾问ID
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 预约列表
 */
const getConsultantAppointments = async (consultantId, filter = {}, limit = 20, skip = 0) => {
  try {
    const consultant = await Consultant.findOne({ userId: consultantId });
    
    if (!consultant) {
      throw new Error('顾问不存在');
    }
    
    const appointments = await Booking.find({ 
      consultantId: consultant._id,
      ...filter
    })
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email profileImage')
      .exec();
    
    return appointments;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取顾问任务列表
 * @param {String} consultantId - 顾问ID
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 任务列表
 */
const getConsultantTasks = async (consultantId, filter = {}, limit = 20, skip = 0) => {
  try {
    return await ConsultantTask.getTasksByConsultant(consultantId, filter, limit, skip);
  } catch (error) {
    throw error;
  }
};

/**
 * 更新任务状态
 * @param {String} taskId - 任务ID
 * @param {String} status - 新状态
 * @param {String} consultantId - 顾问ID（用于验证权限）
 * @returns {Promise<Object>} 更新后的任务
 */
const updateTaskStatus = async (taskId, status, consultantId) => {
  try {
    const task = await ConsultantTask.findById(taskId);
    
    if (!task) {
      throw new Error('任务不存在');
    }
    
    if (task.consultantId.toString() !== consultantId) {
      throw new Error('无权更新此任务');
    }
    
    const updatedTask = await ConsultantTask.updateTaskStatus(taskId, status);
    
    await ConsultantActivity.logActivity({
      consultantId,
      type: 'task_updated',
      description: `任务"${task.title}"状态更新为 ${status}`,
      relatedId: task._id,
      relatedType: 'ConsultantTask',
      metadata: { status }
    });
    
    return updatedTask;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取顾问活动列表
 * @param {String} consultantId - 顾问ID
 * @param {Object} filter - 过滤条件
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 活动列表
 */
const getConsultantActivities = async (consultantId, filter = {}, limit = 20, skip = 0) => {
  try {
    return await ConsultantActivity.getActivities(consultantId, filter, limit, skip);
  } catch (error) {
    throw error;
  }
};

/**
 * 确认预约
 * @param {String} appointmentId - 预约ID
 * @param {String} consultantId - 顾问ID（用于验证权限）
 * @returns {Promise<Object>} 更新后的预约
 */
const confirmAppointment = async (appointmentId, consultantId) => {
  try {
    const consultant = await Consultant.findOne({ userId: consultantId });
    
    if (!consultant) {
      throw new Error('顾问不存在');
    }
    
    const appointment = await Booking.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('预约不存在');
    }
    
    if (appointment.consultantId.toString() !== consultant._id.toString()) {
      throw new Error('无权确认此预约');
    }
    
    appointment.status = 'confirmed';
    await appointment.save();
    
    await ConsultantActivity.logActivity({
      consultantId,
      type: 'booking_confirmed',
      description: '预约已确认',
      relatedId: appointment._id,
      relatedType: 'Booking',
      metadata: { appointmentId }
    });
    
    await ConsultantTask.createTask({
      consultantId,
      title: `准备与 ${appointment.userName || '客户'} 的预约`,
      description: `预约时间: ${appointment.date.toLocaleDateString()} ${appointment.startTime}`,
      dueDate: appointment.date,
      priority: 'medium',
      status: 'pending',
      relatedId: appointment._id,
      relatedType: 'Booking',
      createdBy: consultantId
    });
    
    return appointment;
  } catch (error) {
    throw error;
  }
};

/**
 * 取消预约
 * @param {String} appointmentId - 预约ID
 * @param {String} consultantId - 顾问ID（用于验证权限）
 * @param {String} reason - 取消原因
 * @returns {Promise<Object>} 更新后的预约
 */
const cancelAppointment = async (appointmentId, consultantId, reason) => {
  try {
    const consultant = await Consultant.findOne({ userId: consultantId });
    
    if (!consultant) {
      throw new Error('顾问不存在');
    }
    
    const appointment = await Booking.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('预约不存在');
    }
    
    if (appointment.consultantId.toString() !== consultant._id.toString()) {
      throw new Error('无权取消此预约');
    }
    
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledBy = 'consultant';
    appointment.cancelledAt = new Date();
    await appointment.save();
    
    await ConsultantActivity.logActivity({
      consultantId,
      type: 'booking_cancelled',
      description: '预约已取消',
      relatedId: appointment._id,
      relatedType: 'Booking',
      metadata: { appointmentId, reason }
    });
    
    return appointment;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getConsultantDashboard,
  updateConsultantStatus,
  getConsultantAppointments,
  getConsultantTasks,
  updateTaskStatus,
  getConsultantActivities,
  confirmAppointment,
  cancelAppointment
};
