# 个人资料设置功能

## 概述

个人资料设置功能允许用户查看和编辑其个人信息、账户设置、通知偏好和安全选项。该功能旨在提供一个集中的界面，让用户能够管理与其账户相关的所有设置和信息。

## 页面

### 个人资料设置页面 (`/profile/settings`)

个人资料设置页面是用户管理其账户信息和偏好的中心位置，包含多个设置类别的选项卡。

**功能特点：**

- 个人信息编辑
- 账户设置管理
- 通知偏好配置
- 安全选项设置
- 语言和区域设置
- 隐私设置
- 账户删除选项

## 数据模型

### 用户资料 (UserProfile)

```typescript
interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  profession?: string;
  company?: string;
  education?: {
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }[];
  languages?: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### 账户设置 (AccountSettings)

```typescript
interface AccountSettings {
  userId: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'sms' | 'app' | 'email';
  updatedAt: string;
}
```

### 通知设置 (NotificationSettings)

```typescript
interface NotificationSettings {
  userId: string;
  email: {
    marketing: boolean;
    updates: boolean;
    security: boolean;
    reminders: boolean;
  };
  push: {
    messages: boolean;
    taskUpdates: boolean;
    appointments: boolean;
    documentUpdates: boolean;
  };
  sms: {
    security: boolean;
    appointments: boolean;
    importantUpdates: boolean;
  };
  updatedAt: string;
}
```

### 隐私设置 (PrivacySettings)

```typescript
interface PrivacySettings {
  userId: string;
  profileVisibility: 'public' | 'private' | 'contacts_only';
  activityVisibility: 'public' | 'private' | 'contacts_only';
  searchable: boolean;
  dataSharing: {
    analytics: boolean;
    thirdParty: boolean;
    improvementProgram: boolean;
  };
  updatedAt: string;
}
```

## 状态管理

个人资料设置功能使用Zustand进行状态管理，主要通过`useProfileSettingsStore`存储：

- 用户资料信息
- 账户设置
- 通知偏好
- 隐私设置
- 加载状态
- 错误信息

## API集成

### 用户资料API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/users/:id/profile` | GET | 获取用户资料 |
| `/users/:id/profile` | PUT | 更新用户资料 |
| `/users/:id/avatar` | POST | 上传用户头像 |
| `/users/:id/avatar` | DELETE | 删除用户头像 |

### 账户设置API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/users/:id/settings/account` | GET | 获取账户设置 |
| `/users/:id/settings/account` | PUT | 更新账户设置 |
| `/users/:id/email/verify` | POST | 发送电子邮件验证 |
| `/users/:id/phone/verify` | POST | 发送手机验证码 |
| `/users/:id/two-factor` | POST | 启用两因素认证 |
| `/users/:id/two-factor` | DELETE | 禁用两因素认证 |

### 通知设置API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/users/:id/settings/notifications` | GET | 获取通知设置 |
| `/users/:id/settings/notifications` | PUT | 更新通知设置 |

### 隐私设置API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/users/:id/settings/privacy` | GET | 获取隐私设置 |
| `/users/:id/settings/privacy` | PUT | 更新隐私设置 |

### 账户管理API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/users/:id/password` | PUT | 更改密码 |
| `/users/:id/deactivate` | POST | 停用账户 |
| `/users/:id/delete` | DELETE | 删除账户 |

### API钩子函数

```typescript
// 用户资料相关
useGetUserProfile(userId: string)
useUpdateUserProfile(userId: string)
useUploadAvatar(userId: string)
useDeleteAvatar(userId: string)

// 账户设置相关
useGetAccountSettings(userId: string)
useUpdateAccountSettings(userId: string)
useSendEmailVerification(userId: string)
useSendPhoneVerification(userId: string)
useEnableTwoFactor(userId: string)
useDisableTwoFactor(userId: string)

// 通知设置相关
useGetNotificationSettings(userId: string)
useUpdateNotificationSettings(userId: string)

// 隐私设置相关
useGetPrivacySettings(userId: string)
useUpdatePrivacySettings(userId: string)

// 账户管理相关
useChangePassword(userId: string)
useDeactivateAccount(userId: string)
useDeleteAccount(userId: string)
```

## 组件

### ProfileForm

个人资料表单组件，用于编辑用户的个人信息。

**属性：**

- `profile`: 用户资料对象
- `onSubmit`: 提交表单回调
- `isLoading`: 加载状态
- `error`: 错误信息

### AvatarUploader

头像上传组件，用于上传和裁剪用户头像。

**属性：**

- `userId`: 用户ID
- `currentAvatar`: 当前头像URL
- `onUpload`: 上传成功回调
- `onDelete`: 删除头像回调

### AccountSettingsForm

账户设置表单组件，用于管理账户相关设置。

**属性：**

- `settings`: 账户设置对象
- `onSubmit`: 提交表单回调
- `isLoading`: 加载状态
- `error`: 错误信息

### NotificationSettingsForm

通知设置表单组件，用于配置通知偏好。

**属性：**

- `settings`: 通知设置对象
- `onSubmit`: 提交表单回调
- `isLoading`: 加载状态
- `error`: 错误信息

### PrivacySettingsForm

隐私设置表单组件，用于管理隐私选项。

**属性：**

- `settings`: 隐私设置对象
- `onSubmit`: 提交表单回调
- `isLoading`: 加载状态
- `error`: 错误信息

### SecuritySettingsForm

安全设置表单组件，用于管理密码和两因素认证。

**属性：**

- `userId`: 用户ID
- `hasTwoFactor`: 是否启用两因素认证
- `twoFactorMethod`: 两因素认证方法
- `onEnableTwoFactor`: 启用两因素认证回调
- `onDisableTwoFactor`: 禁用两因素认证回调
- `onChangePassword`: 更改密码回调
- `isLoading`: 加载状态
- `error`: 错误信息

### AccountDeletionForm

账户删除表单组件，用于处理账户停用和删除请求。

**属性：**

- `userId`: 用户ID
- `onDeactivate`: 停用账户回调
- `onDelete`: 删除账户回调
- `isLoading`: 加载状态
- `error`: 错误信息

## 多语言支持

个人资料设置功能支持多语言，通过i18n实现。主要翻译键包括：

- `profile.settings.title`
- `profile.settings.tabs.*`
- `profile.personal.*`
- `profile.account.*`
- `profile.notifications.*`
- `profile.privacy.*`
- `profile.security.*`
- `profile.deletion.*`
- `profile.errors.*`

## 后端集成要求

1. 用户认证服务：需要支持密码更改和两因素认证
2. 文件存储服务：需要支持头像上传和存储
3. 电子邮件服务：需要支持发送验证邮件和通知
4. 短信服务：需要支持发送验证码和通知
5. 数据加密：需要确保敏感用户数据的安全存储

## 实现步骤

1. 创建个人资料设置状态管理存储
2. 实现个人信息编辑组件和功能
3. 实现账户设置组件和功能
4. 实现通知设置组件和功能
5. 实现隐私设置组件和功能
6. 实现安全设置组件和功能
7. 实现账户删除功能
8. 添加多语言支持
9. 集成表单验证

## 未来改进

1. 添加社交媒体账户关联
2. 实现活动日志查看
3. 添加数据导出功能
4. 实现会话管理（查看和终止活动会话）
5. 添加API密钥管理（用于开发者）
6. 实现双重验证流程（需要确认敏感操作）
7. 添加账户恢复选项
