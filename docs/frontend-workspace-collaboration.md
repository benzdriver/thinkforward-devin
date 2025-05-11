# 协作空间功能

## 概述

协作空间功能允许用户与顾问和其他相关方在一个集中的环境中进行沟通、共享文档和管理任务。该功能旨在提高移民申请过程中的协作效率和透明度，确保所有参与者都能及时了解最新进展和下一步行动。

## 页面

### 协作空间页面 (`/workspace/[id]`)

协作空间页面是用户与顾问进行协作的中心枢纽，包含消息交流、任务管理和文档共享等功能区域。

**功能特点：**

- 实时消息交流
- 任务创建、分配和跟踪
- 文档上传、共享和评论
- 进度跟踪和里程碑展示
- 参与者管理
- 通知系统

## 数据模型

### 工作空间 (Workspace)

```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  participants: {
    userId: string;
    role: 'owner' | 'consultant' | 'client' | 'guest';
    joinedAt: string;
  }[];
  status: 'active' | 'archived' | 'completed';
  caseType?: string;
  caseId?: string;
}
```

### 消息 (Message)

```typescript
interface Message {
  id: string;
  workspaceId: string;
  senderId: string;
  content: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
  readBy: {
    userId: string;
    readAt: string;
  }[];
  replyTo?: string; // 回复的消息ID
}
```

### 任务 (Task)

```typescript
interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  comments?: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
  }[];
}
```

### 共享文档 (SharedDocument)

```typescript
interface SharedDocument {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  type: string;
  url: string;
  size: number;
  uploaderId: string;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  previousVersions?: {
    version: number;
    url: string;
    updatedAt: string;
    updatedBy: string;
  }[];
  comments?: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    position?: {
      page: number;
      x: number;
      y: number;
    };
  }[];
}
```

## 状态管理

协作空间功能使用Zustand进行状态管理，主要通过`useWorkspaceStore`存储：

- 当前工作空间信息
- 消息列表
- 任务列表
- 共享文档列表
- 参与者信息
- 加载状态
- 错误信息

## API集成

### 工作空间API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/workspaces` | GET | 获取用户的所有工作空间 |
| `/workspaces` | POST | 创建新工作空间 |
| `/workspaces/:id` | GET | 获取特定工作空间详情 |
| `/workspaces/:id` | PUT | 更新工作空间信息 |
| `/workspaces/:id/participants` | GET | 获取工作空间参与者 |
| `/workspaces/:id/participants` | POST | 添加参与者到工作空间 |
| `/workspaces/:id/participants/:userId` | DELETE | 从工作空间移除参与者 |

### 消息API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/workspaces/:id/messages` | GET | 获取工作空间的消息 |
| `/workspaces/:id/messages` | POST | 发送新消息 |
| `/workspaces/:id/messages/:messageId` | PUT | 更新消息 |
| `/workspaces/:id/messages/:messageId` | DELETE | 删除消息 |
| `/workspaces/:id/messages/:messageId/read` | POST | 标记消息为已读 |

### 任务API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/workspaces/:id/tasks` | GET | 获取工作空间的任务 |
| `/workspaces/:id/tasks` | POST | 创建新任务 |
| `/workspaces/:id/tasks/:taskId` | GET | 获取特定任务详情 |
| `/workspaces/:id/tasks/:taskId` | PUT | 更新任务 |
| `/workspaces/:id/tasks/:taskId` | DELETE | 删除任务 |
| `/workspaces/:id/tasks/:taskId/comments` | POST | 添加任务评论 |

### 文档API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/workspaces/:id/documents` | GET | 获取工作空间的文档 |
| `/workspaces/:id/documents` | POST | 上传新文档 |
| `/workspaces/:id/documents/:documentId` | GET | 获取特定文档详情 |
| `/workspaces/:id/documents/:documentId` | PUT | 更新文档 |
| `/workspaces/:id/documents/:documentId` | DELETE | 删除文档 |
| `/workspaces/:id/documents/:documentId/comments` | POST | 添加文档评论 |

### API钩子函数

```typescript
// 工作空间相关
useGetWorkspaces(userId: string)
useCreateWorkspace(userId: string)
useGetWorkspace(workspaceId: string)
useUpdateWorkspace(workspaceId: string)
useGetWorkspaceParticipants(workspaceId: string)
useAddWorkspaceParticipant(workspaceId: string)
useRemoveWorkspaceParticipant(workspaceId: string, userId: string)

// 消息相关
useGetMessages(workspaceId: string, options?: { limit: number; offset: number })
useSendMessage(workspaceId: string)
useUpdateMessage(workspaceId: string, messageId: string)
useDeleteMessage(workspaceId: string, messageId: string)
useMarkMessageAsRead(workspaceId: string, messageId: string)

// 任务相关
useGetTasks(workspaceId: string, options?: { status?: TaskStatus; assigneeId?: string })
useCreateTask(workspaceId: string)
useGetTask(workspaceId: string, taskId: string)
useUpdateTask(workspaceId: string, taskId: string)
useDeleteTask(workspaceId: string, taskId: string)
useAddTaskComment(workspaceId: string, taskId: string)

// 文档相关
useGetDocuments(workspaceId: string)
useUploadDocument(workspaceId: string)
useGetDocument(workspaceId: string, documentId: string)
useUpdateDocument(workspaceId: string, documentId: string)
useDeleteDocument(workspaceId: string, documentId: string)
useAddDocumentComment(workspaceId: string, documentId: string)
```

## 组件

### MessageList

消息列表组件，显示工作空间中的所有消息。

**属性：**

- `workspaceId`: 工作空间ID
- `messages`: 消息数组
- `currentUserId`: 当前用户ID
- `onSendMessage`: 发送消息回调
- `onDeleteMessage`: 删除消息回调

### MessageInput

消息输入组件，用于编写和发送新消息。

**属性：**

- `workspaceId`: 工作空间ID
- `onSendMessage`: 发送消息回调
- `replyTo`: 回复的消息ID（可选）
- `onCancelReply`: 取消回复回调（可选）

### TaskList

任务列表组件，显示工作空间中的所有任务。

**属性：**

- `workspaceId`: 工作空间ID
- `tasks`: 任务数组
- `onCreateTask`: 创建任务回调
- `onUpdateTask`: 更新任务回调
- `onDeleteTask`: 删除任务回调
- `filter`: 任务筛选条件（可选）

### TaskCard

任务卡片组件，显示单个任务的详细信息。

**属性：**

- `task`: 任务对象
- `onUpdateStatus`: 更新任务状态回调
- `onAssign`: 分配任务回调
- `onAddComment`: 添加评论回调
- `onDelete`: 删除任务回调

### DocumentList

文档列表组件，显示工作空间中的所有共享文档。

**属性：**

- `workspaceId`: 工作空间ID
- `documents`: 文档数组
- `onUploadDocument`: 上传文档回调
- `onViewDocument`: 查看文档回调
- `onDeleteDocument`: 删除文档回调

### DocumentViewer

文档查看器组件，用于预览和评论文档。

**属性：**

- `document`: 文档对象
- `onAddComment`: 添加评论回调
- `onUpdateDocument`: 更新文档回调
- `onClose`: 关闭查看器回调

### ParticipantList

参与者列表组件，显示工作空间中的所有参与者。

**属性：**

- `participants`: 参与者数组
- `onAddParticipant`: 添加参与者回调
- `onRemoveParticipant`: 移除参与者回调
- `currentUserRole`: 当前用户角色

## 多语言支持

协作空间功能支持多语言，通过i18n实现。主要翻译键包括：

- `workspace.title`
- `workspace.messages.title`
- `workspace.tasks.title`
- `workspace.documents.title`
- `workspace.participants.title`
- `workspace.messages.*`
- `workspace.tasks.*`
- `workspace.documents.*`
- `workspace.errors.*`

## 后端集成要求

1. 实时消息服务：需要支持WebSocket或类似技术以实现实时消息传递
2. 文件存储服务：需要支持文档上传、存储和版本控制
3. 通知服务：需要支持实时通知和电子邮件通知
4. 用户权限管理：需要支持基于角色的访问控制
5. 数据同步机制：需要处理多用户同时编辑的冲突情况

## 实现步骤

1. 创建工作空间状态管理存储
2. 实现消息组件和功能
3. 实现任务管理组件和功能
4. 实现文档共享组件和功能
5. 实现参与者管理功能
6. 添加多语言支持
7. 集成实时通知

## 未来改进

1. 集成视频会议功能
2. 添加文档协作编辑功能
3. 实现任务自动化和提醒
4. 添加高级搜索和筛选功能
5. 集成日历和日程安排
6. 添加数据分析和报告功能
7. 实现移动应用支持
