/**
 * 认证服务
 * 提供用户认证相关的业务逻辑
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const { createError } = require('../utils/errorHandler');

/**
 * 注册新用户
 * @param {Object} userData - 用户数据
 * @returns {Promise<User>} - 新创建的用户对象
 */
const registerUser = async (userData) => {
  try {
    const user = new User({
      email: userData.email.toLowerCase(),
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
      preferredLanguage: userData.preferredLanguage || 'en',
      status: 'pending'
    });
    
    await user.save();
    
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw createError('该电子邮件已被注册', 409, 'EMAIL_ALREADY_EXISTS');
    }
    throw error;
  }
};

/**
 * 生成JWT令牌
 * @param {String} userId - 用户ID
 * @returns {String} - JWT令牌
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * 发送验证邮件
 * @param {String} email - 用户邮箱
 * @param {String} token - 验证令牌
 * @param {String} locale - 语言区域
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, token, locale = 'en') => {
  try {
    const transporter = createMailTransporter();
    
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: getEmailSubject('verification', locale),
      html: getVerificationEmailTemplate(verificationLink, locale)
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送验证邮件失败:', error);
    throw createError('发送验证邮件失败', 500, 'EMAIL_SENDING_FAILED');
  }
};

/**
 * 发送密码重置邮件
 * @param {String} email - 用户邮箱
 * @param {String} token - 重置令牌
 * @param {String} locale - 语言区域
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (email, token, locale = 'en') => {
  try {
    const transporter = createMailTransporter();
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: getEmailSubject('passwordReset', locale),
      html: getPasswordResetEmailTemplate(resetLink, locale)
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送密码重置邮件失败:', error);
    throw createError('发送密码重置邮件失败', 500, 'EMAIL_SENDING_FAILED');
  }
};

/**
 * 发送密码更改通知
 * @param {String} email - 用户邮箱
 * @param {String} locale - 语言区域
 * @returns {Promise<void>}
 */
const sendPasswordChangeNotification = async (email, locale = 'en') => {
  try {
    const transporter = createMailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: getEmailSubject('passwordChanged', locale),
      html: getPasswordChangeNotificationTemplate(locale)
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送密码更改通知失败:', error);
    console.warn('密码已更改，但发送通知失败');
  }
};

/**
 * 生成两因素认证密钥
 * @param {String} email - 用户邮箱
 * @returns {Promise<Object>} - 包含密钥和二维码的对象
 */
const generateTwoFactorSecret = async (email) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `ThinkForward AI (${email})`
    });
    
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    
    return {
      secret: secret.base32,
      qrCode: qrCodeUrl
    };
  } catch (error) {
    console.error('生成两因素认证密钥失败:', error);
    throw createError('生成两因素认证密钥失败', 500, 'GENERATE_2FA_FAILED');
  }
};

/**
 * 验证两因素认证令牌
 * @param {String} token - 用户提供的令牌
 * @param {String} secret - 用户的密钥
 * @returns {Promise<Boolean>} - 验证结果
 */
const verifyTwoFactorToken = async (token, secret) => {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1 // 允许前后1个时间窗口的令牌
    });
  } catch (error) {
    console.error('验证两因素认证令牌失败:', error);
    throw createError('验证两因素认证令牌失败', 500, 'VERIFY_2FA_FAILED');
  }
};

/**
 * 创建邮件传输器
 * @returns {Object} - Nodemailer传输器
 */
const createMailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * 获取邮件主题
 * @param {String} type - 邮件类型
 * @param {String} locale - 语言区域
 * @returns {String} - 邮件主题
 */
const getEmailSubject = (type, locale) => {
  const subjects = {
    verification: {
      en: 'Verify your email address - ThinkForward AI',
      fr: 'Vérifiez votre adresse e-mail - ThinkForward AI',
      zh: '验证您的电子邮件地址 - ThinkForward AI'
    },
    passwordReset: {
      en: 'Reset your password - ThinkForward AI',
      fr: 'Réinitialisez votre mot de passe - ThinkForward AI',
      zh: '重置您的密码 - ThinkForward AI'
    },
    passwordChanged: {
      en: 'Your password has been changed - ThinkForward AI',
      fr: 'Votre mot de passe a été modifié - ThinkForward AI',
      zh: '您的密码已更改 - ThinkForward AI'
    }
  };
  
  return subjects[type][locale] || subjects[type]['en'];
};

/**
 * 获取验证邮件模板
 * @param {String} verificationLink - 验证链接
 * @param {String} locale - 语言区域
 * @returns {String} - HTML邮件内容
 */
const getVerificationEmailTemplate = (verificationLink, locale) => {
  const templates = {
    en: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Thank you for signing up with ThinkForward AI. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't sign up for ThinkForward AI, please ignore this email.</p>
        <p>Best regards,<br>The ThinkForward AI Team</p>
      </div>
    `,
    fr: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Vérifiez votre adresse e-mail</h2>
        <p>Merci de vous être inscrit à ThinkForward AI. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Vérifier l'e-mail</a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
        <p>${verificationLink}</p>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous ne vous êtes pas inscrit à ThinkForward AI, veuillez ignorer cet e-mail.</p>
        <p>Cordialement,<br>L'équipe ThinkForward AI</p>
      </div>
    `,
    zh: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>验证您的电子邮件地址</h2>
        <p>感谢您注册ThinkForward AI。请点击下面的按钮验证您的电子邮件地址：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">验证邮箱</a>
        </div>
        <p>如果按钮不起作用，您也可以复制并粘贴以下链接到您的浏览器：</p>
        <p>${verificationLink}</p>
        <p>此链接将在24小时后过期。</p>
        <p>如果您没有注册ThinkForward AI，请忽略此邮件。</p>
        <p>此致，<br>ThinkForward AI团队</p>
      </div>
    `
  };
  
  return templates[locale] || templates['en'];
};

/**
 * 获取密码重置邮件模板
 * @param {String} resetLink - 重置链接
 * @param {String} locale - 语言区域
 * @returns {String} - HTML邮件内容
 */
const getPasswordResetEmailTemplate = (resetLink, locale) => {
  const templates = {
    en: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>You have requested to reset your password for ThinkForward AI. Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Best regards,<br>The ThinkForward AI Team</p>
      </div>
    `,
    fr: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisez votre mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe pour ThinkForward AI. Veuillez cliquer sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser le mot de passe</a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
        <p>${resetLink}</p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail ou contacter le support si vous avez des préoccupations.</p>
        <p>Cordialement,<br>L'équipe ThinkForward AI</p>
      </div>
    `,
    zh: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>重置您的密码</h2>
        <p>您已请求重置ThinkForward AI的密码。请点击下面的按钮重置您的密码：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">重置密码</a>
        </div>
        <p>如果按钮不起作用，您也可以复制并粘贴以下链接到您的浏览器：</p>
        <p>${resetLink}</p>
        <p>此链接将在1小时后过期。</p>
        <p>如果您没有请求重置密码，请忽略此邮件或联系支持人员。</p>
        <p>此致，<br>ThinkForward AI团队</p>
      </div>
    `
  };
  
  return templates[locale] || templates['en'];
};

/**
 * 获取密码更改通知邮件模板
 * @param {String} locale - 语言区域
 * @returns {String} - HTML邮件内容
 */
const getPasswordChangeNotificationTemplate = (locale) => {
  const templates = {
    en: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your password has been changed</h2>
        <p>This is a confirmation that the password for your ThinkForward AI account has been changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The ThinkForward AI Team</p>
      </div>
    `,
    fr: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Votre mot de passe a été modifié</h2>
        <p>Ceci est une confirmation que le mot de passe de votre compte ThinkForward AI a été modifié.</p>
        <p>Si vous n'avez pas effectué cette modification, veuillez contacter notre équipe d'assistance immédiatement.</p>
        <p>Cordialement,<br>L'équipe ThinkForward AI</p>
      </div>
    `,
    zh: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>您的密码已更改</h2>
        <p>这是确认您的ThinkForward AI账户密码已更改。</p>
        <p>如果您没有进行此更改，请立即联系我们的支持团队。</p>
        <p>此致，<br>ThinkForward AI团队</p>
      </div>
    `
  };
  
  return templates[locale] || templates['en'];
};

module.exports = {
  registerUser,
  generateToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangeNotification,
  generateTwoFactorSecret,
  verifyTwoFactorToken
};
