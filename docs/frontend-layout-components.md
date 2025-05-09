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

### DashboardLayout 仪表盘布局

DashboardLayout 仪表盘布局组件用于创建应用程序的主要界面布局，包括侧边栏、顶部导航栏和内容区域。该组件提供了灵活的配置选项，包括可折叠侧边栏、固定页眉和页脚、自定义导航项等。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认浅灰色背景 | 标准仪表盘界面 |
| white | 纯白色背景 | 简洁的仪表盘界面 |
| gradient | 渐变背景 | 更具视觉吸引力的仪表盘界面 |

#### 侧边栏变体

| 变体名 | 描述 |
|--------|------|
| default | 白色背景，深色文字 |
| dark | 深色背景，白色文字 |
| primary | 主色调背景，白色文字 |
| brand | 品牌渐变背景，白色文字 |

#### 特性

1. **可折叠侧边栏**：支持展开和折叠侧边栏，优化小屏幕上的空间利用
2. **响应式设计**：在移动设备上自动调整布局
3. **自定义导航**：支持自定义导航项和子导航项
4. **固定页眉和页脚**：可选择固定页眉和页脚
5. **多语言支持**：与next-i18next集成，支持多语言
6. **自定义内容区域**：支持自定义内容区域的内边距
7. **品牌定制**：支持自定义徽标和品牌元素

#### 使用示例

```jsx
// 基本用法
<DashboardLayout>
  <DashboardContent />
</DashboardLayout>

// 不同变体
<DashboardLayout variant="default">
  <DashboardContent />
</DashboardLayout>

<DashboardLayout variant="white">
  <DashboardContent />
</DashboardLayout>

<DashboardLayout variant="gradient">
  <DashboardContent />
</DashboardLayout>

// 自定义侧边栏变体和宽度
<DashboardLayout
  sidebarVariant="dark"
  sidebarWidth="lg"
>
  <DashboardContent />
</DashboardLayout>

<DashboardLayout
  sidebarVariant="primary"
  sidebarWidth="sm"
>
  <DashboardContent />
</DashboardLayout>

// 默认折叠侧边栏
<DashboardLayout
  defaultCollapsed={true}
>
  <DashboardContent />
</DashboardLayout>

// 禁用侧边栏折叠功能
<DashboardLayout
  sidebarCollapsible={false}
>
  <DashboardContent />
</DashboardLayout>

// 自定义页眉和页脚
<DashboardLayout
  header={<CustomHeader />}
  footer={<CustomFooter />}
>
  <DashboardContent />
</DashboardLayout>

// 固定页眉和页脚
<DashboardLayout
  headerFixed={true}
  footerFixed={true}
>
  <DashboardContent />
</DashboardLayout>

// 自定义内容区域内边距
<DashboardLayout
  mainPadding="lg"
>
  <DashboardContent />
</DashboardLayout>

// 自定义导航项
<DashboardLayout
  navigationItems={[
    {
      title: "仪表盘",
      href: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "用户管理",
      href: "/dashboard/users",
      icon: <UsersIcon />,
      children: [
        {
          title: "用户列表",
          href: "/dashboard/users/list",
        },
        {
          title: "添加用户",
          href: "/dashboard/users/add",
        },
      ],
    },
    {
      title: "设置",
      href: "/dashboard/settings",
      icon: <SettingsIcon />,
    },
  ]}
>
  <DashboardContent />
</DashboardLayout>

// 完整示例
<DashboardLayout
  variant="white"
  sidebarVariant="brand"
  sidebarWidth="md"
  defaultCollapsed={false}
  sidebarCollapsible={true}
  headerFixed={true}
  footerFixed={false}
  mainPadding="md"
  logo={<CustomLogo />}
  header={<CustomHeader />}
  footer={<CustomFooter />}
  navigationItems={customNavigationItems}
>
  <DashboardContent />
</DashboardLayout>
```

#### 后端集成考虑

1. **用户导航权限**：后端应提供导航权限API，以便前端可以根据用户的角色和权限显示适当的导航项。

```json
{
  "navigation": {
    "items": [
      {
        "id": "dashboard",
        "title": "仪表盘",
        "href": "/dashboard",
        "icon": "dashboard",
        "permissions": ["user", "admin"]
      },
      {
        "id": "users",
        "title": "用户管理",
        "href": "/dashboard/users",
        "icon": "users",
        "permissions": ["admin"],
        "children": [
          {
            "id": "users-list",
            "title": "用户列表",
            "href": "/dashboard/users/list",
            "permissions": ["admin"]
          },
          {
            "id": "users-add",
            "title": "添加用户",
            "href": "/dashboard/users/add",
            "permissions": ["admin"]
          }
        ]
      }
    ]
  }
}
```

2. **用户界面偏好**：后端应提供用户界面偏好API，以便前端可以根据用户的偏好设置显示适当的界面。

```json
{
  "uiPreferences": {
    "sidebarCollapsed": false,
    "sidebarVariant": "default",
    "theme": "light",
    "density": "comfortable"
  }
}
```

3. **通知系统**：后端应提供通知API，以便前端可以在顶部导航栏中显示用户的通知。

```json
{
  "notifications": {
    "unread": 5,
    "items": [
      {
        "id": "notification-1",
        "title": "新消息",
        "description": "您有一条新消息",
        "time": "2023-01-01T12:00:00Z",
        "read": false,
        "type": "message"
      }
    ]
  }
}
```

4. **用户资料**：后端应提供用户资料API，以便前端可以在顶部导航栏中显示用户的资料信息。

```json
{
  "user": {
    "id": "user-1",
    "name": "张三",
    "email": "zhangsan@example.com",
    "avatar": "/api/users/user-1/avatar",
    "role": "admin"
  }
}
```

DashboardLayout组件提供了一种灵活且用户友好的方式来创建应用程序的主要界面布局，确保品牌一致性和良好的用户体验。通过与后端良好的集成，可以根据用户的角色、权限和偏好动态调整界面的外观和行为。
