/**
 * 系统设置模型
 * 存储全局系统配置设置
 */

const mongoose = require('mongoose');

const generalSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'ThinkForward AI'
  },
  siteDescription: {
    type: String,
    default: '智能移民规划平台'
  },
  contactEmail: {
    type: String,
    default: 'support@thinkforward.ai'
  },
  defaultLanguage: {
    type: String,
    default: 'zh-CN'
  },
  supportedLanguages: [{
    code: String,
    name: String,
    isActive: Boolean
  }],
  defaultTimezone: {
    type: String,
    default: 'Asia/Shanghai'
  },
  logoUrl: {
    type: String,
    default: '/images/logo.png'
  },
  faviconUrl: {
    type: String,
    default: '/images/favicon.ico'
  },
  features: {
    enableAssessment: {
      type: Boolean,
      default: true
    },
    enablePathways: {
      type: Boolean,
      default: true
    },
    enableForms: {
      type: Boolean,
      default: true
    },
    enableConsultants: {
      type: Boolean,
      default: true
    },
    enableBlog: {
      type: Boolean,
      default: false
    },
    enableForum: {
      type: Boolean,
      default: false
    }
  }
}, { _id: false });

const securitySettingsSchema = new mongoose.Schema({
  authentication: {
    allowSocialLogin: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    allowRegistration: {
      type: Boolean,
      default: true
    },
    twoFactorAuthDefault: {
      type: Boolean,
      default: false
    }
  },
  session: {
    timeout: {
      type: Number,
      default: 30, // 分钟
      min: 5,
      max: 1440
    },
    maxConcurrentSessions: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    },
    rememberMeDuration: {
      type: Number,
      default: 30, // 天
      min: 1,
      max: 365
    }
  },
  password: {
    minLength: {
      type: Number,
      default: 8,
      min: 6,
      max: 32
    },
    requireUppercase: {
      type: Boolean,
      default: true
    },
    requireLowercase: {
      type: Boolean,
      default: true
    },
    requireNumbers: {
      type: Boolean,
      default: true
    },
    requireSpecialChars: {
      type: Boolean,
      default: true
    },
    passwordExpiryDays: {
      type: Number,
      default: 90, // 天
      min: 0,
      max: 365
    },
    preventPasswordReuse: {
      type: Number,
      default: 3, // 最近几次密码不能重复使用
      min: 0,
      max: 10
    }
  },
  rateLimit: {
    enabled: {
      type: Boolean,
      default: true
    },
    maxRequests: {
      type: Number,
      default: 100,
      min: 10,
      max: 1000
    },
    timeWindow: {
      type: Number,
      default: 15, // 分钟
      min: 1,
      max: 60
    }
  },
  ipBlocking: {
    enabled: {
      type: Boolean,
      default: true
    },
    maxFailedAttempts: {
      type: Number,
      default: 5,
      min: 3,
      max: 20
    },
    blockDuration: {
      type: Number,
      default: 30, // 分钟
      min: 5,
      max: 1440
    }
  }
}, { _id: false });

const notificationSettingsSchema = new mongoose.Schema({
  email: {
    enabled: {
      type: Boolean,
      default: true
    },
    provider: {
      type: String,
      enum: ['smtp', 'sendgrid', 'mailgun', 'ses'],
      default: 'smtp'
    },
    from: {
      type: String,
      default: 'noreply@thinkforward.ai'
    },
    smtpSettings: {
      host: {
        type: String,
        default: ''
      },
      port: {
        type: Number,
        default: 587
      },
      secure: {
        type: Boolean,
        default: false
      },
      auth: {
        user: {
          type: String,
          default: ''
        },
        pass: {
          type: String,
          default: ''
        }
      }
    },
    apiKey: {
      type: String,
      default: ''
    },
    domain: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: 'us-east-1'
    }
  },
  push: {
    enabled: {
      type: Boolean,
      default: true
    },
    provider: {
      type: String,
      enum: ['firebase', 'onesignal', 'custom'],
      default: 'firebase'
    },
    apiKey: {
      type: String,
      default: ''
    },
    appId: {
      type: String,
      default: ''
    }
  },
  sms: {
    enabled: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      enum: ['twilio', 'aliyun', 'custom'],
      default: 'twilio'
    },
    accountSid: {
      type: String,
      default: ''
    },
    authToken: {
      type: String,
      default: ''
    },
    fromNumber: {
      type: String,
      default: ''
    },
    apiKey: {
      type: String,
      default: ''
    },
    apiSecret: {
      type: String,
      default: ''
    }
  },
  templates: {
    welcome: {
      subject: {
        type: String,
        default: '欢迎加入ThinkForward AI'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    },
    passwordReset: {
      subject: {
        type: String,
        default: '密码重置请求'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    },
    emailVerification: {
      subject: {
        type: String,
        default: '请验证您的邮箱'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    },
    appointmentReminder: {
      subject: {
        type: String,
        default: '预约提醒'
      },
      enabled: {
        type: Boolean,
        default: true
      },
      sendHoursBefore: {
        type: Number,
        default: 24
      }
    },
    documentUpdate: {
      subject: {
        type: String,
        default: '文档更新通知'
      },
      enabled: {
        type: Boolean,
        default: true
      }
    }
  }
}, { _id: false });

const integrationSettingsSchema = new mongoose.Schema({
  payment: {
    enabled: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'alipay', 'wechatpay'],
      default: 'stripe'
    },
    testMode: {
      type: Boolean,
      default: true
    },
    apiKey: {
      type: String,
      default: ''
    },
    secretKey: {
      type: String,
      default: ''
    },
    webhookSecret: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'CNY'
    }
  },
  storage: {
    provider: {
      type: String,
      enum: ['local', 's3', 'oss', 'cos'],
      default: 'local'
    },
    bucketName: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: ''
    },
    accessKey: {
      type: String,
      default: ''
    },
    secretKey: {
      type: String,
      default: ''
    },
    endpoint: {
      type: String,
      default: ''
    },
    maxUploadSize: {
      type: Number,
      default: 10, // MB
      min: 1,
      max: 100
    }
  },
  socialLogin: {
    google: {
      enabled: {
        type: Boolean,
        default: false
      },
      clientId: {
        type: String,
        default: ''
      },
      clientSecret: {
        type: String,
        default: ''
      }
    },
    facebook: {
      enabled: {
        type: Boolean,
        default: false
      },
      appId: {
        type: String,
        default: ''
      },
      appSecret: {
        type: String,
        default: ''
      }
    },
    wechat: {
      enabled: {
        type: Boolean,
        default: false
      },
      appId: {
        type: String,
        default: ''
      },
      appSecret: {
        type: String,
        default: ''
      }
    }
  },
  analytics: {
    googleAnalytics: {
      enabled: {
        type: Boolean,
        default: false
      },
      trackingId: {
        type: String,
        default: ''
      }
    },
    baiduAnalytics: {
      enabled: {
        type: Boolean,
        default: false
      },
      trackingId: {
        type: String,
        default: ''
      }
    },
    customAnalytics: {
      enabled: {
        type: Boolean,
        default: false
      },
      script: {
        type: String,
        default: ''
      }
    }
  },
  api: {
    enablePublicApi: {
      type: Boolean,
      default: false
    },
    rateLimitPerMinute: {
      type: Number,
      default: 60,
      min: 10,
      max: 1000
    }
  }
}, { _id: false });

const appearanceSettingsSchema = new mongoose.Schema({
  theme: {
    mode: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    primaryColor: {
      type: String,
      default: '#1890ff'
    },
    secondaryColor: {
      type: String,
      default: '#52c41a'
    },
    accentColor: {
      type: String,
      default: '#f5222d'
    },
    borderRadius: {
      type: Number,
      default: 4,
      min: 0,
      max: 20
    }
  },
  layout: {
    sidebarPosition: {
      type: String,
      enum: ['left', 'right'],
      default: 'left'
    },
    headerFixed: {
      type: Boolean,
      default: true
    },
    contentWidth: {
      type: String,
      enum: ['fluid', 'fixed'],
      default: 'fluid'
    },
    sidebarCollapsible: {
      type: Boolean,
      default: true
    }
  },
  customCss: {
    enabled: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    }
  },
  landing: {
    heroTitle: {
      type: String,
      default: '智能移民规划平台'
    },
    heroSubtitle: {
      type: String,
      default: '让移民之路更简单、更清晰'
    },
    heroCta: {
      type: String,
      default: '立即开始'
    },
    heroImage: {
      type: String,
      default: '/images/hero.jpg'
    },
    featuresTitle: {
      type: String,
      default: '我们的特色服务'
    },
    features: [{
      title: String,
      description: String,
      icon: String
    }]
  }
}, { _id: false });

const advancedSettingsSchema = new mongoose.Schema({
  system: {
    maintenanceMode: {
      enabled: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: '系统正在维护中，请稍后再试。'
      },
      allowAdminAccess: {
        type: Boolean,
        default: true
      }
    },
    debugMode: {
      type: Boolean,
      default: false
    },
    logLevel: {
      type: String,
      enum: ['error', 'warn', 'info', 'debug'],
      default: 'info'
    }
  },
  cache: {
    enabled: {
      type: Boolean,
      default: true
    },
    ttl: {
      type: Number,
      default: 3600, // 秒
      min: 60,
      max: 86400
    },
    provider: {
      type: String,
      enum: ['memory', 'redis'],
      default: 'memory'
    },
    redisUrl: {
      type: String,
      default: ''
    }
  },
  backup: {
    autoBackup: {
      type: Boolean,
      default: false
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    maxBackups: {
      type: Number,
      default: 5,
      min: 1,
      max: 30
    },
    backupTime: {
      type: String,
      default: '02:00'
    },
    backupLocation: {
      type: String,
      default: 'local'
    }
  },
  performance: {
    compression: {
      type: Boolean,
      default: true
    },
    minify: {
      type: Boolean,
      default: true
    },
    responseTimeout: {
      type: Number,
      default: 30000, // 毫秒
      min: 5000,
      max: 120000
    },
    maxUploadSize: {
      type: Number,
      default: 10, // MB
      min: 1,
      max: 100
    }
  }
}, { _id: false });

const systemSettingsSchema = new mongoose.Schema({
  general: {
    type: generalSettingsSchema,
    default: () => ({})
  },
  security: {
    type: securitySettingsSchema,
    default: () => ({})
  },
  notifications: {
    type: notificationSettingsSchema,
    default: () => ({})
  },
  integrations: {
    type: integrationSettingsSchema,
    default: () => ({})
  },
  appearance: {
    type: appearanceSettingsSchema,
    default: () => ({})
  },
  advanced: {
    type: advancedSettingsSchema,
    default: () => ({})
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'systemSettings'
});

/**
 * 获取系统设置
 * @returns {Promise<Object>} 系统设置
 */
systemSettingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  return this.create({});
};

/**
 * 更新系统设置
 * @param {Object} settings - 新的设置
 * @param {String} userId - 更新用户ID
 * @returns {Promise<Object>} 更新后的设置
 */
systemSettingsSchema.statics.updateSettings = async function(settings, userId) {
  const currentSettings = await this.findOne();
  
  if (!currentSettings) {
    return this.create({
      ...settings,
      lastUpdatedBy: userId,
      lastUpdatedAt: new Date()
    });
  }
  
  Object.keys(settings).forEach(category => {
    if (currentSettings[category] && typeof settings[category] === 'object') {
      Object.keys(settings[category]).forEach(key => {
        if (currentSettings[category][key] !== undefined) {
          currentSettings[category][key] = settings[category][key];
        }
      });
    }
  });
  
  currentSettings.lastUpdatedBy = userId;
  currentSettings.lastUpdatedAt = new Date();
  
  return currentSettings.save();
};

/**
 * 重置系统设置为默认值
 * @param {String} userId - 更新用户ID
 * @returns {Promise<Object>} 重置后的设置
 */
systemSettingsSchema.statics.resetSettings = async function(userId) {
  const settings = await this.findOne();
  
  if (!settings) {
    return this.create({
      lastUpdatedBy: userId,
      lastUpdatedAt: new Date()
    });
  }
  
  const defaultSettings = new this();
  
  settings.general = defaultSettings.general;
  settings.security = defaultSettings.security;
  settings.notifications = defaultSettings.notifications;
  settings.integrations = defaultSettings.integrations;
  settings.appearance = defaultSettings.appearance;
  settings.advanced = defaultSettings.advanced;
  
  settings.lastUpdatedBy = userId;
  settings.lastUpdatedAt = new Date();
  
  return settings.save();
};

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

module.exports = SystemSettings;
