/**
 * 认证中间件
 * 用于验证用户身份和权限
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorHandler } = require('../utils/errorHandler');

/**
 * 验证JWT令牌
 * 检查请求头中的Authorization字段，验证JWT令牌的有效性
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: '未提供认证令牌',
        code: 'AUTH_TOKEN_MISSING'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: '无效的认证令牌格式',
        code: 'AUTH_TOKEN_INVALID_FORMAT'
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: '用户不存在',
          code: 'AUTH_USER_NOT_FOUND'
        });
      }
      
      if (user.status !== 'active') {
        return res.status(403).json({ 
          success: false, 
          message: '用户账户未激活',
          code: 'AUTH_USER_INACTIVE',
          status: user.status
        });
      }
      
      req.user = user;
      next();
      
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: '认证令牌已过期',
          code: 'AUTH_TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({ 
        success: false, 
        message: '无效的认证令牌',
        code: 'AUTH_TOKEN_INVALID'
      });
    }
    
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * 检查用户角色
 * 验证用户是否具有指定的角色
 * @param {Array|String} roles - 允许的角色列表或单个角色
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: '未认证的用户',
          code: 'AUTH_USER_UNAUTHENTICATED'
        });
      }
      
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: '权限不足',
          code: 'AUTH_INSUFFICIENT_PERMISSIONS',
          requiredRole: allowedRoles,
          userRole: req.user.role
        });
      }
      
      next();
      
    } catch (error) {
      return errorHandler(error, req, res);
    }
  };
};

/**
 * 检查资源所有权
 * 验证用户是否拥有请求的资源
 * @param {Function} getOwnerId - 从请求中获取资源所有者ID的函数
 * @param {Boolean} allowAdmin - 是否允许管理员访问所有资源
 */
const checkOwnership = (getOwnerId, allowAdmin = true) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: '未认证的用户',
          code: 'AUTH_USER_UNAUTHENTICATED'
        });
      }
      
      if (allowAdmin && req.user.role === 'admin') {
        return next();
      }
      
      const ownerId = await getOwnerId(req);
      
      if (req.user.id !== ownerId.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: '无权访问此资源',
          code: 'AUTH_RESOURCE_ACCESS_DENIED'
        });
      }
      
      next();
      
    } catch (error) {
      return errorHandler(error, req, res);
    }
  };
};

/**
 * 检查顾问权限
 * 验证用户是否为顾问或管理员
 */
const checkConsultant = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: '未认证的用户',
        code: 'AUTH_USER_UNAUTHENTICATED'
      });
    }
    
    if (req.user.role !== 'consultant' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: '需要顾问权限',
        code: 'AUTH_CONSULTANT_REQUIRED',
        userRole: req.user.role
      });
    }
    
    next();
    
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * 检查电子邮件验证
 * 验证用户的电子邮件是否已验证
 */
const checkEmailVerified = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: '未认证的用户',
        code: 'AUTH_USER_UNAUTHENTICATED'
      });
    }
    
    if (!req.user.emailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: '电子邮件未验证',
        code: 'AUTH_EMAIL_UNVERIFIED'
      });
    }
    
    next();
    
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * 检查两因素认证
 * 验证用户是否已完成两因素认证
 */
const checkTwoFactorAuth = (req, res, next) => {
  try {
    const twoFactorVerified = req.session && req.session.twoFactorVerified;
    
    if (req.user.twoFactorEnabled && !twoFactorVerified) {
      return res.status(403).json({ 
        success: false, 
        message: '需要两因素认证',
        code: 'AUTH_2FA_REQUIRED'
      });
    }
    
    next();
    
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

module.exports = {
  verifyToken,
  checkRole,
  checkOwnership,
  checkConsultant,
  checkEmailVerified,
  checkTwoFactorAuth
};
