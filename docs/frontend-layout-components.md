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

### PageHeader 页面标题和描述

PageHeader 页面标题和描述组件用于创建统一的页面标题区域，包括标题、描述、面包屑导航和操作按钮。该组件提供了灵活的配置选项，包括不同的视觉样式、大小和对齐方式。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认无背景和边框 | 简洁的页面标题 |
| bordered | 底部带有边框 | 视觉上分隔页面标题和内容 |
| filled | 浅灰色背景和圆角 | 更突出的页面标题 |
| gradient | 渐变背景和圆角 | 更具视觉吸引力的页面标题 |

#### 大小

| 大小名 | 描述 |
|--------|------|
| sm | 小尺寸，适合简单页面 |
| md | 中等尺寸，适合大多数页面 |
| lg | 大尺寸，适合重要页面 |

#### 对齐方式

| 对齐名 | 描述 |
|--------|------|
| left | 左对齐（默认） |
| center | 居中对齐 |
| right | 右对齐 |

#### 特性

1. **面包屑导航**：支持显示面包屑导航，帮助用户了解当前页面在网站结构中的位置
2. **返回链接**：支持显示返回链接，方便用户返回上一级页面
3. **操作按钮**：支持在标题右侧显示操作按钮，如添加、编辑、删除等
4. **徽章**：支持在标题旁边显示徽章，如状态、数量等
5. **图标**：支持在标题前显示图标
6. **响应式设计**：在移动设备上自动调整布局
7. **多语言支持**：与next-i18next集成，支持多语言

#### 使用示例

```jsx
// 基本用法
<PageHeader
  title="用户管理"
  description="管理系统中的所有用户"
/>

// 不同变体
<PageHeader
  variant="default"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  variant="bordered"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  variant="filled"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  variant="gradient"
  title="用户管理"
  description="管理系统中的所有用户"
/>

// 不同大小
<PageHeader
  size="sm"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  size="md"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  size="lg"
  title="用户管理"
  description="管理系统中的所有用户"
/>

// 不同对齐方式
<PageHeader
  align="left"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  align="center"
  title="用户管理"
  description="管理系统中的所有用户"
/>

<PageHeader
  align="right"
  title="用户管理"
  description="管理系统中的所有用户"
/>

// 带面包屑导航
<PageHeader
  title="用户详情"
  description="查看和编辑用户详细信息"
  breadcrumbs={[
    { label: "仪表盘", href: "/dashboard" },
    { label: "用户管理", href: "/dashboard/users" },
    { label: "用户详情" }
  ]}
/>

// 带返回链接
<PageHeader
  title="用户详情"
  description="查看和编辑用户详细信息"
  backLink={{
    href: "/dashboard/users",
    label: "返回用户列表"
  }}
/>

// 带操作按钮
<PageHeader
  title="用户管理"
  description="管理系统中的所有用户"
  actions={
    <>
      <Button variant="outline">导出</Button>
      <Button>添加用户</Button>
    </>
  }
/>

// 带徽章
<PageHeader
  title="用户管理"
  description="管理系统中的所有用户"
  badge={<Badge variant="success">活跃</Badge>}
/>

// 带图标
<PageHeader
  title="用户管理"
  description="管理系统中的所有用户"
  icon={<UsersIcon className="w-8 h-8 text-primary-500" />}
/>

// 完整示例
<PageHeader
  variant="filled"
  size="md"
  align="left"
  title="用户详情"
  description="查看和编辑用户详细信息"
  breadcrumbs={[
    { label: "仪表盘", href: "/dashboard" },
    { label: "用户管理", href: "/dashboard/users" },
    { label: "用户详情" }
  ]}
  actions={
    <>
      <Button variant="outline">删除</Button>
      <Button>编辑</Button>
    </>
  }
  badge={<Badge variant="success">活跃</Badge>}
  icon={<UserIcon className="w-8 h-8 text-primary-500" />}
/>
```

#### 后端集成考虑

1. **页面元数据**：后端应提供页面元数据API，以便前端可以根据页面ID或路径获取适当的标题、描述等信息。

```json
{
  "pageMetadata": {
    "dashboard": {
      "title": "仪表盘",
      "description": "查看系统概览和关键指标",
      "icon": "dashboard",
      "permissions": ["user", "admin"]
    },
    "users": {
      "title": "用户管理",
      "description": "管理系统中的所有用户",
      "icon": "users",
      "permissions": ["admin"],
      "actions": [
        {
          "id": "export-users",
          "label": "导出",
          "icon": "download",
          "variant": "outline",
          "permissions": ["admin"]
        },
        {
          "id": "add-user",
          "label": "添加用户",
          "icon": "plus",
          "variant": "primary",
          "permissions": ["admin"]
        }
      ]
    }
  }
}
```

2. **面包屑导航**：后端应提供面包屑导航API，以便前端可以根据当前页面路径生成适当的面包屑导航。

```json
{
  "breadcrumbs": {
    "/dashboard/users/123": [
      {
        "label": "仪表盘",
        "href": "/dashboard"
      },
      {
        "label": "用户管理",
        "href": "/dashboard/users"
      },
      {
        "label": "用户详情"
      }
    ]
  }
}
```

3. **用户权限**：后端应提供用户权限API，以便前端可以根据用户的权限显示或隐藏特定的操作按钮。

```json
{
  "permissions": {
    "users": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false,
      "export": true
    }
  }
}
```

4. **动态内容**：后端应提供动态内容API，以便前端可以根据上下文显示适当的徽章、状态等信息。

```json
{
  "entityStatus": {
    "user-123": {
      "status": "active",
      "statusLabel": "活跃",
      "statusVariant": "success",
      "lastActive": "2023-01-01T12:00:00Z"
    }
  }
}
```

PageHeader组件提供了一种统一且用户友好的方式来创建页面标题区域，确保整个应用程序的一致性和良好的用户体验。通过与后端良好的集成，可以根据页面上下文、用户权限和系统配置动态调整页面标题区域的内容和行为。

### SectionContainer 内容区块容器

SectionContainer 内容区块容器组件用于创建统一的内容区块，包括标题、描述、内容区域和页脚。该组件提供了灵活的配置选项，包括不同的视觉样式、内边距和宽度。

#### 变体

| 变体名 | 描述 | 用途 |
|--------|------|------|
| default | 默认白色背景 | 简洁的内容区块 |
| filled | 浅灰色背景 | 突出显示的内容区块 |
| bordered | 带边框和圆角 | 视觉上分隔的内容区块 |
| card | 带边框、圆角和阴影 | 卡片式内容区块 |
| highlight | 主色调浅色背景和边框 | 强调重要内容 |

#### 内边距

| 内边距名 | 描述 |
|----------|------|
| none | 无内边距 |
| sm | 小内边距 (16px) |
| md | 中等内边距 (24px) |
| lg | 大内边距 (32px) |
| xl | 超大内边距 (48px) |

#### 外边距

| 外边距名 | 描述 |
|----------|------|
| none | 无外边距 |
| sm | 小外边距 (16px) |
| md | 中等外边距 (24px) |
| lg | 大外边距 (32px) |
| xl | 超大外边距 (48px) |

#### 宽度

| 宽度名 | 描述 |
|--------|------|
| full | 全宽 |
| container | 最大宽度为7xl，居中 |
| narrow | 最大宽度为3xl，居中 |
| wide | 最大宽度为屏幕2xl，居中 |

#### 特性

1. **标题和描述**：支持显示区块标题和描述
2. **标题操作按钮**：支持在标题右侧显示操作按钮
3. **页脚**：支持显示页脚内容
4. **分隔线**：支持在内容项之间、标题和内容之间、内容和页脚之间显示分隔线
5. **自定义样式**：支持自定义标题、描述、内容和页脚的样式
6. **响应式设计**：在移动设备上自动调整布局
7. **灵活的内容区域**：支持任何类型的内容

#### 使用示例

```jsx
// 基本用法
<SectionContainer>
  <p>这是一个基本的内容区块</p>
</SectionContainer>

// 不同变体
<SectionContainer variant="default">
  <p>这是一个默认的内容区块</p>
</SectionContainer>

<SectionContainer variant="filled">
  <p>这是一个填充背景的内容区块</p>
</SectionContainer>

<SectionContainer variant="bordered">
  <p>这是一个带边框的内容区块</p>
</SectionContainer>

<SectionContainer variant="card">
  <p>这是一个卡片式的内容区块</p>
</SectionContainer>

<SectionContainer variant="highlight">
  <p>这是一个强调的内容区块</p>
</SectionContainer>

// 不同内边距
<SectionContainer padding="none">
  <p>这是一个无内边距的内容区块</p>
</SectionContainer>

<SectionContainer padding="sm">
  <p>这是一个小内边距的内容区块</p>
</SectionContainer>

<SectionContainer padding="md">
  <p>这是一个中等内边距的内容区块</p>
</SectionContainer>

<SectionContainer padding="lg">
  <p>这是一个大内边距的内容区块</p>
</SectionContainer>

<SectionContainer padding="xl">
  <p>这是一个超大内边距的内容区块</p>
</SectionContainer>

// 不同外边距
<SectionContainer margin="none">
  <p>这是一个无外边距的内容区块</p>
</SectionContainer>

<SectionContainer margin="sm">
  <p>这是一个小外边距的内容区块</p>
</SectionContainer>

<SectionContainer margin="md">
  <p>这是一个中等外边距的内容区块</p>
</SectionContainer>

<SectionContainer margin="lg">
  <p>这是一个大外边距的内容区块</p>
</SectionContainer>

<SectionContainer margin="xl">
  <p>这是一个超大外边距的内容区块</p>
</SectionContainer>

// 不同宽度
<SectionContainer width="full">
  <p>这是一个全宽的内容区块</p>
</SectionContainer>

<SectionContainer width="container">
  <p>这是一个容器宽度的内容区块</p>
</SectionContainer>

<SectionContainer width="narrow">
  <p>这是一个窄宽度的内容区块</p>
</SectionContainer>

<SectionContainer width="wide">
  <p>这是一个宽宽度的内容区块</p>
</SectionContainer>

// 带标题和描述
<SectionContainer
  title="用户统计"
  description="查看系统中的用户统计数据"
>
  <UserStatsChart />
</SectionContainer>

// 带标题操作按钮
<SectionContainer
  title="用户统计"
  description="查看系统中的用户统计数据"
  headerActions={
    <>
      <Button variant="outline">导出</Button>
      <Button>刷新</Button>
    </>
  }
>
  <UserStatsChart />
</SectionContainer>

// 带页脚
<SectionContainer
  title="用户统计"
  description="查看系统中的用户统计数据"
  footer={
    <div className="flex justify-between items-center">
      <p className="text-sm text-neutral-500">上次更新: 2023-01-01</p>
      <Button variant="link">查看更多</Button>
    </div>
  }
>
  <UserStatsChart />
</SectionContainer>

// 带分隔线
<SectionContainer
  title="用户统计"
  description="查看系统中的用户统计数据"
  headerDivider={true}
  footerDivider={true}
  footer={
    <div className="flex justify-between items-center">
      <p className="text-sm text-neutral-500">上次更新: 2023-01-01</p>
      <Button variant="link">查看更多</Button>
    </div>
  }
>
  <UserStatsChart />
</SectionContainer>

// 内容项之间的分隔线
<SectionContainer
  title="最近活动"
  description="查看最近的系统活动"
  divider={true}
>
  <div className="py-4">活动 1: 用户登录</div>
  <div className="py-4">活动 2: 文件上传</div>
  <div className="py-4">活动 3: 设置更改</div>
</SectionContainer>

// 完整示例
<SectionContainer
  variant="card"
  padding="lg"
  margin="md"
  width="container"
  title="用户统计"
  description="查看系统中的用户统计数据"
  titleClassName="text-primary-600"
  descriptionClassName="text-neutral-600"
  headerClassName="bg-neutral-50 rounded-t-lg"
  contentClassName="space-y-4"
  headerActions={
    <>
      <Button variant="outline">导出</Button>
      <Button>刷新</Button>
    </>
  }
  headerDivider={true}
  footerDivider={true}
  footer={
    <div className="flex justify-between items-center">
      <p className="text-sm text-neutral-500">上次更新: 2023-01-01</p>
      <Button variant="link">查看更多</Button>
    </div>
  }
  id="user-stats-section"
>
  <UserStatsChart />
  <UserStatsTable />
</SectionContainer>
```

#### 后端集成考虑

1. **内容区块配置**：后端应提供内容区块配置API，以便前端可以根据区块ID或类型获取适当的标题、描述等信息。

```json
{
  "sections": {
    "user-stats": {
      "title": "用户统计",
      "description": "查看系统中的用户统计数据",
      "variant": "card",
      "permissions": ["admin"],
      "actions": [
        {
          "id": "export-stats",
          "label": "导出",
          "icon": "download",
          "variant": "outline",
          "permissions": ["admin"]
        },
        {
          "id": "refresh-stats",
          "label": "刷新",
          "icon": "refresh",
          "variant": "primary",
          "permissions": ["admin"]
        }
      ]
    },
    "recent-activities": {
      "title": "最近活动",
      "description": "查看最近的系统活动",
      "variant": "default",
      "permissions": ["user", "admin"],
      "divider": true
    }
  }
}
```

2. **内容数据**：后端应提供内容数据API，以便前端可以获取区块内容的数据。

```json
{
  "sectionData": {
    "user-stats": {
      "totalUsers": 1250,
      "activeUsers": 780,
      "newUsers": 45,
      "userGrowth": 12.5,
      "lastUpdated": "2023-01-01T12:00:00Z",
      "chartData": [
        { "date": "2023-01-01", "users": 1200 },
        { "date": "2023-01-02", "users": 1220 },
        { "date": "2023-01-03", "users": 1250 }
      ]
    },
    "recent-activities": {
      "activities": [
        {
          "id": "activity-1",
          "type": "login",
          "user": "张三",
          "time": "2023-01-01T12:00:00Z",
          "details": "从192.168.1.1登录"
        },
        {
          "id": "activity-2",
          "type": "upload",
          "user": "李四",
          "time": "2023-01-01T11:30:00Z",
          "details": "上传了文件'report.pdf'"
        }
      ]
    }
  }
}
```

3. **用户权限**：后端应提供用户权限API，以便前端可以根据用户的权限显示或隐藏特定的内容区块或操作按钮。

```json
{
  "permissions": {
    "sections": {
      "user-stats": {
        "view": true,
        "export": true,
        "refresh": true
      },
      "recent-activities": {
        "view": true
      }
    }
  }
}
```

4. **布局配置**：后端应提供布局配置API，以便前端可以根据用户偏好或系统配置调整内容区块的布局。

```json
{
  "layout": {
    "dashboard": {
      "sections": [
        {
          "id": "user-stats",
          "width": "full",
          "order": 1
        },
        {
          "id": "recent-activities",
          "width": "half",
          "order": 2
        }
      ]
    }
  }
}
```

SectionContainer组件提供了一种灵活且用户友好的方式来创建内容区块，确保整个应用程序的一致性和良好的用户体验。通过与后端良好的集成，可以根据用户权限、系统配置和内容类型动态调整内容区块的外观和行为。
