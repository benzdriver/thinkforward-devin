/**
 * Mock authRoutes for testing
 * Matches the actual backend implementation
 */
const express = require('express');
const router = express.Router();
const authController = require('../../../mocks/controllers/authController');
const authMiddleware = require('../../../mocks/middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware.verifyToken, authController.logout);
router.get('/me', authMiddleware.verifyToken, authController.getCurrentUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authMiddleware.verifyToken, authController.changePassword);
router.get('/validate-token', authController.validateToken);

module.exports = router;
