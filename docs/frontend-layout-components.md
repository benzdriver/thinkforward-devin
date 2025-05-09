# ThinkForward AI 前端布局组件文档

本文档详细描述了ThinkForward AI前端应用中使用的布局组件，包括其变体、特性、使用示例和后端集成考虑。

## 目录

1. [AuthLayout 认证页面布局](#authlayout-认证页面布局)
2. [DashboardLayout 仪表盘布局](#dashboardlayout-仪表盘布局)
3. [PageHeader 页面标题和描述](#pageheader-页面标题和描述)
4. [SectionContainer 内容区块容器](#sectioncontainer-内容区块容器)

---

### AuthLayout 认证页面布局

AuthLayout 认证页面布局组件用于创建登录、注册、密码重置等认证相关页面的统一布局。该组件提供了灵活的配置选项，包括侧边栏内容、内容位置和响应式设计。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认白色背景 | 简洁的认证页面 |
| gradient | 渐变背景 | 更具视觉吸引力的认证页面 |
| image | 图片背景 | 使用自定义背景图片的认证页面 |

#### 内容位置

| 位置名 | 描述 |
|--------|------|
| left | 内容在左侧，侧边栏在右侧 |
| right | 内容在右侧，侧边栏在左侧 |
| center | 内容居中，无侧边栏 |

#### 侧边栏变体

| 变体名 | 描述 |
|--------|------|
| default | 主色调背景，白色文字 |
| light | 浅色背景，深色文字 |
| dark | 深色背景，白色文字 |
| image | 图片背景 |

#### 特性

1. **响应式设计**：在移动设备上自动调整布局
2. **自定义侧边栏**：支持自定义侧边栏内容和样式
3. **灵活的内容位置**：可以选择内容在左侧、右侧或居中
4. **自定义页眉和页脚**：支持自定义页眉和页脚内容
5. **多语言支持**：与next-i18next集成，支持多语言
6. **背景图片**：支持自定义背景图片
7. **品牌定制**：支持自定义徽标和品牌元素

#### 使用示例

```jsx
// 基本用法
<AuthLayout>
  <LoginForm />
</AuthLayout>

// 不同变体
<AuthLayout variant="default">
  <LoginForm />
</AuthLayout>

<AuthLayout variant="gradient">
  <RegisterForm />
</AuthLayout>

<AuthLayout 
  variant="image" 
  backgroundImage="/images/auth-background.jpg"
>
  <ResetPasswordForm />
</AuthLayout>

// 不同内容位置
<AuthLayout contentPosition="left">
  <LoginForm />
</AuthLayout>

<AuthLayout contentPosition="right">
  <RegisterForm />
</AuthLayout>

<AuthLayout contentPosition="center">
  <ResetPasswordForm />
</AuthLayout>

// 自定义侧边栏
<AuthLayout
  sidebarContent={
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">欢迎回来</h1>
      <p>登录您的账户以继续</p>
    </div>
  }
>
  <LoginForm />
</AuthLayout>

// 自定义侧边栏变体和宽度
<AuthLayout
  sidebarVariant="light"
  sidebarWidth="lg"
>
  <LoginForm />
</AuthLayout>

// 自定义侧边栏图片
<AuthLayout
  sidebarVariant="image"
  sidebarImage="/images/sidebar-image.jpg"
>
  <LoginForm />
</AuthLayout>

// 自定义页眉和页脚
<AuthLayout
  header={<CustomHeader />}
  footer={<CustomFooter />}
>
  <LoginForm />
</AuthLayout>

// 自定义徽标
<AuthLayout
  logo={<CustomLogo />}
>
  <LoginForm />
</AuthLayout>

// 完整示例
<AuthLayout
  variant="gradient"
  contentPosition="right"
  sidebarVariant="image"
  sidebarImage="/images/sidebar-image.jpg"
  sidebarWidth="md"
  contentWidth="md"
  contentPadding="lg"
  logo={<CustomLogo />}
  header={<CustomHeader />}
  footer={<CustomFooter />}
>
  <LoginForm />
</AuthLayout>
```

#### 后端集成考虑

1. **认证状态**：后端应提供认证状态API，以便前端可以根据用户的认证状态显示适当的内容。

```json
{
  "isAuthenticated": false,
  "redirectTo": null,
  "authMethods": ["password", "google", "apple"],
  "preferredAuthMethod": "password"
}
```

2. **品牌定制**：后端应提供品牌配置API，以便前端可以根据租户或用户偏好显示适当的品牌元素。

```json
{
  "branding": {
    "logo": "/api/tenants/current/logo",
    "primaryColor": "#4F46E5",
    "secondaryColor": "#10B981",
    "backgroundImage": "/api/tenants/current/background",
    "companyName": "ThinkForward AI",
    "contactEmail": "support@thinkforward.ai"
  }
}
```

3. **多语言支持**：后端应提供语言配置API，以便前端可以根据用户偏好显示适当的语言。

```json
{
  "language": {
    "current": "zh-CN",
    "available": ["en-US", "zh-CN", "fr-FR"],
    "defaultLanguage": "en-US"
  }
}
```

4. **认证页面配置**：后端应提供认证页面配置API，以便前端可以根据系统配置显示适当的认证页面。

```json
{
  "authPages": {
    "login": {
      "enabled": true,
      "sidebarContent": "custom",
      "customText": "欢迎回来！请登录您的账户以继续。",
      "showRememberMe": true,
      "showForgotPassword": true,
      "socialLogin": ["google", "apple"]
    },
    "register": {
      "enabled": true,
      "sidebarContent": "default",
      "requireInvitation": false,
      "fields": ["name", "email", "password", "terms"]
    },
    "resetPassword": {
      "enabled": true,
      "sidebarContent": "none",
      "tokenExpiryHours": 24
    }
  }
}
```

AuthLayout组件提供了一种灵活且用户友好的方式来创建认证页面，确保品牌一致性和良好的用户体验。通过与后端良好的集成，可以根据系统配置和用户偏好动态调整认证页面的外观和行为。
