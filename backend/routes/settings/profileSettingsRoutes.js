/**
 * 个人资料设置路由
 * 定义个人资料设置相关的API端点
 */

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const profileSettingsController = require('../../controllers/settings/profileSettingsController');

const router = express.Router();

router.get('/:userId', verifyToken, profileSettingsController.getAllSettings);
router.post('/:userId/initialize', verifyToken, profileSettingsController.initializeSettings);

router.get('/:userId/account', verifyToken, profileSettingsController.getAccountSettings);
router.put('/:userId/account', verifyToken, profileSettingsController.updateAccountSettings);

router.get('/:userId/notifications', verifyToken, profileSettingsController.getNotificationSettings);
router.put('/:userId/notifications', verifyToken, profileSettingsController.updateNotificationSettings);

router.get('/:userId/privacy', verifyToken, profileSettingsController.getPrivacySettings);
router.put('/:userId/privacy', verifyToken, profileSettingsController.updatePrivacySettings);

router.get('/:userId/security', verifyToken, profileSettingsController.getSecuritySettings);
router.put('/:userId/security', verifyToken, profileSettingsController.updateSecuritySettings);

router.post('/:userId/sessions', verifyToken, profileSettingsController.addSession);
router.delete('/:userId/sessions/:sessionId', verifyToken, profileSettingsController.removeSession);
router.delete('/:userId/sessions', verifyToken, profileSettingsController.removeAllOtherSessions);

router.post('/:userId/password-change', verifyToken, profileSettingsController.updatePasswordChangeTime);

module.exports = router;
