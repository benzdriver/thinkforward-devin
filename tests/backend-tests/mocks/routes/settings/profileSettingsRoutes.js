/**
 * Mock profileSettingsRoutes for testing
 */
const express = require('express');
const router = express.Router();
const profileSettingsController = require('../../../mocks/controllers/settings/profileSettingsController');

router.get('/', profileSettingsController.getAllSettings);
router.get('/:userId', profileSettingsController.getAllSettings);

router.post('/initialize', profileSettingsController.initializeSettings);
router.post('/:userId/initialize', profileSettingsController.initializeSettings);

router.get('/account', profileSettingsController.getAccountSettings);
router.get('/:userId/account', profileSettingsController.getAccountSettings);
router.put('/account', profileSettingsController.updateAccountSettings);
router.put('/:userId/account', profileSettingsController.updateAccountSettings);

router.get('/notifications', profileSettingsController.getNotificationSettings);
router.get('/:userId/notifications', profileSettingsController.getNotificationSettings);
router.put('/notifications', profileSettingsController.updateNotificationSettings);
router.put('/:userId/notifications', profileSettingsController.updateNotificationSettings);

router.get('/privacy', profileSettingsController.getPrivacySettings);
router.get('/:userId/privacy', profileSettingsController.getPrivacySettings);
router.put('/privacy', profileSettingsController.updatePrivacySettings);
router.put('/:userId/privacy', profileSettingsController.updatePrivacySettings);

router.get('/security', profileSettingsController.getSecuritySettings);
router.get('/:userId/security', profileSettingsController.getSecuritySettings);
router.put('/security', profileSettingsController.updateSecuritySettings);
router.put('/:userId/security', profileSettingsController.updateSecuritySettings);

router.post('/sessions', profileSettingsController.addSession);
router.post('/:userId/sessions', profileSettingsController.addSession);
router.delete('/sessions/:sessionId', profileSettingsController.removeSession);
router.delete('/:userId/sessions/:sessionId', profileSettingsController.removeSession);
router.delete('/sessions', profileSettingsController.removeAllOtherSessions);
router.delete('/:userId/sessions', profileSettingsController.removeAllOtherSessions);

router.post('/password-change', profileSettingsController.updatePasswordChangeTime);
router.post('/:userId/password-change', profileSettingsController.updatePasswordChangeTime);

module.exports = router;
