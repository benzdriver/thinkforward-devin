/**
 * 认证控制器
 * 处理用户认证相关的请求
 */

const User = require('../models/User');
const authService = require('../services/authService');
const { errorHandler, asyncHandler, validateRequest } = require('../utils/errorHandler');

/**
 * 用户注册
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: '请提供有效的电子邮件地址'
    },
    password: { 
      required: true, 
      minLength: 8,
      minLengthMessage: '密码长度不能少于8个字符'
    },
    firstName: { required: true },
    lastName: { required: true }
  });
  
  const { email, password, firstName, lastName, displayName } = req.body;
  
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: '该电子邮件已被注册',
      code: 'EMAIL_ALREADY_EXISTS'
    });
  }
  
  const user = await authService.registerUser({
    email,
    password,
    firstName,
    lastName,
    displayName: displayName || `${firstName} ${lastName}`,
    preferredLanguage: req.locale || 'en'
  });
  
  const verificationToken = user.generateVerificationToken();
  await user.save();
  
  await authService.sendVerificationEmail(user.email, verificationToken, req.locale);
  
  const token = authService.generateToken(user._id);
  
  res.status(201).json({
    success: true,
    message: '用户注册成功',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        emailVerified: user.emailVerified,
        preferredLanguage: user.preferredLanguage
      },
      token
    }
  });
});

/**
 * 用户登录
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    email: { required: true },
    password: { required: true }
  });
  
  const { email, password } = req.body;
  
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: '无效的电子邮件或密码',
      code: 'INVALID_CREDENTIALS'
    });
  }
  
  if (user.isLocked()) {
    return res.status(403).json({
      success: false,
      message: '账户已被锁定，请稍后再试',
      code: 'ACCOUNT_LOCKED',
      lockUntil: user.lockUntil
    });
  }
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    
    return res.status(401).json({
      success: false,
      message: '无效的电子邮件或密码',
      code: 'INVALID_CREDENTIALS',
      attempts: user.loginAttempts + 1,
      maxAttempts: 5
    });
  }
  
  await user.resetLoginAttempts();
  
  user.lastLogin = Date.now();
  await user.save();
  
  const token = authService.generateToken(user._id);
  
  res.status(200).json({
    success: true,
    message: '登录成功',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        emailVerified: user.emailVerified,
        preferredLanguage: user.preferredLanguage,
        twoFactorEnabled: user.twoFactorEnabled
      },
      token
    }
  });
});

/**
 * 验证电子邮件
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  const user = await User.findByVerificationToken(token);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: '无效的验证令牌',
      code: 'INVALID_VERIFICATION_TOKEN'
    });
  }
  
  user.emailVerified = true;
  user.verificationToken = undefined;
  user.status = 'active';
  await user.save();
  
  res.status(200).json({
    success: true,
    message: '电子邮件验证成功',
    data: {
      email: user.email,
      emailVerified: true
    }
  });
});

/**
 * 重新发送验证邮件
 * @route POST /api/auth/resend-verification
 * @access Private
 */
const resendVerification = asyncHandler(async (req, res) => {
  const user = req.user;
  
  if (user.emailVerified) {
    return res.status(400).json({
      success: false,
      message: '电子邮件已验证',
      code: 'EMAIL_ALREADY_VERIFIED'
    });
  }
  
  const verificationToken = user.generateVerificationToken();
  await user.save();
  
  await authService.sendVerificationEmail(user.email, verificationToken, req.locale);
  
  res.status(200).json({
    success: true,
    message: '验证邮件已发送',
    data: {
      email: user.email
    }
  });
});

/**
 * 忘记密码
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    email: { required: true }
  });
  
  const { email } = req.body;
  
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(200).json({
      success: true,
      message: '如果该邮箱已注册，重置密码邮件已发送',
      data: {
        email
      }
    });
  }
  
  const resetToken = user.generatePasswordResetToken();
  await user.save();
  
  await authService.sendPasswordResetEmail(user.email, resetToken, req.locale);
  
  res.status(200).json({
    success: true,
    message: '如果该邮箱已注册，重置密码邮件已发送',
    data: {
      email
    }
  });
});

/**
 * 重置密码
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    password: { 
      required: true, 
      minLength: 8,
      minLengthMessage: '密码长度不能少于8个字符'
    }
  });
  
  const { token } = req.params;
  const { password } = req.body;
  
  const user = await User.findByPasswordResetToken(token);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: '无效或已过期的重置令牌',
      code: 'INVALID_RESET_TOKEN'
    });
  }
  
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  
  await authService.sendPasswordChangeNotification(user.email, req.locale);
  
  res.status(200).json({
    success: true,
    message: '密码重置成功',
    data: {
      email: user.email
    }
  });
});

/**
 * 更改密码
 * @route PUT /api/auth/change-password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    currentPassword: { required: true },
    newPassword: { 
      required: true, 
      minLength: 8,
      minLengthMessage: '新密码长度不能少于8个字符'
    }
  });
  
  const { currentPassword, newPassword } = req.body;
  const user = req.user;
  
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: '当前密码不正确',
      code: 'INCORRECT_PASSWORD'
    });
  }
  
  user.password = newPassword;
  await user.save();
  
  await authService.sendPasswordChangeNotification(user.email, req.locale);
  
  res.status(200).json({
    success: true,
    message: '密码更改成功',
    data: {
      email: user.email
    }
  });
});

/**
 * 获取当前用户信息
 * @route GET /api/auth/me
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        twoFactorEnabled: user.twoFactorEnabled,
        preferredLanguage: user.preferredLanguage,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        unreadNotifications: user.getUnreadNotificationCount()
      }
    }
  });
});

/**
 * 注销
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  
  res.status(200).json({
    success: true,
    message: '注销成功'
  });
});

/**
 * 设置两因素认证
 * @route POST /api/auth/2fa/setup
 * @access Private
 */
const setupTwoFactor = asyncHandler(async (req, res) => {
  const user = req.user;
  
  const { secret, qrCode } = await authService.generateTwoFactorSecret(user.email);
  
  user.twoFactorSecret = secret;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: '两因素认证设置准备就绪',
    data: {
      qrCode,
      secret
    }
  });
});

/**
 * 验证两因素认证
 * @route POST /api/auth/2fa/verify
 * @access Private
 */
const verifyTwoFactor = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    token: { required: true }
  });
  
  const { token } = req.body;
  const user = req.user;
  
  const isValid = await authService.verifyTwoFactorToken(token, user.twoFactorSecret);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: '无效的验证码',
      code: 'INVALID_2FA_TOKEN'
    });
  }
  
  user.twoFactorEnabled = true;
  await user.save();
  
  if (req.session) {
    req.session.twoFactorVerified = true;
  }
  
  res.status(200).json({
    success: true,
    message: '两因素认证已启用',
    data: {
      twoFactorEnabled: true
    }
  });
});

/**
 * 禁用两因素认证
 * @route DELETE /api/auth/2fa
 * @access Private
 */
const disableTwoFactor = asyncHandler(async (req, res) => {
  validateRequest(req.body, {
    password: { required: true }
  });
  
  const { password } = req.body;
  const user = req.user;
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: '密码不正确',
      code: 'INCORRECT_PASSWORD'
    });
  }
  
  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: '两因素认证已禁用',
    data: {
      twoFactorEnabled: false
    }
  });
});

/**
 * 获取用户通知
 * @route GET /api/auth/notifications
 * @access Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  
  res.status(200).json({
    success: true,
    data: {
      notifications: user.notifications,
      unreadCount: user.getUnreadNotificationCount()
    }
  });
});

/**
 * 标记通知为已读
 * @route PATCH /api/auth/notifications/:id
 * @access Private
 */
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  await user.markNotificationAsRead(id);
  
  res.status(200).json({
    success: true,
    message: '通知已标记为已读',
    data: {
      notificationId: id,
      unreadCount: user.getUnreadNotificationCount()
    }
  });
});

/**
 * 标记所有通知为已读
 * @route PATCH /api/auth/notifications
 * @access Private
 */
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const user = req.user;
  
  await user.markAllNotificationsAsRead();
  
  res.status(200).json({
    success: true,
    message: '所有通知已标记为已读',
    data: {
      unreadCount: 0
    }
  });
});

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  logout,
  setupTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
