/**
 * Mock profileSettingsRoutes for testing
 * Matches the actual backend routes structure
 */
const express = require('express');
const router = express.Router();
const profileSettingsController = require('../../../mocks/controllers/settings/profileSettingsController');
const authMiddleware = require('../../../mocks/middleware/authMiddleware');

router.get('/:userId', authMiddleware.verifyToken, profileSettingsController.getAllSettings);
router.post('/:userId/initialize', authMiddleware.verifyToken, profileSettingsController.initializeSettings);

router.get('/:userId/account', authMiddleware.verifyToken, profileSettingsController.getAccountSettings);
router.put('/:userId/account', authMiddleware.verifyToken, profileSettingsController.updateAccountSettings);

router.get('/:userId/notifications', authMiddleware.verifyToken, profileSettingsController.getNotificationSettings);
router.put('/:userId/notifications', authMiddleware.verifyToken, profileSettingsController.updateNotificationSettings);

router.get('/:userId/privacy', authMiddleware.verifyToken, profileSettingsController.getPrivacySettings);
router.put('/:userId/privacy', authMiddleware.verifyToken, profileSettingsController.updatePrivacySettings);

router.get('/:userId/security', authMiddleware.verifyToken, profileSettingsController.getSecuritySettings);
router.put('/:userId/security', authMiddleware.verifyToken, profileSettingsController.updateSecuritySettings);

router.post('/:userId/sessions', authMiddleware.verifyToken, profileSettingsController.addSession);
router.delete('/:userId/sessions/:sessionId', authMiddleware.verifyToken, profileSettingsController.removeSession);
router.delete('/:userId/sessions', authMiddleware.verifyToken, profileSettingsController.removeAllOtherSessions);

router.post('/:userId/password-change', authMiddleware.verifyToken, profileSettingsController.updatePasswordChangeTime);

module.exports = router;
