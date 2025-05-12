/**
 * 顾问仪表盘路由
 * 定义顾问仪表盘相关的API端点
 */

const express = require('express');
const { verifyToken, checkRole } = require('../../middleware/authMiddleware');
const consultantDashboardController = require('../../controllers/consultant/consultantDashboardController');

const router = express.Router();

router.use(verifyToken);

router.get('/:consultantId/dashboard', consultantDashboardController.getConsultantDashboard);

router.patch('/:consultantId/status', consultantDashboardController.updateConsultantStatus);

router.get('/:consultantId/appointments', consultantDashboardController.getConsultantAppointments);

router.get('/:consultantId/tasks', consultantDashboardController.getConsultantTasks);

router.patch('/tasks/:taskId/status', consultantDashboardController.updateTaskStatus);

router.get('/:consultantId/activities', consultantDashboardController.getConsultantActivities);

router.patch('/appointments/:appointmentId/confirm', consultantDashboardController.confirmAppointment);

router.patch('/appointments/:appointmentId/cancel', consultantDashboardController.cancelAppointment);

module.exports = router;
