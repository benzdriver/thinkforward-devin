/**
 * 管理员设置路由
 * 定义系统设置相关的API端点
 */

const express = require('express');
const { verifyToken, isAdmin } = require('../../middleware/authMiddleware');
const adminSettingsController = require('../../controllers/admin/adminSettingsController');

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/settings', adminSettingsController.getSystemSettings);

router.patch('/settings', adminSettingsController.updateSystemSettings);

router.post('/settings/reset', adminSettingsController.resetSystemSettings);

router.get('/settings/history', adminSettingsController.getSettingsHistory);

router.get('/settings/export', adminSettingsController.exportSettings);

router.post('/settings/import', adminSettingsController.importSettings);

router.post('/settings/test-email', adminSettingsController.testEmailConfig);

router.post('/settings/clear-cache', adminSettingsController.clearSystemCache);

module.exports = router;
