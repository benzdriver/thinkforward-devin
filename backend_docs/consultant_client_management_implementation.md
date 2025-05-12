# 顾问客户管理模块实现文档

## 概述

顾问客户管理模块为顾问提供了全面的客户管理功能，包括客户信息管理、标签分类、笔记记录和活动跟踪。该模块旨在帮助顾问更有效地管理其客户关系，提高服务质量和工作效率。

## 数据模型

### Client 模型

客户模型存储顾问的客户基本信息。

**主要字段**：
- `userId`: 关联用户ID（如果客户已注册系统）
- `firstName`, `lastName`, `displayName`: 客户姓名信息
- `email`, `phone`: 联系方式
- `avatar`: 头像URL
- `status`: 客户状态（活跃、非活跃、待处理、已归档）
- `assignedConsultantId`: 分配的顾问ID
- `lastContactDate`: 最后联系日期
- `source`: 客户来源
- `address`: 地址信息（街道、城市、州/省、邮编、国家）
- `notes`: 一般备注
- `metadata`: 额外元数据

**主要方法**：
- `getClientsByConsultant`: 获取顾问的所有客户
- `getClientStats`: 获取客户统计数据
- `searchClients`: 搜索客户
- `updateStatus`: 更新客户状态
- `updateLastContactDate`: 更新最后联系日期
- `assignConsultant`: 分配顾问

### ClientTag 模型

客户标签模型用于对客户进行分类和标记。

**主要字段**：
- `clientId`: 关联的客户ID
- `tag`: 标签名称
- `color`: 标签颜色
- `createdBy`: 创建者ID

**主要方法**：
- `getClientTags`: 获取客户的所有标签
- `getConsultantTags`: 获取顾问使用的所有标签
- `findClientsByTag`: 根据标签查找客户
- `addTag`: 添加标签
- `removeTag`: 移除标签
- `addTagsToClients`: 批量为客户添加标签

### ClientNote 模型

客户笔记模型用于记录与客户相关的笔记和备忘。

**主要字段**：
- `clientId`: 关联的客户ID
- `consultantId`: 顾问ID
- `content`: 笔记内容
- `isPrivate`: 是否私密
- `category`: 笔记类别（一般、会议、电话、邮件、文档、申请、其他）
- `pinned`: 是否置顶

**主要方法**：
- `getClientNotes`: 获取客户的所有笔记
- `getConsultantNotes`: 获取顾问的所有笔记
- `getNoteStats`: 获取笔记统计数据
- `searchNotes`: 搜索笔记
- `addNote`: 添加笔记
- `updateContent`: 更新笔记内容
- `togglePrivate`: 切换私密状态
- `togglePinned`: 切换置顶状态
- `changeCategory`: 更改笔记类别

### ClientActivity 模型

客户活动模型用于记录与客户相关的所有活动历史。

**主要字段**：
- `clientId`: 关联的客户ID
- `consultantId`: 顾问ID
- `type`: 活动类型（资料更新、添加笔记、上传文档、发送邮件等）
- `description`: 活动描述
- `metadata`: 活动元数据
- `relatedId`: 关联实体ID
- `relatedType`: 关联实体类型
- `isRead`: 是否已读

**主要方法**：
- `logActivity`: 记录活动
- `getClientActivities`: 获取客户的所有活动
- `getConsultantClientActivities`: 获取顾问的客户活动
- `getUnreadCount`: 获取未读活动数量
- `markAsRead`: 标记为已读
- `markAllAsRead`: 标记所有为已读
- `getActivityStats`: 获取活动统计数据
- `getRecentActivities`: 获取最近活动
- `getActivitiesByType`: 按类型获取活动
- `getActivitiesByRelatedEntity`: 按关联实体获取活动

## 服务层

### consultantClientService

顾问客户服务提供了客户管理的核心业务逻辑。

**主要功能**：
- `getClients`: 获取客户列表，支持分页、排序和筛选
- `getClientStats`: 获取客户统计数据
- `getClientById`: 获取单个客户详情
- `createClient`: 创建新客户
- `updateClient`: 更新客户信息
- `deleteClient`: 删除客户
- `addClientTag`: 添加客户标签
- `removeClientTag`: 移除客户标签
- `addClientNote`: 添加客户笔记
- `getClientNotes`: 获取客户笔记
- `addClientActivity`: 记录客户活动
- `getClientActivities`: 获取客户活动
- `searchClients`: 搜索客户
- `getConsultantTags`: 获取顾问的所有标签
- `findClientsByTag`: 根据标签查找客户

## 控制器层

### consultantClientController

顾问客户控制器处理HTTP请求并调用相应的服务方法。

**主要端点**：
- `getClients`: 获取客户列表
- `getClientStats`: 获取客户统计数据
- `getClientById`: 获取单个客户详情
- `createClient`: 创建新客户
- `updateClient`: 更新客户信息
- `deleteClient`: 删除客户
- `addClientTag`: 添加客户标签
- `removeClientTag`: 移除客户标签
- `addClientNote`: 添加客户笔记
- `getClientNotes`: 获取客户笔记
- `getClientActivities`: 获取客户活动
- `searchClients`: 搜索客户
- `getConsultantTags`: 获取顾问的所有标签
- `findClientsByTag`: 根据标签查找客户

## 路由层

### consultantClientRoutes

顾问客户路由定义了API端点和相应的控制器方法。

**主要路由**：
- `GET /api/consultant/:consultantId/clients`: 获取客户列表
- `GET /api/consultant/:consultantId/clients/stats`: 获取客户统计数据
- `GET /api/consultant/:consultantId/clients/:clientId`: 获取单个客户详情
- `POST /api/consultant/:consultantId/clients`: 创建新客户
- `PATCH /api/consultant/:consultantId/clients/:clientId`: 更新客户信息
- `DELETE /api/consultant/:consultantId/clients/:clientId`: 删除客户
- `POST /api/consultant/:consultantId/clients/:clientId/tags`: 添加客户标签
- `DELETE /api/consultant/:consultantId/clients/:clientId/tags/:tag`: 移除客户标签
- `POST /api/consultant/:consultantId/clients/:clientId/notes`: 添加客户笔记
- `GET /api/consultant/:consultantId/clients/:clientId/notes`: 获取客户笔记
- `GET /api/consultant/:consultantId/clients/:clientId/activities`: 获取客户活动
- `GET /api/consultant/:consultantId/clients/search`: 搜索客户
- `GET /api/consultant/:consultantId/tags`: 获取顾问的所有标签
- `GET /api/consultant/:consultantId/clients/by-tag`: 根据标签查找客户

## 数据流

1. 顾问通过前端界面发起客户管理相关请求
2. 请求通过路由层被定向到相应的控制器方法
3. 控制器方法验证请求参数并调用服务层方法
4. 服务层方法执行业务逻辑并与数据模型交互
5. 数据模型执行数据库操作并返回结果
6. 结果通过服务层和控制器层返回给前端

## 安全考虑

- 所有路由都需要通过`verifyToken`中间件进行身份验证
- 客户数据访问受到权限控制，确保顾问只能访问分配给他们的客户
- 私密笔记只对创建者可见
- 客户活动记录提供了完整的审计跟踪

## 性能优化

- 客户列表支持分页和筛选，避免一次加载过多数据
- 使用索引优化查询性能，特别是对客户搜索和标签查询
- 客户统计数据使用聚合查询高效计算

## 扩展性

该模块设计考虑了未来的扩展需求：

- 客户模型包含`metadata`字段，可存储额外的自定义数据
- 活动记录系统支持多种活动类型，可轻松添加新类型
- 标签系统支持自定义颜色和分类
