# 管理员系统设置页面

## 概述

管理员系统设置页面提供了一个全面的界面，用于管理和配置整个ThinkForward AI平台的系统级设置。管理员可以通过此页面调整各种系统参数，包括一般设置、安全设置、通知设置、集成设置、外观设置和高级设置。

## 技术实现

### 页面组件

- 位置：`/frontend/pages/admin/settings.tsx`
- 路由：`/admin/settings`
- 布局：使用 `DashboardLayout` 组件

### 状态管理

- 使用 Zustand 存储：`useAdminSettingsStore`
- 位置：`/frontend/lib/store/zustand/useAdminSettingsStore.ts`
- 主要状态：
  - 系统设置数据
  - 加载状态
  - 错误信息
  - 活动标签页
  - 未保存更改标志
  - 重置确认模态框状态

### API 服务

- 位置：`/frontend/lib/api/services/admin-settings.ts`
- 主要功能：
  - 获取系统设置
  - 更新系统设置
  - 重置系统设置为默认值
  - 获取设置历史记录
  - 导出/导入系统设置
  - 测试邮件配置
  - 清除系统缓存

## 功能特性

### 一般设置

- 站点信息配置（名称、描述、联系邮箱）
- 本地化设置（默认语言、时区、日期格式）
- 功能开关（评估、路径、顾问匹配）

### 安全设置

- 认证配置（双因素认证、邮箱验证）
- 会话超时设置
- 密码策略（最小长度、特殊字符、数字、大写字母）
- 速率限制（最大登录尝试次数、锁定时长）

### 通知设置

- 邮件通知配置（欢迎邮件、密码重置邮件、预约提醒）
- 应用内通知设置
- 通知模板（邮件主题自定义）

### 集成设置

- API密钥管理（OpenAI、Google Maps等）
- 支付集成（Stripe）
- 社交登录（Google、Facebook）

### 外观设置

- 颜色方案（浅色、深色、跟随系统）
- 主题色选择
- 界面选项（紧凑模式、动画效果）
- 品牌资源（Logo、Favicon）

### 高级设置

- 维护模式
- 页面缓存
- 日志级别
- 错误报告

## 数据模型

### 系统设置（SystemSettings）

```typescript
interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    defaultLanguage: string;
    timezone: string;
    dateFormat: string;
    enableAssessments: boolean;
    enablePathways: boolean;
    enableConsultantMatching: boolean;
  };
  security: {
    enableTwoFactor: boolean;
    requireEmailVerification: boolean;
    sessionTimeout: number;
    minimumPasswordLength: number;
    requireSpecialCharacters: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  notifications: {
    sendWelcomeEmail: boolean;
    sendPasswordResetEmail: boolean;
    sendAppointmentReminders: boolean;
    enableInAppNotifications: boolean;
    showUnreadBadges: boolean;
    welcomeEmailSubject: string;
    appointmentReminderSubject: string;
  };
  integrations: {
    openaiApiKey: string;
    googleMapsApiKey: string;
    enableStripe: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    enableGoogleLogin: boolean;
    enableFacebookLogin: boolean;
  };
  appearance: {
    colorScheme: 'light' | 'dark' | 'system';
    primaryColor: string;
    enableCompactMode: boolean;
    enableAnimations: boolean;
    logoUrl: string;
    faviconUrl: string;
  };
  advanced: {
    enableMaintenanceMode: boolean;
    maintenanceMessage: string;
    enablePageCaching: boolean;
    cacheTTL: number;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    enableErrorReporting: boolean;
  };
}
```

## 用户界面

### 标签页导航

页面使用标签页导航组织不同类别的设置：
- 一般设置
- 安全设置
- 通知设置
- 集成设置
- 外观设置
- 高级设置

### 设置表单

每个标签页包含相关设置的表单控件：
- 文本输入框（站点名称、描述等）
- 下拉选择框（语言、时区等）
- 复选框（功能开关、通知选项等）
- 数字输入框（超时时间、密码长度等）
- 颜色选择器（主题色）

### 操作按钮

- 保存更改：将当前设置保存到服务器
- 重置为默认值：将所有设置恢复为系统默认值

## 国际化

页面支持多语言，使用 `next-i18next` 实现。所有文本内容都通过翻译键获取，支持切换语言。

## 响应式设计

页面设计响应式，适配不同屏幕尺寸：
- 在移动设备上，标签页垂直排列
- 在桌面设备上，标签页水平排列
- 表单控件在小屏幕上自适应宽度

## 安全考虑

- 页面仅对具有管理员权限的用户可见
- 敏感设置（如API密钥）在显示时进行掩码处理
- 重置操作需要确认
- 密码策略设置有合理的最小/最大值限制

## 后端 API 需求

### 获取系统设置

```
GET /api/admin/settings
```

### 更新系统设置

```
PATCH /api/admin/settings
```

请求体：
```json
{
  "general": { ... },
  "security": { ... },
  "notifications": { ... },
  "integrations": { ... },
  "appearance": { ... },
  "advanced": { ... }
}
```

### 重置系统设置

```
POST /api/admin/settings/reset
```

### 获取设置历史记录

```
GET /api/admin/settings/history
```

参数：
- `page`: 页码
- `limit`: 每页数量

### 导出系统设置

```
GET /api/admin/settings/export
```

### 导入系统设置

```
POST /api/admin/settings/import
```

### 测试邮件配置

```
POST /api/admin/settings/test-email
```

请求体：
```json
{
  "email": "test@example.com"
}
```

### 清除系统缓存

```
POST /api/admin/settings/clear-cache
```

请求体：
```json
{
  "type": "all" | "api" | "database" | "files"
}
```

## 未来扩展

- 添加设置搜索功能
- 实现设置版本历史和回滚
- 添加设置导入/导出功能
- 实现多环境设置（开发、测试、生产）
- 添加设置变更审计日志
