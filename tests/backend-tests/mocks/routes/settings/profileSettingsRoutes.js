/**
 * Mock profileSettingsRoutes for testing
 */
const express = require('express');
const router = express.Router();
const profileSettingsController = require('../../../mocks/controllers/settings/profileSettingsController');
const { verifyToken } = require('../../../mocks/middleware/authMiddleware');

router.get('/', verifyToken, profileSettingsController.getAllSettings);
router.get('/:userId', verifyToken, profileSettingsController.getAllSettings);

router.post('/initialize', verifyToken, profileSettingsController.initializeSettings);
router.post('/:userId/initialize', verifyToken, profileSettingsController.initializeSettings);

router.get('/account', verifyToken, profileSettingsController.getAccountSettings);
router.get('/:userId/account', verifyToken, profileSettingsController.getAccountSettings);
router.put('/account', verifyToken, profileSettingsController.updateAccountSettings);
router.put('/:userId/account', verifyToken, profileSettingsController.updateAccountSettings);

router.get('/notifications', verifyToken, profileSettingsController.getNotificationSettings);
router.get('/:userId/notifications', verifyToken, profileSettingsController.getNotificationSettings);
router.put('/notifications', verifyToken, profileSettingsController.updateNotificationSettings);
router.put('/:userId/notifications', verifyToken, profileSettingsController.updateNotificationSettings);

router.get('/privacy', verifyToken, profileSettingsController.getPrivacySettings);
router.get('/:userId/privacy', verifyToken, profileSettingsController.getPrivacySettings);
router.put('/privacy', verifyToken, profileSettingsController.updatePrivacySettings);
router.put('/:userId/privacy', verifyToken, profileSettingsController.updatePrivacySettings);

router.get('/security', verifyToken, profileSettingsController.getSecuritySettings);
router.get('/:userId/security', verifyToken, profileSettingsController.getSecuritySettings);
router.put('/security', verifyToken, profileSettingsController.updateSecuritySettings);
router.put('/:userId/security', verifyToken, profileSettingsController.updateSecuritySettings);

router.post('/sessions', verifyToken, profileSettingsController.addSession);
router.post('/:userId/sessions', verifyToken, profileSettingsController.addSession);
router.delete('/sessions/:sessionId', verifyToken, profileSettingsController.removeSession);
router.delete('/:userId/sessions/:sessionId', verifyToken, profileSettingsController.removeSession);
router.delete('/sessions', verifyToken, profileSettingsController.removeAllOtherSessions);
router.delete('/:userId/sessions', verifyToken, profileSettingsController.removeAllOtherSessions);

router.post('/password-change', verifyToken, profileSettingsController.updatePasswordChangeTime);
router.post('/:userId/password-change', verifyToken, profileSettingsController.updatePasswordChangeTime);

module.exports = router;
