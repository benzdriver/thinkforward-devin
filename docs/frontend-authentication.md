# ThinkForward AI 前端认证系统文档

本文档详细描述了ThinkForward AI前端应用中的认证系统实现，包括认证上下文、钩子、高阶组件以及与后端的集成考虑。

## 目录

1. [认证系统概述](#认证系统概述)
2. [认证上下文（AuthContext）](#认证上下文authcontext)
3. [认证提供者（AuthProvider）](#认证提供者authprovider)
4. [认证钩子（useAuth）](#认证钩子useauth)
5. [受保护路由高阶组件（withAuth）](#受保护路由高阶组件withauth)
6. [基于角色的访问控制（withRole）](#基于角色的访问控制withrole)
7. [令牌刷新机制](#令牌刷新机制)
8. [后端集成考虑](#后端集成考虑)

---

### 认证系统概述

ThinkForward AI前端应用的认证系统基于React上下文（Context）和Zustand状态管理库实现。该系统提供了完整的认证功能，包括登录、注册、注销、令牌刷新、受保护路由和基于角色的访问控制。

认证系统的主要组件包括：

1. **AuthContext**：提供认证状态和方法的React上下文
2. **AuthProvider**：包装应用程序并提供认证功能的提供者组件
3. **useAuth**：用于消费认证上下文的自定义钩子
4. **withAuth**：用于创建受保护路由的高阶组件
5. **withRole**：用于基于角色的访问控制的高阶组件
6. **useAuthStore**：使用Zustand实现的认证状态存储

### 认证上下文（AuthContext）

认证上下文（AuthContext）是一个React上下文，用于在组件树中共享认证状态和方法。它包含以下内容：

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetError: () => void;
  refreshToken: () => Promise<boolean>;
}
```

### 认证提供者（AuthProvider）

认证提供者（AuthProvider）是一个React组件，用于包装应用程序并提供认证功能。它使用Zustand认证存储（useAuthStore）来管理认证状态，并提供额外的功能，如令牌刷新和路由保护。

```jsx
// 在应用程序入口点使用AuthProvider
<AuthProvider>
  <App />
</AuthProvider>
```

认证提供者的主要功能包括：

1. **路由保护**：检查用户是否已认证，如果未认证且尝试访问受保护的路由，则重定向到登录页面
2. **令牌刷新**：定期刷新认证令牌，以保持用户的登录状态
3. **提供认证状态和方法**：通过上下文提供认证状态和方法，供组件使用

### 认证钩子（useAuth）

认证钩子（useAuth）是一个自定义钩子，用于在组件中访问认证上下文。它提供了一种简单的方式来获取认证状态和方法。

```jsx
// 在组件中使用useAuth钩子
const { user, isAuthenticated, login, logout } = useAuth();

// 使用认证状态和方法
if (isAuthenticated) {
  return <div>欢迎，{user.name}！<button onClick={logout}>注销</button></div>;
} else {
  return <button onClick={() => login('user@example.com', 'password')}>登录</button>;
}
```

### 受保护路由高阶组件（withAuth）

受保护路由高阶组件（withAuth）是一个高阶组件，用于创建受保护的路由。它检查用户是否已认证，如果未认证，则重定向到登录页面。

```jsx
// 创建受保护的路由
const ProtectedDashboard = withAuth(Dashboard);

// 在路由配置中使用
<Route path="/dashboard" element={<ProtectedDashboard />} />
```

withAuth高阶组件的主要功能包括：

1. **认证检查**：检查用户是否已认证
2. **加载状态**：在检查认证状态时显示加载状态
3. **重定向**：如果用户未认证，则重定向到登录页面，并保存当前URL作为返回URL

### 基于角色的访问控制（withRole）

基于角色的访问控制高阶组件（withRole）是一个高阶组件，用于创建基于角色的受保护路由。它检查用户是否具有所需的角色，如果没有，则重定向到仪表盘页面。

```jsx
// 创建基于角色的受保护路由
const AdminDashboard = withRole(Dashboard, ['admin']);

// 在路由配置中使用
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

withRole高阶组件的主要功能包括：

1. **角色检查**：检查用户是否具有所需的角色
2. **认证检查**：检查用户是否已认证
3. **加载状态**：在检查认证状态和角色时显示加载状态
4. **重定向**：如果用户未认证，则重定向到登录页面；如果用户没有所需的角色，则重定向到仪表盘页面

### 令牌刷新机制

令牌刷新机制是认证系统的一个重要部分，用于保持用户的登录状态。它定期刷新认证令牌，以防止令牌过期导致用户被注销。

令牌刷新机制的主要功能包括：

1. **定期刷新**：每15分钟自动刷新一次令牌
2. **错误处理**：如果刷新失败，则注销用户
3. **状态管理**：在刷新过程中管理加载状态

```jsx
// 在AuthProvider中实现的令牌刷新逻辑
useEffect(() => {
  // 只有在已认证时才设置刷新间隔
  if (!authState.isAuthenticated) return;
  
  // 每15分钟刷新一次令牌
  const refreshInterval = setInterval(async () => {
    await refreshToken();
  }, 15 * 60 * 1000); // 15分钟
  
  // 清理
  return () => {
    clearInterval(refreshInterval);
  };
}, [authState.isAuthenticated]);
```

### 认证页面实现

ThinkForward AI前端应用包含以下认证相关页面：

1. **登录页面（Login Page）**：
   - 路径：`/auth/login`
   - 功能：用户使用邮箱和密码登录系统
   - 表单验证：使用Zod进行表单验证
   - 特性：
     - 记住我选项
     - 错误提示
     - 忘记密码链接
     - 注册账号链接
     - 登录成功后重定向到之前尝试访问的页面或仪表盘

2. **注册页面（Register Page）**：
   - 路径：`/auth/register`
   - 功能：新用户创建账号
   - 表单验证：使用Zod进行表单验证
   - 特性：
     - 用户名、邮箱、密码和确认密码字段
     - 服务条款和隐私政策同意选项
     - 错误提示
     - 已有账号登录链接
     - 注册成功后重定向到登录页面

3. **忘记密码页面（Forgot Password Page）**：
   - 路径：`/auth/forgot-password`
   - 功能：用户请求密码重置链接
   - 表单验证：使用Zod进行表单验证
   - 特性：
     - 邮箱字段
     - 错误提示
     - 成功提示
     - 返回登录页面链接
     - 发送重置链接到用户邮箱

4. **密码重置页面（Reset Password Page）**：
   - 路径：`/auth/reset-password`
   - 功能：用户通过重置链接设置新密码
   - 表单验证：使用Zod进行表单验证
   - 特性：
     - 新密码和确认密码字段
     - 错误提示
     - 成功提示
     - 返回登录页面链接
     - 验证重置令牌有效性

所有认证页面都使用`AuthLayout`组件，该组件提供了一致的布局和样式，包括侧边栏内容区域和主要内容区域。认证页面还集成了国际化支持，使用`next-i18next`库实现多语言支持。

### 后端集成考虑

前端认证系统需要与后端认证API进行集成，以实现完整的认证功能。以下是后端需要提供的API和数据格式：

1. **登录API**：用于用户登录

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

响应：

```json
{
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "用户名",
    "role": "client"
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

2. **注册API**：用于用户注册

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "name": "用户名"
}
```

响应：

```json
{
  "user": {
    "id": "user-2",
    "email": "user@example.com",
    "name": "用户名",
    "role": "client"
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

3. **令牌刷新API**：用于刷新认证令牌

```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

响应：

```json
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

4. **注销API**：用于用户注销

```
POST /api/auth/logout
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

响应：

```json
{
  "success": true
}
```

5. **用户信息API**：用于获取当前用户信息

```
GET /api/auth/me
Authorization: Bearer jwt-token
```

响应：

```json
{
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "用户名",
    "role": "client",
    "profile": {
      "avatar": "/api/users/user-1/avatar",
      "phone": "1234567890",
      "address": "地址"
    },
    "permissions": [
      "dashboard:view",
      "profile:edit",
      "documents:upload"
    ]
  }
}
```

6. **密码重置API**：用于重置用户密码

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

响应：

```json
{
  "success": true,
  "message": "密码重置链接已发送到您的邮箱"
}
```

```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "password-reset-token",
  "password": "new-password"
}
```

响应：

```json
{
  "success": true,
  "message": "密码已重置"
}
```

7. **认证配置API**：用于获取认证系统配置

```
GET /api/auth/config
```

响应：

```json
{
  "authMethods": ["password", "google", "apple"],
  "passwordPolicy": {
    "minLength": 8,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumber": true,
    "requireSpecialChar": true
  },
  "tokenExpiry": {
    "access": 3600,
    "refresh": 604800
  },
  "socialLogin": {
    "google": {
      "clientId": "google-client-id",
      "redirectUri": "/api/auth/google/callback"
    },
    "apple": {
      "clientId": "apple-client-id",
      "redirectUri": "/api/auth/apple/callback"
    }
  }
}
```

前端认证系统通过与这些后端API的集成，实现了完整的认证功能，包括登录、注册、注销、令牌刷新、密码重置等。后端需要提供符合上述格式的API，以确保前端认证系统能够正常工作。

在实际实现中，前端会使用React Query或类似的库来处理API请求，并使用Zustand来管理认证状态。这种组合提供了高效的状态管理和数据获取能力，使认证系统更加可靠和易于维护。
