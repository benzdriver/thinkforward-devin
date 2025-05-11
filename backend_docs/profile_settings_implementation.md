# 个人资料设置模块实现文档

## 概述

个人资料设置模块允许用户管理其个人资料设置，包括个人信息、账户设置、通知设置和隐私设置。该模块基于前端的个人资料设置页面和组件，提供完整的后端支持。

## 数据模型

### AccountSettings 模型

```javascript
const mongoose = require('mongoose');

const accountSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  recoveryEmail: {
    type: String,
    trim: true
  },
  lastPasswordChange: {
    type: Date
  },
  loginHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    device: String,
    location: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const AccountSettings = mongoose.model('AccountSettings', accountSettingsSchema);

module.exports = AccountSettings;
```

### NotificationSettings 模型

```javascript
const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    applicationUpdates: {
      type: Boolean,
      default: true
    },
    consultantMessages: {
      type: Boolean,
      default: true
    },
    documentReminders: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    }
  },
  inApp: {
    applicationUpdates: {
      type: Boolean,
      default: true
    },
    consultantMessages: {
      type: Boolean,
      default: true
    },
    documentReminders: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
```

### PrivacySettings 模型

```javascript
const mongoose = require('mongoose');

const privacySettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'private', 'consultants_only'],
    default: 'public'
  },
  dataSharing: {
    withConsultants: {
      type: Boolean,
      default: true
    },
    withPartners: {
      type: Boolean,
      default: false
    },
    forResearch: {
      type: Boolean,
      default: true
    }
  },
  cookiePreferences: {
    necessary: {
      type: Boolean,
      default: true
    },
    functional: {
      type: Boolean,
      default: true
    },
    analytics: {
      type: Boolean,
      default: true
    },
    marketing: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const PrivacySettings = mongoose.model('PrivacySettings', privacySettingsSchema);

module.exports = PrivacySettings;
```

### SecuritySettings 模型

```javascript
const mongoose = require('mongoose');

const securitySettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  sessionTimeout: {
    type: Number,
    default: 30, // minutes
    min: 5,
    max: 120
  },
  deviceManagement: [{
    deviceId: String,
    deviceName: String,
    lastActive: Date,
    isTrusted: {
      type: Boolean,
      default: false
    }
  }],
  loginAlerts: {
    type: Boolean,
    default: true
  },
  ipRestrictions: [{
    ipAddress: String,
    allowed: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SecuritySettings = mongoose.model('SecuritySettings', securitySettingsSchema);

module.exports = SecuritySettings;
```

## 服务层

### profileSettingsService.js

```javascript
/**
 * 个人资料设置服务
 */
const AccountSettings = require('../models/profile/AccountSettings');
const NotificationSettings = require('../models/profile/NotificationSettings');
const PrivacySettings = require('../models/profile/PrivacySettings');
const SecuritySettings = require('../models/profile/SecuritySettings');
const User = require('../models/User');
const { translateError } = require('../utils/errorHandler');

/**
 * 获取账户设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 账户设置
 */
exports.getAccountSettings = async (userId, locale = 'en') => {
  try {
    let settings = await AccountSettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultAccountSettings(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新账户设置
 * @param {string} userId - 用户ID
 * @param {Object} settingsData - 设置数据
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 更新后的账户设置
 */
exports.updateAccountSettings = async (userId, settingsData, locale = 'en') => {
  try {
    let settings = await AccountSettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultAccountSettings(userId);
    }
    
    Object.keys(settingsData).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        settings[key] = settingsData[key];
      }
    });
    
    await settings.save();
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取通知设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 通知设置
 */
exports.getNotificationSettings = async (userId, locale = 'en') => {
  try {
    let settings = await NotificationSettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultNotificationSettings(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新通知设置
 * @param {string} userId - 用户ID
 * @param {Object} settingsData - 设置数据
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 更新后的通知设置
 */
exports.updateNotificationSettings = async (userId, settingsData, locale = 'en') => {
  try {
    let settings = await NotificationSettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultNotificationSettings(userId);
    }
    
    Object.keys(settingsData).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        settings[key] = settingsData[key];
      }
    });
    
    await settings.save();
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取隐私设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 隐私设置
 */
exports.getPrivacySettings = async (userId, locale = 'en') => {
  try {
    let settings = await PrivacySettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultPrivacySettings(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新隐私设置
 * @param {string} userId - 用户ID
 * @param {Object} settingsData - 设置数据
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 更新后的隐私设置
 */
exports.updatePrivacySettings = async (userId, settingsData, locale = 'en') => {
  try {
    let settings = await PrivacySettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultPrivacySettings(userId);
    }
    
    Object.keys(settingsData).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        settings[key] = settingsData[key];
      }
    });
    
    await settings.save();
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 获取安全设置
 * @param {string} userId - 用户ID
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 安全设置
 */
exports.getSecuritySettings = async (userId, locale = 'en') => {
  try {
    let settings = await SecuritySettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultSecuritySettings(userId);
    }
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 更新安全设置
 * @param {string} userId - 用户ID
 * @param {Object} settingsData - 设置数据
 * @param {string} locale - 语言环境
 * @returns {Promise<Object>} - 更新后的安全设置
 */
exports.updateSecuritySettings = async (userId, settingsData, locale = 'en') => {
  try {
    let settings = await SecuritySettings.findOne({ userId });
    
    if (!settings) {
      settings = await createDefaultSecuritySettings(userId);
    }
    
    Object.keys(settingsData).forEach(key => {
      if (key !== 'userId' && key !== '_id') {
        settings[key] = settingsData[key];
      }
    });
    
    await settings.save();
    
    return settings;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * 创建默认账户设置
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 默认账户设置
 */
async function createDefaultAccountSettings(userId) {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  const settings = new AccountSettings({
    userId,
    email: user.email,
    twoFactorEnabled: false,
    recoveryEmail: '',
    lastPasswordChange: new Date(),
    loginHistory: []
  });
  
  await settings.save();
  
  return settings;
}

/**
 * 创建默认通知设置
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 默认通知设置
 */
async function createDefaultNotificationSettings(userId) {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  const settings = new NotificationSettings({
    userId,
    email: {
      applicationUpdates: true,
      consultantMessages: true,
      documentReminders: true,
      marketingEmails: false
    },
    inApp: {
      applicationUpdates: true,
      consultantMessages: true,
      documentReminders: true
    }
  });
  
  await settings.save();
  
  return settings;
}

/**
 * 创建默认隐私设置
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 默认隐私设置
 */
async function createDefaultPrivacySettings(userId) {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  const settings = new PrivacySettings({
    userId,
    profileVisibility: 'public',
    dataSharing: {
      withConsultants: true,
      withPartners: false,
      forResearch: true
    },
    cookiePreferences: {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false
    }
  });
  
  await settings.save();
  
  return settings;
}

/**
 * 创建默认安全设置
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 默认安全设置
 */
async function createDefaultSecuritySettings(userId) {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  const settings = new SecuritySettings({
    userId,
    sessionTimeout: 30,
    deviceManagement: [],
    loginAlerts: true,
    ipRestrictions: []
  });
  
  await settings.save();
  
  return settings;
}
```

## 控制器层

### profileSettingsController.js

```javascript
/**
 * 个人资料设置控制器
 */
const { validationResult } = require('express-validator');
const profileSettingsService = require('../services/profileSettingsService');
const { translateError } = require('../utils/errorHandler');

/**
 * 获取账户设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getAccountSettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access these settings'), locale).message
      });
    }
    
    const settings = await profileSettingsService.getAccountSettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get account settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching account settings'
    });
  }
};

/**
 * 更新账户设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.updateAccountSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update these settings'), locale).message
      });
    }
    
    const settingsData = req.body;
    
    const updatedSettings = await profileSettingsService.updateAccountSettings(userId, settingsData, locale);
    
    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Update account settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating account settings'
    });
  }
};

/**
 * 获取通知设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access these settings'), locale).message
      });
    }
    
    const settings = await profileSettingsService.getNotificationSettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching notification settings'
    });
  }
};

/**
 * 更新通知设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.updateNotificationSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update these settings'), locale).message
      });
    }
    
    const settingsData = req.body;
    
    const updatedSettings = await profileSettingsService.updateNotificationSettings(userId, settingsData, locale);
    
    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating notification settings'
    });
  }
};

/**
 * 获取隐私设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getPrivacySettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access these settings'), locale).message
      });
    }
    
    const settings = await profileSettingsService.getPrivacySettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get privacy settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching privacy settings'
    });
  }
};

/**
 * 更新隐私设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.updatePrivacySettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update these settings'), locale).message
      });
    }
    
    const settingsData = req.body;
    
    const updatedSettings = await profileSettingsService.updatePrivacySettings(userId, settingsData, locale);
    
    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating privacy settings'
    });
  }
};

/**
 * 获取安全设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getSecuritySettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access these settings'), locale).message
      });
    }
    
    const settings = await profileSettingsService.getSecuritySettings(userId, locale);
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get security settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching security settings'
    });
  }
};

/**
 * 更新安全设置
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.updateSecuritySettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update these settings'), locale).message
      });
    }
    
    const settingsData = req.body;
    
    const updatedSettings = await profileSettingsService.updateSecuritySettings(userId, settingsData, locale);
    
    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Update security settings error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating security settings'
    });
  }
};
```

## 路由层

### profileSettingsRoutes.js

```javascript
/**
 * 个人资料设置路由
 */
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const profileSettingsController = require('../controllers/profileSettingsController');

const router = express.Router();

// 账户设置路由
router.get('/account/:userId?', verifyToken, profileSettingsController.getAccountSettings);
router.put('/account/:userId?', verifyToken, profileSettingsController.updateAccountSettings);

// 通知设置路由
router.get('/notifications/:userId?', verifyToken, profileSettingsController.getNotificationSettings);
router.put('/notifications/:userId?', verifyToken, profileSettingsController.updateNotificationSettings);

// 隐私设置路由
router.get('/privacy/:userId?', verifyToken, profileSettingsController.getPrivacySettings);
router.put('/privacy/:userId?', verifyToken, profileSettingsController.updatePrivacySettings);

// 安全设置路由
router.get('/security/:userId?', verifyToken, profileSettingsController.getSecuritySettings);
router.put('/security/:userId?', verifyToken, profileSettingsController.updateSecuritySettings);

module.exports = router;
```

## 应用集成

在 `app.js` 中添加个人资料设置路由：

```javascript
const profileSettingsRoutes = require('./routes/profileSettingsRoutes');

// ...

app.use('/api/profile/settings', profileSettingsRoutes);
```

## API 端点

### 账户设置

- `GET /api/profile/settings/account/:userId?` - 获取账户设置
- `PUT /api/profile/settings/account/:userId?` - 更新账户设置

### 通知设置

- `GET /api/profile/settings/notifications/:userId?` - 获取通知设置
- `PUT /api/profile/settings/notifications/:userId?` - 更新通知设置

### 隐私设置

- `GET /api/profile/settings/privacy/:userId?` - 获取隐私设置
- `PUT /api/profile/settings/privacy/:userId?` - 更新隐私设置

### 安全设置

- `GET /api/profile/settings/security/:userId?` - 获取安全设置
- `PUT /api/profile/settings/security/:userId?` - 更新安全设置

## 实现计划

1. 创建个人资料设置相关的模型
2. 实现个人资料设置服务
3. 实现个人资料设置控制器
4. 创建个人资料设置路由
5. 在应用中集成个人资料设置路由
6. 测试所有API端点
