/**
 * 认证路由
 * 定义认证相关的API端点
 */

const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('请提供有效的电子邮件地址'),
    body('password').isLength({ min: 8 }).withMessage('密码长度不能少于8个字符'),
    body('firstName').notEmpty().withMessage('名字不能为空'),
    body('lastName').notEmpty().withMessage('姓氏不能为空')
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('请提供有效的电子邮件地址'),
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  authController.login
);

router.get('/verify-email/:token', authController.verifyEmail);

router.post('/resend-verification', verifyToken, authController.resendVerification);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('请提供有效的电子邮件地址')
  ],
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 8 }).withMessage('密码长度不能少于8个字符')
  ],
  authController.resetPassword
);

router.put(
  '/change-password',
  verifyToken,
  [
    body('currentPassword').notEmpty().withMessage('当前密码不能为空'),
    body('newPassword').isLength({ min: 8 }).withMessage('新密码长度不能少于8个字符')
  ],
  authController.changePassword
);

router.get('/me', verifyToken, authController.getCurrentUser);

router.post('/logout', verifyToken, authController.logout);

router.post('/2fa/setup', verifyToken, authController.setupTwoFactor);

router.post(
  '/2fa/verify',
  verifyToken,
  [
    body('token').notEmpty().withMessage('验证码不能为空')
  ],
  authController.verifyTwoFactor
);

router.delete(
  '/2fa',
  verifyToken,
  [
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  authController.disableTwoFactor
);

router.get('/notifications', verifyToken, authController.getNotifications);

router.patch('/notifications/:id', verifyToken, authController.markNotificationAsRead);

router.patch('/notifications', verifyToken, authController.markAllNotificationsAsRead);

module.exports = router;
