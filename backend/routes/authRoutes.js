/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const localeMiddleware = require('../middleware/localeMiddleware');

router.use(localeMiddleware);

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  authController.login
);

/**
 * @route POST /auth/register
 * @desc Register new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],
  authController.register
);

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route POST /auth/reset-password
 * @desc Request password reset
 * @access Public
 */
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  authController.resetPassword
);

/**
 * @route POST /auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').isLength({ min: 8 }).withMessage('Current password must be at least 8 characters long'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
  ],
  authController.changePassword
);

/**
 * @route POST /auth/refresh-token
 * @desc Refresh authentication token
 * @access Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route GET /auth/validate-token
 * @desc Validate authentication token
 * @access Public
 */
router.get('/validate-token', authController.validateToken);

module.exports = router;
