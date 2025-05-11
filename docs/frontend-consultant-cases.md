# 顾问案例管理页面技术规范

## 概述

顾问案例管理页面提供了顾问处理的所有客户案例的集中视图，允许顾问创建、查看、更新和管理各种类型的移民和咨询案例。该页面设计为顾问工作流程的核心组件，提供案例状态跟踪、任务管理和进度监控功能。

## 页面路径

```
/consultant/cases
```

## 数据模型

### 案例列表项

```typescript
interface CaseListItem {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  type: string;
  status: 'open' | 'in-progress' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 案例详情

```typescript
interface CaseDetail extends CaseListItem {
  description: string;
  consultantId: string;
  consultantName: string;
  notes: CaseNote[];
  documents: CaseDocument[];
  tasks: CaseTask[];
  timeline: CaseTimelineEvent[];
}
```

### 案例笔记

```typescript
interface CaseNote {
  id: string;
  caseId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 案例文档

```typescript
interface CaseDocument {
  id: string;
  caseId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 案例任务

```typescript
interface CaseTask {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 案例时间线事件

```typescript
interface CaseTimelineEvent {
  id: string;
  caseId: string;
  type: 'status_change' | 'note_added' | 'document_added' | 'task_created' | 'task_completed' | 'comment_added';
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
```

### 案例统计

```typescript
interface CaseStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  pendingCases: number;
  closedCases: number;
  archivedCases: number;
  casesByType: {
    type: string;
    count: number;
  }[];
  casesByPriority: {
    priority: 'low' | 'medium' | 'high';
    count: number;
  }[];
  upcomingDeadlines: {
    caseId: string;
    caseTitle: string;
    clientName: string;
    dueDate: string;
  }[];
}
```

## 组件结构

```
CasesPage
├── PageHeader (标题、统计数据和操作按钮)
│   ├── CaseStats (案例统计数据)
│   └── ActionButtons (创建案例、批量操作等)
├── CasesFilters
│   ├── SearchInput (搜索案例)
│   ├── StatusFilter (按状态筛选)
│   ├── TypeFilter (按类型筛选)
│   ├── PriorityFilter (按优先级筛选)
│   ├── DateRangeFilter (按日期范围筛选)
│   └── SortOptions (排序选项)
├── CasesList
│   ├── CasesTable (表格视图)
│   │   └── CaseTableRow (多个)
│   ├── CasesGrid (卡片视图)
│   │   └── CaseCard (多个)
│   └── CasesPagination
├── CreateCaseModal
│   ├── CaseBasicInfoForm (基本信息表单)
│   ├── ClientSelector (选择客户)
│   ├── CaseTypeSelector (选择案例类型)
│   └── InitialTasksForm (初始任务表单)
├── CaseDetailsDrawer (侧边抽屉)
│   ├── CaseHeader (案例标题和状态)
│   ├── CaseTabs
│   │   ├── OverviewTab (概览)
│   │   │   ├── CaseProgressCard
│   │   │   ├── ClientInfoCard
│   │   │   ├── DueDateCard
│   │   │   └── RecentActivitiesCard
│   │   ├── TasksTab (任务)
│   │   │   ├── TasksList
│   │   │   │   └── TaskItem (多个)
│   │   │   ├── AddTaskForm
│   │   │   └── EditTaskModal
│   │   ├── NotesTab (笔记)
│   │   │   ├── NotesList
│   │   │   │   └── NoteItem (多个)
│   │   │   ├── AddNoteForm
│   │   │   └── EditNoteModal
│   │   ├── DocumentsTab (文档)
│   │   │   ├── DocumentsList
│   │   │   │   └── DocumentItem (多个)
│   │   │   ├── UploadDocumentForm
│   │   │   └── DocumentPreviewModal
│   │   └── TimelineTab (时间线)
│   │       └── TimelineList
│   │           └── TimelineItem (多个)
│   └── CaseActions (案例操作按钮)
└── CaseBulkActionsMenu (批量操作菜单)
```

## API 端点

### 获取案例列表

```
GET /api/consultant/{consultantId}/cases
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `search`: 搜索关键词
- `status`: 案例状态
- `type`: 案例类型
- `priority`: 优先级
- `startDate`: 开始日期
- `endDate`: 结束日期
- `sortBy`: 排序字段
- `sortOrder`: 排序顺序 ('asc' 或 'desc')

响应:

```json
{
  "cases": [
    {
      "id": "case-123",
      "title": "加拿大技术移民申请",
      "clientId": "client-456",
      "clientName": "张三",
      "clientAvatar": "https://example.com/avatars/zhangsan.jpg",
      "type": "技术移民",
      "status": "in-progress",
      "priority": "high",
      "progress": 35,
      "dueDate": "2023-12-31T23:59:59Z",
      "createdAt": "2023-03-15T08:00:00Z",
      "updatedAt": "2023-06-01T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

### 获取案例统计

```
GET /api/consultant/{consultantId}/cases/stats
```

响应:

```json
{
  "totalCases": 25,
  "openCases": 5,
  "inProgressCases": 10,
  "pendingCases": 3,
  "closedCases": 5,
  "archivedCases": 2,
  "casesByType": [
    {
      "type": "技术移民",
      "count": 12
    },
    {
      "type": "投资移民",
      "count": 8
    },
    {
      "type": "家庭团聚",
      "count": 5
    }
  ],
  "casesByPriority": [
    {
      "priority": "high",
      "count": 8
    },
    {
      "priority": "medium",
      "count": 12
    },
    {
      "priority": "low",
      "count": 5
    }
  ],
  "upcomingDeadlines": [
    {
      "caseId": "case-123",
      "caseTitle": "加拿大技术移民申请",
      "clientName": "张三",
      "dueDate": "2023-07-15T23:59:59Z"
    }
  ]
}
```

### 获取案例类型

```
GET /api/consultant/{consultantId}/cases/types
```

响应:

```json
{
  "types": ["技术移民", "投资移民", "家庭团聚", "学生签证", "工作签证", "永久居留申请"]
}
```

### 创建新案例

```
POST /api/consultant/{consultantId}/cases
```

请求体:

```json
{
  "title": "澳大利亚技术移民申请",
  "clientId": "client-789",
  "type": "技术移民",
  "description": "协助客户申请澳大利亚技术移民签证",
  "priority": "medium",
  "dueDate": "2024-03-31T23:59:59Z",
  "tasks": [
    {
      "title": "准备语言考试",
      "description": "安排雅思考试并提供备考资料",
      "status": "pending",
      "priority": "high",
      "dueDate": "2023-08-31T23:59:59Z"
    }
  ]
}
```

### 获取案例详情

```
GET /api/consultant/{consultantId}/cases/{caseId}
```

响应:

```json
{
  "id": "case-123",
  "title": "加拿大技术移民申请",
  "clientId": "client-456",
  "clientName": "张三",
  "clientAvatar": "https://example.com/avatars/zhangsan.jpg",
  "consultantId": "cons-123",
  "consultantName": "李顾问",
  "type": "技术移民",
  "description": "通过Express Entry系统申请加拿大永久居留权",
  "status": "in-progress",
  "priority": "high",
  "progress": 35,
  "dueDate": "2023-12-31T23:59:59Z",
  "createdAt": "2023-03-15T08:00:00Z",
  "updatedAt": "2023-06-01T10:30:00Z"
}
```

### 更新案例

```
PATCH /api/consultant/{consultantId}/cases/{caseId}
```

请求体:

```json
{
  "title": "加拿大技术移民申请 - 更新",
  "status": "pending",
  "priority": "medium",
  "progress": 50,
  "dueDate": "2024-01-31T23:59:59Z"
}
```

### 获取案例任务

```
GET /api/consultant/{consultantId}/cases/{caseId}/tasks
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `status`: 任务状态

响应:

```json
{
  "tasks": [
    {
      "id": "task-123",
      "caseId": "case-123",
      "title": "准备语言考试",
      "description": "安排雅思考试并提供备考资料",
      "assigneeId": "cons-123",
      "assigneeName": "李顾问",
      "status": "completed",
      "priority": "high",
      "dueDate": "2023-07-31T23:59:59Z",
      "completedAt": "2023-07-25T16:45:00Z",
      "createdAt": "2023-05-15T09:00:00Z",
      "updatedAt": "2023-07-25T16:45:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

### 创建案例任务

```
POST /api/consultant/{consultantId}/cases/{caseId}/tasks
```

请求体:

```json
{
  "title": "准备资金证明",
  "description": "收集并整理银行对账单和资产证明",
  "assigneeId": "cons-123",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2023-09-15T23:59:59Z"
}
```

### 更新案例任务

```
PATCH /api/consultant/{consultantId}/cases/{caseId}/tasks/{taskId}
```

请求体:

```json
{
  "status": "completed",
  "completedAt": "2023-09-10T14:30:00Z"
}
```

### 获取案例笔记

```
GET /api/consultant/{consultantId}/cases/{caseId}/notes
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
      "caseId": "case-123",
      "authorId": "cons-123",
      "authorName": "李顾问",
      "authorAvatar": "https://example.com/avatars/liguwen.jpg",
      "content": "客户已完成语言考试，成绩达到CLB 9级",
      "isPrivate": true,
      "createdAt": "2023-07-26T10:15:00Z",
      "updatedAt": "2023-07-26T10:15:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 20
}
```

### 添加案例笔记

```
POST /api/consultant/{consultantId}/cases/{caseId}/notes
```

请求体:

```json
{
  "content": "已收到客户的学历认证结果，符合要求",
  "isPrivate": true
}
```

### 获取案例文档

```
GET /api/consultant/{consultantId}/cases/{caseId}/documents
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
      "caseId": "case-123",
      "name": "语言考试成绩单.pdf",
      "type": "application/pdf",
      "size": 1048576,
      "url": "https://example.com/documents/language-test.pdf",
      "uploadedBy": "client-456",
      "uploadedByName": "张三",
      "category": "语言证明",
      "status": "verified",
      "notes": "雅思成绩有效期为2年",
      "createdAt": "2023-07-26T09:30:00Z",
      "updatedAt": "2023-07-26T09:30:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}
```

### 上传案例文档

```
POST /api/consultant/{consultantId}/cases/{caseId}/documents
```

请求体: `multipart/form-data`

### 获取案例时间线

```
GET /api/consultant/{consultantId}/cases/{caseId}/timeline
```

查询参数:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

响应:

```json
{
  "events": [
    {
      "id": "event-123",
      "caseId": "case-123",
      "type": "status_change",
      "description": "案例状态从 'open' 更改为 'in-progress'",
      "userId": "cons-123",
      "userName": "李顾问",
      "userAvatar": "https://example.com/avatars/liguwen.jpg",
      "metadata": {
        "oldStatus": "open",
        "newStatus": "in-progress"
      },
      "timestamp": "2023-05-20T08:45:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

## 状态管理

使用Zustand创建案例管理状态存储:

```typescript
interface ConsultantCasesState {
  cases: CaseListItem[];
  caseDetail: CaseDetail | null;
  stats: CaseStats | null;
  caseTypes: string[];
  
  filters: {
    search: string;
    status: string | null;
    type: string | null;
    priority: string | null;
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
  
  viewMode: 'table' | 'grid';
  selectedCaseIds: string[];
  isCreateModalOpen: boolean;
  isDetailDrawerOpen: boolean;
  activeDetailTab: 'overview' | 'tasks' | 'notes' | 'documents' | 'timeline';
  
  isLoading: {
    cases: boolean;
    caseDetail: boolean;
    stats: boolean;
    tasks: boolean;
    notes: boolean;
    documents: boolean;
    timeline: boolean;
  };
  
  error: {
    cases: string | null;
    caseDetail: string | null;
    stats: string | null;
    tasks: string | null;
    notes: string | null;
    documents: string | null;
    timeline: string | null;
  };
  
  // 设置方法
  setCases: (cases: CaseListItem[]) => void;
  setCaseDetail: (caseDetail: CaseDetail | null) => void;
  setStats: (stats: CaseStats) => void;
  setCaseTypes: (types: string[]) => void;
  
  setFilters: (filters: Partial<ConsultantCasesState['filters']>) => void;
  setPagination: (pagination: Partial<ConsultantCasesState['pagination']>) => void;
  
  setViewMode: (mode: 'table' | 'grid') => void;
  setSelectedCaseIds: (ids: string[]) => void;
  toggleCaseSelection: (id: string) => void;
  clearSelectedCases: () => void;
  
  setCreateModalOpen: (isOpen: boolean) => void;
  setDetailDrawerOpen: (isOpen: boolean) => void;
  setActiveDetailTab: (tab: ConsultantCasesState['activeDetailTab']) => void;
  
  setLoading: (key: keyof ConsultantCasesState['isLoading'], isLoading: boolean) => void;
  setError: (key: keyof ConsultantCasesState['error'], error: string | null) => void;
  
  // 业务逻辑方法
  addCase: (caseItem: CaseListItem) => void;
  updateCase: (caseId: string, updates: Partial<CaseListItem>) => void;
  removeCase: (caseId: string) => void;
  
  addTask: (task: CaseTask) => void;
  updateTask: (taskId: string, updates: Partial<CaseTask>) => void;
  removeTask: (taskId: string) => void;
  
  addNote: (note: CaseNote) => void;
  updateNote: (noteId: string, updates: Partial<CaseNote>) => void;
  removeNote: (noteId: string) => void;
  
  addDocument: (document: CaseDocument) => void;
  updateDocument: (documentId: string, updates: Partial<CaseDocument>) => void;
  removeDocument: (documentId: string) => void;
  
  resetFilters: () => void;
  resetState: () => void;
}
```

## 前后端集成要点

1. **实时更新**：
   - 考虑使用WebSocket或轮询机制实现案例状态和任务更新的实时通知
   - 当其他顾问或客户更新案例信息时，确保当前用户界面得到更新

2. **批量操作**：
   - 后端应支持批量更新案例状态、优先级等属性
   - 提供批量导出案例数据的API端点

3. **文件处理**：
   - 后端需要支持大文件上传和下载
   - 实现文件预览功能，支持常见文档格式（PDF、Word、Excel等）
   - 考虑文件存储策略（本地存储、云存储等）

4. **权限控制**：
   - 实现基于角色的访问控制，区分顾问、客户和管理员权限
   - 私有笔记只对顾问可见，公开笔记对客户也可见

5. **数据验证**：
   - 前端实现表单验证，确保数据完整性
   - 后端实现严格的数据验证和清洁，防止恶意输入

6. **性能优化**：
   - 实现分页、筛选和排序的服务器端处理
   - 考虑大数据集的性能优化策略
   - 实现数据缓存机制，减少不必要的API请求

7. **国际化支持**：
   - 确保所有文本和日期格式支持多语言和多地区设置
   - 考虑不同时区的日期和时间处理

## 数据库设计建议

### 案例表 (cases)

```sql
CREATE TABLE cases (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client_id VARCHAR(36) NOT NULL,
  consultant_id VARCHAR(36) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('open', 'in-progress', 'pending', 'closed', 'archived') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  progress INT NOT NULL DEFAULT 0,
  due_date DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (consultant_id) REFERENCES consultants(id),
  INDEX idx_consultant_id (consultant_id),
  INDEX idx_client_id (client_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_priority (priority),
  INDEX idx_due_date (due_date)
);
```

### 案例任务表 (case_tasks)

```sql
CREATE TABLE case_tasks (
  id VARCHAR(36) PRIMARY KEY,
  case_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id VARCHAR(36),
  status ENUM('pending', 'in-progress', 'completed') NOT NULL DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  due_date DATETIME,
  completed_at DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id),
  INDEX idx_case_id (case_id),
  INDEX idx_assignee_id (assignee_id),
  INDEX idx_status (status)
);
```

### 案例笔记表 (case_notes)

```sql
CREATE TABLE case_notes (
  id VARCHAR(36) PRIMARY KEY,
  case_id VARCHAR(36) NOT NULL,
  author_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id),
  INDEX idx_case_id (case_id),
  INDEX idx_author_id (author_id)
);
```

### 案例文档表 (case_documents)

```sql
CREATE TABLE case_documents (
  id VARCHAR(36) PRIMARY KEY,
  case_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  uploaded_by VARCHAR(36) NOT NULL,
  category VARCHAR(100),
  status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX idx_case_id (case_id),
  INDEX idx_uploaded_by (uploaded_by),
  INDEX idx_category (category),
  INDEX idx_status (status)
);
```

### 案例时间线表 (case_timeline)

```sql
CREATE TABLE case_timeline (
  id VARCHAR(36) PRIMARY KEY,
  case_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  metadata JSON,
  timestamp DATETIME NOT NULL,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_case_id (case_id),
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_timestamp (timestamp)
);
```

## 安全考虑

1. **数据加密**：
   - 确保敏感客户数据在传输和存储过程中加密
   - 实现HTTPS协议保护API通信

2. **访问控制**：
   - 实现细粒度的权限控制，确保顾问只能访问分配给他们的案例
   - 记录所有关键操作的审计日志

3. **输入验证**：
   - 前后端都实现严格的输入验证，防止XSS和SQL注入攻击
   - 实现CSRF保护机制

4. **会话管理**：
   - 实现安全的会话管理，包括会话超时和自动登出
   - 支持多设备登录管理

5. **数据备份**：
   - 实现定期数据备份策略
   - 提供数据恢复机制，防止意外数据丢失
