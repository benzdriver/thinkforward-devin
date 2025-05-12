# 管理员用户管理页面

## 概述

管理员用户管理页面提供了一个全面的界面，用于管理系统中的所有用户。管理员可以查看、搜索、过滤、添加、编辑和删除用户，以及管理用户角色和状态。

## 技术实现

### 页面组件

- 位置：`/frontend/pages/admin/users.tsx`
- 路由：`/admin/users`
- 布局：使用 `DashboardLayout` 组件

### 状态管理

- 使用 Zustand 存储：`useAdminUsersStore`
- 位置：`/frontend/lib/store/zustand/useAdminUsersStore.ts`
- 主要状态：
  - 用户列表
  - 过滤条件
  - 分页信息
  - 选中的用户
  - 模态框状态

### API 服务

- 位置：`/frontend/lib/api/services/admin-users.ts`
- 主要功能：
  - 获取用户列表
  - 邀请新用户
  - 删除用户
  - 更新用户信息
  - 获取用户详情
  - 获取用户活动日志
  - 重置用户密码
  - 锁定/解锁用户账户
  - 获取用户统计数据

## 功能特性

### 用户列表

- 显示所有用户的表格视图
- 包含用户名、邮箱、角色、状态和加入日期等信息
- 支持分页浏览
- 支持按角色和状态进行标签页切换

### 搜索和过滤

- 支持按用户名和邮箱搜索
- 支持按角色（管理员、顾问、客户）过滤
- 支持按状态（活跃、非活跃、待定）过滤
- 支持按创建日期范围过滤

### 批量操作

- 支持选择多个用户进行批量操作
- 批量操作包括：激活、停用和删除

### 用户邀请

- 通过邮箱邀请新用户
- 支持一次邀请多个用户
- 可以指定被邀请用户的角色

### 用户编辑

- 编辑用户基本信息
- 更改用户角色
- 更改用户状态

### 用户删除

- 支持删除单个或多个用户
- 删除前有确认提示

## 数据模型

### 用户（User）

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'consultant' | 'client';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  metadata?: Record<string, any>;
}
```

### 过滤条件（UserFilters）

```typescript
interface UserFilters {
  search: string;
  role: UserRole | null;
  status: 'active' | 'inactive' | 'pending' | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
```

### 分页（Pagination）

```typescript
interface Pagination {
  page: number;
  limit: number;
  total: number;
}
```

## 国际化

页面支持多语言，使用 `next-i18next` 实现。所有文本内容都通过翻译键获取，支持切换语言。

## 响应式设计

页面设计响应式，适配不同屏幕尺寸：
- 在移动设备上，过滤器和搜索框垂直排列
- 在桌面设备上，过滤器和搜索框水平排列
- 表格在小屏幕上可以水平滚动

## 安全考虑

- 页面仅对具有管理员权限的用户可见
- 敏感操作（如删除用户）需要确认
- 用户密码重置通过安全链接实现，不直接在管理界面设置密码

## 后端 API 需求

### 获取用户列表

```
GET /api/admin/users
```

参数：
- `page`: 页码
- `limit`: 每页数量
- `search`: 搜索关键词
- `role`: 角色过滤
- `status`: 状态过滤
- `startDate`: 开始日期
- `endDate`: 结束日期
- `sortBy`: 排序字段
- `sortOrder`: 排序方向

### 邀请用户

```
POST /api/admin/users/invite
```

请求体：
```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "role": "client"
}
```

### 删除用户

```
DELETE /api/admin/users
```

请求体：
```json
{
  "userIds": ["user-id-1", "user-id-2"]
}
```

### 更新用户

```
PATCH /api/admin/users
```

请求体：
```json
{
  "userIds": ["user-id-1", "user-id-2"],
  "updates": {
    "status": "inactive"
  }
}
```

### 获取用户详情

```
GET /api/admin/users/:userId
```

### 获取用户活动日志

```
GET /api/admin/users/:userId/activity
```

参数：
- `page`: 页码
- `limit`: 每页数量

### 重置用户密码

```
POST /api/admin/users/:userId/reset-password
```

### 锁定/解锁用户账户

```
PATCH /api/admin/users/:userId/lock
```

请求体：
```json
{
  "locked": true
}
```

### 获取用户统计数据

```
GET /api/admin/users/stats
```

## 未来扩展

- 添加用户详情页面，显示更多用户信息和活动历史
- 实现用户导入/导出功能
- 添加用户组管理功能
- 实现更细粒度的权限控制
