# 顾问客户详情页面技术规范

## 概述

顾问客户详情页面提供单个客户的全面视图，包括个人信息、互动历史、文档、预约和案例等。该页面设计为顾问与客户互动的中心枢纽，提供所有相关信息和操作的快速访问。

## 页面路径

```
/consultant/clients/[id]
```

## 数据模型

### 客户详细信息

```typescript
interface ClientDetail extends Client {
  // 继承基本客户信息，并添加更多详细字段
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth?: string;
  nationality?: string;
  occupation?: string;
  education?: {
    level: string;
    institution: string;
    major?: string;
    graduationYear?: number;
  }[];
  languages?: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  immigrationStatus?: string;
  immigrationGoals?: string[];
  notes: ClientNote[];
  documents: ClientDocument[];
  appointments: ClientAppointment[];
  cases: ClientCase[];
  activities: ClientActivity[];
}
```

### 客户笔记

```typescript
interface ClientNote {
  id: string;
  clientId: string;
  consultantId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 客户文档

```typescript
interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 客户预约

```typescript
interface ClientAppointment {
  id: string;
  clientId: string;
  consultantId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'video' | 'phone';
  location?: string;
  videoLink?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 客户案例

```typescript
interface ClientCase {
  id: string;
  clientId: string;
  consultantId: string;
  title: string;
  description: string;
  type: string;
  status: 'open' | 'in-progress' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  progress: number;
  tasks: {
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### 客户活动

```typescript
interface ClientActivity {
  id: string;
  clientId: string;
  consultantId: string;
  type: 'note' | 'document' | 'appointment' | 'case' | 'email' | 'call' | 'message';
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
```

## 组件结构

```
ClientDetailPage
├── PageHeader (客户姓名、基本信息和操作按钮)
│   ├── ClientAvatar
│   ├── ClientName
│   ├── ClientStatus
│   ├── ClientTags
│   └── ActionButtons (编辑、删除、发送消息等)
├── ClientInfoSection
│   ├── PersonalInfoCard (个人基本信息)
│   ├── ContactInfoCard (联系方式)
│   ├── ImmigrationInfoCard (移民相关信息)
│   └── EditClientInfoModal (编辑客户信息的模态框)
├── ClientTabs
│   ├── OverviewTab (概览)
│   │   ├── ActivityTimeline (最近活动)
│   │   ├── UpcomingAppointments (即将到来的预约)
│   │   ├── ActiveCases (活跃案例)
│   │   └── RecentDocuments (最近文档)
│   ├── NotesTab (笔记)
│   │   ├── NotesList
│   │   │   └── NoteItem (多个)
│   │   ├── AddNoteForm
│   │   └── EditNoteModal
│   ├── DocumentsTab (文档)
│   │   ├── DocumentsFilter
│   │   ├── DocumentsList
│   │   │   └── DocumentItem (多个)
│   │   ├── UploadDocumentModal
│   │   └── DocumentPreviewModal
│   ├── AppointmentsTab (预约)
│   │   ├── AppointmentsCalendar
│   │   ├── AppointmentsList
│   │   │   └── AppointmentItem (多个)
│   │   ├── ScheduleAppointmentModal
│   │   └── AppointmentDetailsModal
│   ├── CasesTab (案例)
│   │   ├── CasesList
│   │   │   └── CaseItem (多个)
│   │   ├── CreateCaseModal
│   │   └── CaseDetailsModal
│   └── ActivityTab (活动)
│       ├── ActivityFilters
│       └── ActivityTimeline
│           └── ActivityItem (多个)
└── ClientActionSidebar
    ├── QuickActions
    ├── RecentNotes
    └── UpcomingDeadlines
```

## API 端点

### 获取客户详情

```
GET /api/consultant/{consultantId}/clients/{clientId}
```

响应:

```json
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
  "address": {
    "street": "北京市朝阳区建国路88号",
    "city": "北京",
    "province": "北京",
    "postalCode": "100022",
    "country": "中国"
  },
  "dateOfBirth": "1985-06-15",
  "nationality": "中国",
  "occupation": "软件工程师",
  "education": [
    {
      "level": "硕士",
      "institution": "北京大学",
      "major": "计算机科学",
      "graduationYear": 2010
    }
  ],
  "languages": [
    {
      "language": "中文",
      "proficiency": "native"
    },
    {
      "language": "英语",
      "proficiency": "advanced"
    }
  ],
  "immigrationStatus": "中国公民",
  "immigrationGoals": ["加拿大技术移民", "获取永久居留权"],
  "createdAt": "2023-01-15T08:00:00Z",
  "updatedAt": "2023-05-20T14:30:00Z"
}
```

### 获取客户笔记

```
GET /api/consultant/{consultantId}/clients/{clientId}/notes
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

响应:

```json
{
  "notes": [
    {
      "id": "note-123",
      "clientId": "client-123",
      "consultantId": "cons-123",
      "content": "客户表示希望在2023年底前完成移民申请",
      "isPrivate": true,
      "createdAt": "2023-05-20T14:30:00Z",
      "updatedAt": "2023-05-20T14:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

### 添加客户笔记

```
POST /api/consultant/{consultantId}/clients/{clientId}/notes
```

请求体:

```json
{
  "content": "客户提供了新的工作证明文件",
  "isPrivate": true
}
```

### 获取客户文档

```
GET /api/consultant/{consultantId}/clients/{clientId}/documents
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `category`: 文档类别
- `status`: 文档状态

响应:

```json
{
  "documents": [
    {
      "id": "doc-123",
      "clientId": "client-123",
      "name": "护照扫描件.pdf",
      "type": "application/pdf",
      "size": 2048576,
      "url": "https://example.com/documents/passport.pdf",
      "uploadedBy": "client-123",
      "category": "身份证明",
      "status": "verified",
      "notes": "护照有效期至2028年",
      "createdAt": "2023-04-10T09:15:00Z",
      "updatedAt": "2023-04-10T09:15:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 20
}
```

### 上传客户文档

```
POST /api/consultant/{consultantId}/clients/{clientId}/documents
```

请求体: `multipart/form-data`

### 获取客户预约

```
GET /api/consultant/{consultantId}/clients/{clientId}/appointments
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `status`: 预约状态
- `startDate`: 开始日期
- `endDate`: 结束日期

响应:

```json
{
  "appointments": [
    {
      "id": "apt-123",
      "clientId": "client-123",
      "consultantId": "cons-123",
      "title": "初步咨询",
      "description": "讨论移民计划和选项",
      "startTime": "2023-06-15T10:00:00Z",
      "endTime": "2023-06-15T11:00:00Z",
      "type": "video",
      "videoLink": "https://meet.example.com/room-123",
      "status": "scheduled",
      "createdAt": "2023-06-01T08:00:00Z",
      "updatedAt": "2023-06-01T08:00:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

### 创建客户预约

```
POST /api/consultant/{consultantId}/clients/{clientId}/appointments
```

请求体:

```json
{
  "title": "文件审核会议",
  "description": "审核已提交的移民申请文件",
  "startTime": "2023-07-10T14:00:00Z",
  "endTime": "2023-07-10T15:00:00Z",
  "type": "video",
  "videoLink": "https://meet.example.com/room-456"
}
```

### 获取客户案例

```
GET /api/consultant/{consultantId}/clients/{clientId}/cases
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `status`: 案例状态

响应:

```json
{
  "cases": [
    {
      "id": "case-123",
      "clientId": "client-123",
      "consultantId": "cons-123",
      "title": "加拿大技术移民申请",
      "description": "通过Express Entry系统申请加拿大永久居留权",
      "type": "技术移民",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2023-12-31T23:59:59Z",
      "progress": 35,
      "tasks": [
        {
          "id": "task-1",
          "title": "准备语言考试",
          "status": "completed",
          "dueDate": "2023-07-31T23:59:59Z"
        },
        {
          "id": "task-2",
          "title": "学历认证",
          "status": "in-progress",
          "dueDate": "2023-08-31T23:59:59Z"
        }
      ],
      "createdAt": "2023-03-15T08:00:00Z",
      "updatedAt": "2023-06-01T10:30:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

### 创建客户案例

```
POST /api/consultant/{consultantId}/clients/{clientId}/cases
```

请求体:

```json
{
  "title": "商业投资移民申请",
  "description": "通过投资者类别申请移民",
  "type": "投资移民",
  "priority": "medium",
  "dueDate": "2024-06-30T23:59:59Z",
  "tasks": [
    {
      "title": "准备商业计划书",
      "status": "pending",
      "dueDate": "2023-09-30T23:59:59Z"
    }
  ]
}
```

### 获取客户活动

```
GET /api/consultant/{consultantId}/clients/{clientId}/activities
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `type`: 活动类型
- `startDate`: 开始日期
- `endDate`: 结束日期

响应:

```json
{
  "activities": [
    {
      "id": "act-123",
      "clientId": "client-123",
      "consultantId": "cons-123",
      "type": "document",
      "description": "上传了新文档: 工作证明.pdf",
      "metadata": {
        "documentId": "doc-456",
        "documentName": "工作证明.pdf"
      },
      "timestamp": "2023-06-05T11:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

## 状态管理

使用Zustand创建客户详情状态存储:

```typescript
interface ClientDetailState {
  client: ClientDetail | null;
  notes: ClientNote[];
  documents: ClientDocument[];
  appointments: ClientAppointment[];
  cases: ClientCase[];
  activities: ClientActivity[];
  activeTab: 'overview' | 'notes' | 'documents' | 'appointments' | 'cases' | 'activities';
  isLoading: {
    client: boolean;
    notes: boolean;
    documents: boolean;
    appointments: boolean;
    cases: boolean;
    activities: boolean;
  };
  error: {
    client: string | null;
    notes: string | null;
    documents: string | null;
    appointments: string | null;
    cases: string | null;
    activities: string | null;
  };
  pagination: {
    notes: { page: number; limit: number; total: number };
    documents: { page: number; limit: number; total: number };
    appointments: { page: number; limit: number; total: number };
    cases: { page: number; limit: number; total: number };
    activities: { page: number; limit: number; total: number };
  };
  filters: {
    documents: { category: string | null; status: string | null };
    appointments: { status: string | null; startDate: string | null; endDate: string | null };
    cases: { status: string | null };
    activities: { type: string | null; startDate: string | null; endDate: string | null };
  };
  
  setClient: (client: ClientDetail) => void;
  setNotes: (notes: ClientNote[]) => void;
  setDocuments: (documents: ClientDocument[]) => void;
  setAppointments: (appointments: ClientAppointment[]) => void;
  setCases: (cases: ClientCase[]) => void;
  setActivities: (activities: ClientActivity[]) => void;
  setActiveTab: (tab: ClientDetailState['activeTab']) => void;
  setLoading: (key: keyof ClientDetailState['isLoading'], isLoading: boolean) => void;
  setError: (key: keyof ClientDetailState['error'], error: string | null) => void;
  setPagination: <K extends keyof ClientDetailState['pagination']>(
    key: K,
    pagination: Partial<ClientDetailState['pagination'][K]>
  ) => void;
  setFilters: <K extends keyof ClientDetailState['filters']>(
    key: K,
    filters: Partial<ClientDetailState['filters'][K]>
  ) => void;
  
  addNote: (note: ClientNote) => void;
  updateNote: (noteId: string, updates: Partial<ClientNote>) => void;
  deleteNote: (noteId: string) => void;
  
  addDocument: (document: ClientDocument) => void;
  updateDocument: (documentId: string, updates: Partial<ClientDocument>) => void;
  deleteDocument: (documentId: string) => void;
  
  addAppointment: (appointment: ClientAppointment) => void;
  updateAppointment: (appointmentId: string, updates: Partial<ClientAppointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
  
  addCase: (clientCase: ClientCase) => void;
  updateCase: (caseId: string, updates: Partial<ClientCase>) => void;
  deleteCase: (caseId: string) => void;
  
  resetState: () => void;
}
```

## 页面功能

1. **客户信息展示**：显示客户的详细个人和联系信息
2. **笔记管理**：添加、编辑和查看与客户相关的笔记
3. **文档管理**：上传、查看和管理客户文档
4. **预约管理**：安排、查看和管理与客户的预约
5. **案例管理**：创建、跟踪和管理客户的案例
6. **活动时间线**：查看与客户相关的所有活动历史
7. **快速操作**：提供常用操作的快速访问

## 交互设计

1. **标签式导航**：使用标签页组织不同类型的客户信息
2. **内联编辑**：支持直接在页面上编辑某些客户信息
3. **模态框操作**：使用模态框进行复杂的添加和编辑操作
4. **拖放功能**：
   - 拖放文档进行上传
   - 拖动任务更改状态
5. **实时更新**：
   - 预约状态变更实时反映
   - 新笔记和文档立即显示
6. **上下文操作**：根据当前查看的内容提供相关操作

## 响应式设计

1. **桌面布局**：
   - 左侧显示客户基本信息和快速操作
   - 中间区域显示主要内容（标签页内容）
   - 右侧显示辅助信息（即将到来的预约、重要日期等）
2. **平板布局**：
   - 顶部显示客户基本信息
   - 标签页内容占据主要区域
   - 快速操作和辅助信息折叠为可展开面板
3. **移动布局**：
   - 垂直堆叠所有内容
   - 使用折叠面板和抽屉菜单优化空间
   - 简化某些复杂视图以适应小屏幕

## 实现注意事项

1. **性能优化**：
   - 分页加载大量数据（笔记、文档、活动等）
   - 延迟加载不在视口中的内容
   - 缓存已加载的数据减少重复请求
2. **数据处理**：
   - 实现乐观更新提高响应速度
   - 使用React Query的缓存和失效策略
   - 批量获取和更新数据
3. **用户体验**：
   - 添加骨架屏减少加载感知时间
   - 实现平滑的动画和过渡效果
   - 提供清晰的反馈和确认机制
4. **错误处理**：
   - 优雅处理网络错误和数据加载失败
   - 提供重试机制和错误恢复选项
   - 在UI中明确显示错误状态
5. **安全考虑**：
   - 实现适当的权限检查
   - 保护敏感客户信息
   - 区分公开和私人笔记

## 与其他页面的关联

- 从客户列表页 (`/consultant/clients`) 点击客户可导航到客户详情页
- 客户详情页中的案例可链接到案例详情页 (`/consultant/cases/[id]`)
- 预约可链接到日程管理页面 (`/consultant/schedule`)
- 文档可链接到文档预览或编辑页面

## 后端数据库设计建议

为支持客户详情功能，建议后端数据库包含以下表结构：

1. **clients**：存储客户基本信息
2. **client_notes**：存储客户笔记
3. **client_documents**：存储客户文档元数据
4. **client_appointments**：存储客户预约
5. **client_cases**：存储客户案例
6. **case_tasks**：存储案例相关任务
7. **client_activities**：存储客户活动记录

## 测试要点

在实现客户详情功能时，建议关注以下测试要点：

1. **功能测试**：
   - 各标签页内容的加载和显示
   - 添加、编辑、删除各类数据（笔记、文档等）
   - 标签页切换和内容更新
2. **性能测试**：
   - 大量数据的加载性能
   - 页面初始加载时间
   - 操作响应时间
3. **兼容性测试**：
   - 不同浏览器和设备上的显示效果
   - 响应式布局在不同屏幕尺寸上的表现
4. **安全测试**：
   - 权限控制和数据隔离
   - 敏感信息保护
5. **用户体验测试**：
   - 导航的直观性和易用性
   - 操作流程的顺畅度
   - 错误处理的友好性
