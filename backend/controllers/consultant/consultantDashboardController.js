/**
 * 顾问仪表盘控制器
 * 处理顾问仪表盘相关的HTTP请求
 */

const consultantDashboardService = require('../../services/consultant/consultantDashboardService');

/**
 * 获取顾问仪表盘数据
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getConsultantDashboard = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此仪表盘'
      });
    }
    
    const dashboardData = await consultantDashboardService.getConsultantDashboard(consultantId);
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新顾问状态
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateConsultantStatus = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const { status } = req.body;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权更新此顾问状态'
      });
    }
    
    const validStatuses = ['online', 'offline', 'busy', 'away'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态值',
        details: {
          status: `状态必须是以下值之一: ${validStatuses.join(', ')}`
        }
      });
    }
    
    const consultant = await consultantDashboardService.updateConsultantStatus(consultantId, status);
    
    res.status(200).json({
      success: true,
      data: consultant,
      message: '顾问状态已更新'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取顾问预约列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getConsultantAppointments = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const { status, startDate, endDate, limit = 20, skip = 0 } = req.query;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此顾问的预约'
      });
    }
    
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    const appointments = await consultantDashboardService.getConsultantAppointments(
      consultantId,
      filter,
      parseInt(limit),
      parseInt(skip)
    );
    
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取顾问任务列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getConsultantTasks = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const { status, priority, dueDate, limit = 20, skip = 0 } = req.query;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此顾问的任务'
      });
    }
    
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (dueDate) {
      const date = new Date(dueDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.dueDate = {
        $gte: date,
        $lt: nextDay
      };
    }
    
    const tasks = await consultantDashboardService.getConsultantTasks(
      consultantId,
      filter,
      parseInt(limit),
      parseInt(skip)
    );
    
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新任务状态
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const consultantId = req.user.id;
    
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态值',
        details: {
          status: `状态必须是以下值之一: ${validStatuses.join(', ')}`
        }
      });
    }
    
    const updatedTask = await consultantDashboardService.updateTaskStatus(taskId, status, consultantId);
    
    res.status(200).json({
      success: true,
      data: updatedTask,
      message: '任务状态已更新'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取顾问活动列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getConsultantActivities = async (req, res, next) => {
  try {
    const consultantId = req.params.consultantId;
    const { type, isRead, limit = 20, skip = 0 } = req.query;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此顾问的活动'
      });
    }
    
    const filter = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    const activities = await consultantDashboardService.getConsultantActivities(
      consultantId,
      filter,
      parseInt(limit),
      parseInt(skip)
    );
    
    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 确认预约
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const confirmAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const consultantId = req.user.id;
    
    const appointment = await consultantDashboardService.confirmAppointment(appointmentId, consultantId);
    
    res.status(200).json({
      success: true,
      data: appointment,
      message: '预约已确认'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 取消预约
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    const consultantId = req.user.id;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: '取消原因是必需的',
        details: {
          reason: '请提供取消原因'
        }
      });
    }
    
    const appointment = await consultantDashboardService.cancelAppointment(appointmentId, consultantId, reason);
    
    res.status(200).json({
      success: true,
      data: appointment,
      message: '预约已取消'
    });
  } catch (error) {
    next(error);
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
