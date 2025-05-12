/**
 * 系统设置类型定义
 */

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  enableAssessments: boolean;
  enablePathways: boolean;
  enableConsultantMatching: boolean;
}

export interface SecuritySettings {
  enableTwoFactor: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  minimumPasswordLength: number;
  requireSpecialCharacters: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export interface NotificationSettings {
  sendWelcomeEmail: boolean;
  sendPasswordResetEmail: boolean;
  sendAppointmentReminders: boolean;
  enableInAppNotifications: boolean;
  showUnreadBadges: boolean;
  welcomeEmailSubject: string;
  appointmentReminderSubject: string;
}

export interface IntegrationSettings {
  openaiApiKey: string;
  googleMapsApiKey: string;
  enableStripe: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  enableGoogleLogin: boolean;
  enableFacebookLogin: boolean;
}

export interface AppearanceSettings {
  colorScheme: 'light' | 'dark' | 'system';
  primaryColor: string;
  enableCompactMode: boolean;
  enableAnimations: boolean;
  logoUrl: string;
  faviconUrl: string;
}

export interface AdvancedSettings {
  enableMaintenanceMode: boolean;
  maintenanceMessage: string;
  enablePageCaching: boolean;
  cacheTTL: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enableErrorReporting: boolean;
}

export interface SystemSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  appearance: AppearanceSettings;
  advanced: AdvancedSettings;
}

export const defaultSettings: SystemSettings = {
  general: {
    siteName: 'ThinkForward AI',
    siteDescription: '智能职业规划与顾问匹配平台',
    contactEmail: 'support@thinkforward.ai',
    defaultLanguage: 'zh',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    enableAssessments: true,
    enablePathways: true,
    enableConsultantMatching: true,
  },
  security: {
    enableTwoFactor: false,
    requireEmailVerification: true,
    sessionTimeout: 60,
    minimumPasswordLength: 8,
    requireSpecialCharacters: true,
    requireNumbers: true,
    requireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
  },
  notifications: {
    sendWelcomeEmail: true,
    sendPasswordResetEmail: true,
    sendAppointmentReminders: true,
    enableInAppNotifications: true,
    showUnreadBadges: true,
    welcomeEmailSubject: '欢迎加入 ThinkForward AI',
    appointmentReminderSubject: '您有一个即将到来的预约',
  },
  integrations: {
    openaiApiKey: '',
    googleMapsApiKey: '',
    enableStripe: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    enableGoogleLogin: false,
    enableFacebookLogin: false,
  },
  appearance: {
    colorScheme: 'system',
    primaryColor: 'blue',
    enableCompactMode: false,
    enableAnimations: true,
    logoUrl: '/images/logo.svg',
    faviconUrl: '/favicon.ico',
  },
  advanced: {
    enableMaintenanceMode: false,
    maintenanceMessage: '系统正在维护中，请稍后再试。',
    enablePageCaching: true,
    cacheTTL: 3600,
    logLevel: 'error',
    enableErrorReporting: true,
  },
};
