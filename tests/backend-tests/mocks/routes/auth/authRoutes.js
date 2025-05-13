/**
 * Mock authRoutes for testing
 */
const express = require('express');
const router = express.Router();
const authController = require('../../../mocks/controllers/authController');
const { verifyToken } = require('../../../mocks/middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getCurrentUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
