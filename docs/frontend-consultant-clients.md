# 顾问客户管理页面技术规范

## 概述

顾问客户管理页面是顾问用户管理其所有客户的中心界面。该页面提供客户列表、搜索和筛选功能，以及客户详细信息的快速访问。页面设计注重高效的客户管理和快速操作。

## 页面路径

```
/consultant/clients
```

## 数据模型

### 客户信息

```typescript
interface Client {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  tags: string[];
  source: string;
  assignedConsultantId: string;
  lastContactDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### 客户列表响应

```typescript
interface ClientsListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}
```

### 客户统计数据

```typescript
interface ClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
  newClientsThisMonth: number;
  clientsBySource: {
    source: string;
    count: number;
  }[];
}
```

## 组件结构

```
ConsultantClientsPage
├── PageHeader (标题、描述和操作按钮)
│   ├── Title
│   ├── Description
│   └── ActionButtons (添加客户、导出列表等)
├── ClientsFilters
│   ├── SearchInput (搜索框)
│   ├── StatusFilter (状态筛选)
│   ├── TagsFilter (标签筛选)
│   ├── SourceFilter (来源筛选)
│   └── DateRangeFilter (日期范围筛选)
├── ClientsStats (客户统计数据)
│   ├── StatCard (总客户数)
│   ├── StatCard (活跃客户数)
│   ├── StatCard (非活跃客户数)
│   └── StatCard (待处理客户数)
├── ClientsTable
│   ├── TableHeader
│   │   └── SortableColumnHeaders
│   ├── TableBody
│   │   └── ClientRow (多个)
│   │       ├── ClientInfo (头像、姓名、邮箱等)
│   │       ├── ClientStatus
│   │       ├── ClientTags
│   │       ├── LastContactDate
│   │       └── ActionMenu (查看、编辑、删除等)
│   └── TableFooter
│       └── Pagination
└── ClientsEmptyState (无客户时显示)
```

## API 端点

### 获取客户列表

```
GET /api/consultant/{consultantId}/clients
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `status`: 客户状态筛选
- `tags`: 标签筛选 (逗号分隔)
- `source`: 来源筛选
- `startDate`: 开始日期
- `endDate`: 结束日期
- `sortBy`: 排序字段
- `sortOrder`: 排序方向 ('asc' 或 'desc')

响应:

```json
{
  "clients": [
    {
      "id": "client-123",
      "userId": "user-456",
      "firstName": "张",
      "lastName": "三",
      "displayName": "张三",
      "email": "zhangsan@example.com",
      "phone": "+86 123 4567 8901",
      "avatar": "https://example.com/avatars/zhangsan.jpg",
      "status": "active",
      "tags": ["技术移民", "高净值"],
      "source": "网站注册",
      "assignedConsultantId": "cons-123",
      "lastContactDate": "2023-05-20T14:30:00Z",
      "createdAt": "2023-01-15T08:00:00Z",
      "updatedAt": "2023-05-20T14:30:00Z"
    },
    // 更多客户...
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### 获取客户统计数据

```
GET /api/consultant/{consultantId}/clients/stats
```

响应:

```json
{
  "totalClients": 45,
  "activeClients": 32,
  "inactiveClients": 8,
  "pendingClients": 5,
  "newClientsThisMonth": 3,
  "clientsBySource": [
    {
      "source": "网站注册",
      "count": 20
    },
    {
      "source": "推荐",
      "count": 15
    },
    {
      "source": "社交媒体",
      "count": 10
    }
  ]
}
```

### 添加新客户

```
POST /api/consultant/{consultantId}/clients
```

请求体:

```json
{
  "firstName": "李",
  "lastName": "四",
  "email": "lisi@example.com",
  "phone": "+86 123 4567 8902",
  "status": "active",
  "tags": ["投资移民", "企业家"],
  "source": "推荐"
}
```

### 更新客户信息

```
PATCH /api/consultant/{consultantId}/clients/{clientId}
```

请求体:

```json
{
  "firstName": "李",
  "lastName": "四",
  "email": "lisi@example.com",
  "phone": "+86 123 4567 8902",
  "status": "inactive",
  "tags": ["投资移民", "企业家", "高净值"]
}
```

### 删除客户

```
DELETE /api/consultant/{consultantId}/clients/{clientId}
```

## 状态管理

使用Zustand创建顾问客户管理状态存储:

```typescript
interface ConsultantClientsState {
  clients: Client[];
  stats: ClientStats | null;
  filters: {
    search: string;
    status: string | null;
    tags: string[];
    source: string | null;
    startDate: string | null;
    endDate: string | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
  
  setClients: (clients: Client[]) => void;
  setStats: (stats: ClientStats) => void;
  setFilters: (filters: Partial<ConsultantClientsState['filters']>) => void;
  setPagination: (pagination: Partial<ConsultantClientsState['pagination']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  addClient: (client: Client) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  removeClient: (clientId: string) => void;
  resetFilters: () => void;
  resetState: () => void;
}
```

## 页面功能

1. **客户列表展示**：显示所有客户的列表，包括基本信息和状态
2. **搜索和筛选**：根据名称、邮箱、状态、标签等筛选客户
3. **排序**：根据不同字段对客户列表进行排序
4. **分页**：支持大量客户数据的分页浏览
5. **客户统计**：显示客户数量、状态分布等统计数据
6. **客户管理**：添加、编辑、删除客户
7. **快速操作**：直接从列表进行常见操作，如发送消息、安排预约等

## 交互设计

1. **搜索筛选**：实时搜索和筛选结果更新
2. **表格交互**：
   - 点击列标题进行排序
   - 悬停在行上显示更多操作
   - 点击客户行可展开更多详情
3. **批量操作**：选择多个客户进行批量操作，如标记状态、添加标签等
4. **拖放功能**：支持拖放客户到不同分组或状态
5. **上下文菜单**：右键点击客户显示上下文操作菜单

## 响应式设计

1. **桌面布局**：完整表格视图，显示所有列和详细信息
2. **平板布局**：简化表格，隐藏部分列，可通过展开查看
3. **移动布局**：卡片式布局替代表格，每个客户显示为一个卡片

## 实现注意事项

1. **性能优化**：
   - 虚拟滚动处理大量客户数据
   - 延迟加载客户头像和详细信息
   - 缓存已加载的客户数据
2. **数据处理**：
   - 客户端筛选和排序以减少服务器请求
   - 批量获取和更新以提高效率
3. **用户体验**：
   - 添加骨架屏减少加载感知时间
   - 实现平滑的动画和过渡效果
   - 提供清晰的反馈和确认机制
4. **错误处理**：
   - 优雅处理网络错误和数据加载失败
   - 提供重试机制和错误恢复选项
5. **国际化支持**：
   - 所有文本使用翻译键
   - 支持日期和数字的本地化格式

## 与其他页面的关联

- 从客户列表点击客户可导航到客户详情页 (`/consultant/clients/{clientId}`)
- 客户详情页包含该客户的所有相关信息、文档、预约和案例
- 从客户列表可以直接创建与客户相关的预约、任务或案例
- 客户管理页与仪表盘页面相关联，提供客户活动的概览

## 安全考虑

1. 确保只有已认证的顾问用户可以访问客户管理页面
2. 实现适当的权限检查，确保顾问只能看到自己的客户
3. 保护敏感客户信息，遵循数据保护规定
4. 实现操作日志记录，跟踪对客户数据的所有更改

## 后端数据库设计建议

为支持客户管理功能，建议后端数据库包含以下表结构：

1. **clients**：存储客户基本信息
   - id (主键)
   - user_id (外键，关联用户表)
   - first_name, last_name, display_name
   - email, phone
   - avatar
   - status
   - assigned_consultant_id (外键，关联顾问表)
   - source
   - last_contact_date
   - created_at, updated_at

2. **client_tags**：存储客户标签
   - id (主键)
   - client_id (外键)
   - tag

3. **client_notes**：存储客户笔记
   - id (主键)
   - client_id (外键)
   - consultant_id (外键)
   - content
   - created_at, updated_at

4. **client_activities**：存储客户活动记录
   - id (主键)
   - client_id (外键)
   - consultant_id (外键)
   - type
   - description
   - timestamp
   - related_id
   - related_type
   - created_at

## 测试要点

在实现客户管理功能时，建议关注以下测试要点：

1. **功能测试**：
   - 客户列表加载和分页
   - 搜索和筛选功能
   - 添加、编辑、删除客户
   - 排序和分组功能
2. **性能测试**：
   - 大量客户数据的加载性能
   - 筛选和排序操作的响应时间
3. **兼容性测试**：
   - 不同浏览器和设备上的显示效果
   - 响应式布局在不同屏幕尺寸上的表现
4. **安全测试**：
   - 权限控制和数据隔离
   - 敏感信息保护
5. **用户体验测试**：
   - 操作流程的顺畅度
   - 反馈机制的清晰度
   - 错误处理的友好性
