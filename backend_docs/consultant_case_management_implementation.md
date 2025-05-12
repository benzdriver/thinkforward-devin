# 顾问案例管理模块实现文档

## 概述

顾问案例管理模块为顾问提供了全面的案例管理功能，包括案例信息管理、任务跟踪、笔记记录、文档管理和时间线记录。该模块旨在帮助顾问更有效地管理移民案例，提高工作效率和服务质量。

## 数据模型

### Case 模型

案例模型存储顾问处理的移民案例基本信息。

**主要字段**：
- `title`: 案例标题
- `clientId`: 关联的客户ID
- `consultantId`: 顾问ID
- `type`: 案例类型（快速通道、家庭团聚、学习许可、工作许可等）
- `description`: 案例描述
- `status`: 案例状态（草稿、进行中、待处理、暂停、已完成、已取消）
- `priority`: 优先级（低、中、高、紧急）
- `progress`: 进度（0-100）
- `dueDate`: 截止日期
- `startDate`: 开始日期
- `completedDate`: 完成日期
- `tags`: 标签数组
- `metadata`: 额外元数据

**主要方法**：
- `getConsultantCases`: 获取顾问的案例列表
- `getClientCases`: 获取客户的案例列表
- `getCaseStats`: 获取案例统计数据
- `getUpcomingDeadlines`: 获取即将到期的案例
- `updateCaseProgress`: 更新案例进度
- `updateStatus`: 更新案例状态

### CaseTask 模型

案例任务模型用于管理案例相关的任务。

**主要字段**：
- `caseId`: 关联的案例ID
- `title`: 任务标题
- `description`: 任务描述
- `assigneeId`: 负责人ID
- `status`: 任务状态（待处理、进行中、已完成、已取消）
- `priority`: 优先级（低、中、高、紧急）
- `dueDate`: 截止日期
- `completedAt`: 完成时间
- `estimatedHours`: 预计工时
- `actualHours`: 实际工时
- `dependencies`: 依赖任务
- `attachments`: 附件
- `checklist`: 检查清单

**主要方法**：
- `getCaseTasks`: 获取案例的任务列表
- `getAssigneeTasks`: 获取负责人的任务列表
- `getTaskStats`: 获取任务统计数据
- `getOverdueTasks`: 获取逾期任务
- `updateTaskStatus`: 更新任务状态
- `addChecklistItem`: 添加检查清单项
- `updateChecklistItem`: 更新检查清单项
- `removeChecklistItem`: 移除检查清单项

### CaseNote 模型

案例笔记模型用于记录与案例相关的笔记。

**主要字段**：
- `caseId`: 关联的案例ID
- `authorId`: 作者ID
- `content`: 笔记内容
- `isPrivate`: 是否私密
- `pinned`: 是否置顶
- `category`: 笔记类别（一般、会议、电话、邮件、文档、申请、其他）
- `attachments`: 附件
- `mentions`: 提及的用户

**主要方法**：
- `getCaseNotes`: 获取案例的笔记列表
- `getAuthorNotes`: 获取作者的笔记列表
- `searchNotes`: 搜索笔记
- `getPinnedNotes`: 获取置顶笔记
- `getUnreadMentions`: 获取未读提及
- `togglePrivate`: 切换私密状态
- `togglePinned`: 切换置顶状态
- `changeCategory`: 更改笔记类别
- `addMention`: 添加提及
- `markMentionAsRead`: 标记提及为已读

### CaseDocument 模型

案例文档模型用于管理案例相关的文档和附件。

**主要字段**：
- `caseId`: 关联的案例ID
- `name`: 文档名称
- `type`: 文档类型（申请、身份证明、教育、就业、财务、医疗、推荐信等）
- `size`: 文档大小
- `url`: 文档URL
- `uploadedBy`: 上传者ID
- `category`: 文档类别（已提交、草稿、模板、参考、其他）
- `status`: 文档状态（待处理、已批准、已拒绝、需修改）
- `notes`: 备注
- `version`: 版本号
- `previousVersions`: 历史版本
- `isPublic`: 是否公开
- `metadata`: 额外元数据

**主要方法**：
- `getCaseDocuments`: 获取案例的文档列表
- `getUserDocuments`: 获取用户的文档列表
- `getDocumentStats`: 获取文档统计数据
- `searchDocuments`: 搜索文档
- `updateStatus`: 更新文档状态
- `addVersion`: 添加新版本
- `togglePublic`: 切换公开状态

### CaseTimeline 模型

案例时间线模型用于记录案例的重要事件和活动历史。

**主要字段**：
- `caseId`: 关联的案例ID
- `type`: 事件类型（状态变更、文档上传、笔记添加、任务创建、任务完成等）
- `description`: 事件描述
- `userId`: 用户ID
- `metadata`: 事件元数据
- `isImportant`: 是否重要
- `relatedEntityId`: 关联实体ID
- `relatedEntityType`: 关联实体类型
- `timestamp`: 事件时间戳

**主要方法**：
- `getCaseTimeline`: 获取案例的时间线
- `getImportantEvents`: 获取重要事件
- `getTimelineByType`: 按类型获取时间线
- `getRecentTimeline`: 获取最近的时间线
- `addStatusChangeEvent`: 添加状态变更事件
- `addDocumentEvent`: 添加文档事件
- `addNoteEvent`: 添加笔记事件
- `addTaskEvent`: 添加任务事件
- `addMilestoneEvent`: 添加里程碑事件
- `addApplicationEvent`: 添加申请提交事件
- `addDecisionEvent`: 添加决定接收事件
- `markAsImportant`: 标记为重要
- `unmarkAsImportant`: 取消标记为重要

## 服务层

### consultantCaseService

顾问案例服务提供了案例管理的核心业务逻辑。

**主要功能**：
- `getConsultantCases`: 获取顾问的案例列表
- `getClientCases`: 获取客户的案例列表
- `getCaseById`: 获取案例详情
- `createCase`: 创建新案例
- `updateCase`: 更新案例信息
- `deleteCase`: 删除案例
- `getCaseStats`: 获取案例统计数据
- `getUpcomingDeadlines`: 获取即将到期的案例
- `updateCaseProgress`: 更新案例进度
- `getCaseTasks`: 获取案例任务
- `createCaseTask`: 创建案例任务
- `updateCaseTask`: 更新案例任务
- `deleteCaseTask`: 删除案例任务
- `getCaseNotes`: 获取案例笔记
- `createCaseNote`: 创建案例笔记
- `updateCaseNote`: 更新案例笔记
- `deleteCaseNote`: 删除案例笔记
- `getCaseDocuments`: 获取案例文档
- `uploadCaseDocument`: 上传案例文档
- `updateCaseDocument`: 更新案例文档
- `deleteCaseDocument`: 删除案例文档
- `getCaseTimeline`: 获取案例时间线
- `addMilestoneEvent`: 添加里程碑事件
- `addApplicationEvent`: 添加申请提交事件
- `addDecisionEvent`: 添加决定接收事件
- `searchCases`: 搜索案例

## 控制器层

### consultantCaseController

顾问案例控制器处理HTTP请求并调用相应的服务方法。

**主要端点**：
- `getConsultantCases`: 获取顾问的案例列表
- `getClientCases`: 获取客户的案例列表
- `getCaseById`: 获取案例详情
- `createCase`: 创建新案例
- `updateCase`: 更新案例信息
- `deleteCase`: 删除案例
- `getCaseStats`: 获取案例统计数据
- `getUpcomingDeadlines`: 获取即将到期的案例
- `updateCaseProgress`: 更新案例进度
- `getCaseTasks`: 获取案例任务
- `createCaseTask`: 创建案例任务
- `updateCaseTask`: 更新案例任务
- `deleteCaseTask`: 删除案例任务
- `getCaseNotes`: 获取案例笔记
- `createCaseNote`: 创建案例笔记
- `updateCaseNote`: 更新案例笔记
- `deleteCaseNote`: 删除案例笔记
- `getCaseDocuments`: 获取案例文档
- `uploadCaseDocument`: 上传案例文档
- `updateCaseDocument`: 更新案例文档
- `deleteCaseDocument`: 删除案例文档
- `getCaseTimeline`: 获取案例时间线
- `addMilestoneEvent`: 添加里程碑事件
- `addApplicationEvent`: 添加申请提交事件
- `addDecisionEvent`: 添加决定接收事件
- `searchCases`: 搜索案例

## 路由层

### consultantCaseRoutes

顾问案例路由定义了API端点和相应的控制器方法。

**主要路由**：
- `GET /api/consultant/:consultantId/cases`: 获取顾问的案例列表
- `GET /api/consultant/:consultantId/cases/stats`: 获取案例统计数据
- `GET /api/consultant/:consultantId/cases/deadlines`: 获取即将到期的案例
- `GET /api/consultant/:consultantId/cases/search`: 搜索案例
- `POST /api/consultant/:consultantId/cases`: 创建新案例
- `GET /api/consultant/cases/:caseId`: 获取案例详情
- `PATCH /api/consultant/cases/:caseId`: 更新案例信息
- `DELETE /api/consultant/cases/:caseId`: 删除案例
- `PATCH /api/consultant/cases/:caseId/progress`: 更新案例进度
- `GET /api/consultant/cases/:caseId/tasks`: 获取案例任务
- `POST /api/consultant/cases/:caseId/tasks`: 创建案例任务
- `PATCH /api/consultant/tasks/:taskId`: 更新案例任务
- `DELETE /api/consultant/tasks/:taskId`: 删除案例任务
- `GET /api/consultant/cases/:caseId/notes`: 获取案例笔记
- `POST /api/consultant/cases/:caseId/notes`: 创建案例笔记
- `PATCH /api/consultant/notes/:noteId`: 更新案例笔记
- `DELETE /api/consultant/notes/:noteId`: 删除案例笔记
- `GET /api/consultant/cases/:caseId/documents`: 获取案例文档
- `POST /api/consultant/cases/:caseId/documents`: 上传案例文档
- `PATCH /api/consultant/documents/:documentId`: 更新案例文档
- `DELETE /api/consultant/documents/:documentId`: 删除案例文档
- `GET /api/consultant/cases/:caseId/timeline`: 获取案例时间线
- `POST /api/consultant/cases/:caseId/milestones`: 添加里程碑事件
- `POST /api/consultant/cases/:caseId/applications`: 添加申请提交事件
- `POST /api/consultant/cases/:caseId/decisions`: 添加决定接收事件
- `GET /api/consultant/clients/:clientId/cases`: 获取客户的案例列表

## 数据流

1. 顾问通过前端界面发起案例管理相关请求
2. 请求通过路由层被定向到相应的控制器方法
3. 控制器方法验证请求参数并调用服务层方法
4. 服务层方法执行业务逻辑并与数据模型交互
5. 数据模型执行数据库操作并返回结果
6. 结果通过服务层和控制器层返回给前端

## 安全考虑

- 所有路由都需要通过`verifyToken`中间件进行身份验证
- 案例数据访问受到权限控制，确保顾问只能访问分配给他们的案例
- 私密笔记只对创建者可见
- 案例时间线提供了完整的审计跟踪

## 性能优化

- 案例列表支持分页和筛选，避免一次加载过多数据
- 使用索引优化查询性能，特别是对案例搜索和时间线查询
- 案例统计数据使用聚合查询高效计算
- 文档版本控制使用增量存储，减少存储空间占用

## 扩展性

该模块设计考虑了未来的扩展需求：

- 案例模型包含`metadata`字段，可存储额外的自定义数据
- 时间线系统支持多种事件类型，可轻松添加新类型
- 文档系统支持版本控制和状态管理，适应复杂的文档工作流
- 任务系统支持依赖关系和检查清单，可用于构建复杂的工作流

## 与其他模块的集成

顾问案例管理模块与以下模块紧密集成：

1. **顾问客户管理模块**：案例与客户关联，可查看客户的所有案例
2. **顾问仪表盘模块**：案例任务和截止日期显示在仪表盘上
3. **表单生成模块**：案例可以关联生成的表单和文档
4. **文件存储模块**：案例文档存储和管理依赖于文件存储服务
5. **通知模块**：案例状态变更、任务分配等事件会触发通知

## 前端集成

前端通过以下API服务与后端案例管理模块集成：

```typescript
// 案例API服务
export const casesApi = {
  // 获取顾问的案例列表
  getConsultantCases: (consultantId, options) => 
    apiClient.get(`/api/consultant/${consultantId}/cases`, { params: options }),
  
  // 获取案例详情
  getCaseById: (caseId) => 
    apiClient.get(`/api/consultant/cases/${caseId}`),
  
  // 创建新案例
  createCase: (consultantId, caseData) => 
    apiClient.post(`/api/consultant/${consultantId}/cases`, caseData),
  
  // 更新案例信息
  updateCase: (caseId, updateData) => 
    apiClient.patch(`/api/consultant/cases/${caseId}`, updateData),
  
  // 获取案例任务
  getCaseTasks: (caseId, options) => 
    apiClient.get(`/api/consultant/cases/${caseId}/tasks`, { params: options }),
  
  // 创建案例任务
  createCaseTask: (caseId, taskData) => 
    apiClient.post(`/api/consultant/cases/${caseId}/tasks`, taskData),
  
  // 获取案例文档
  getCaseDocuments: (caseId, options) => 
    apiClient.get(`/api/consultant/cases/${caseId}/documents`, { params: options }),
  
  // 上传案例文档
  uploadCaseDocument: (caseId, documentData) => 
    apiClient.post(`/api/consultant/cases/${caseId}/documents`, documentData),
  
  // 获取案例时间线
  getCaseTimeline: (caseId, options) => 
    apiClient.get(`/api/consultant/cases/${caseId}/timeline`, { params: options })
};
```

前端使用Zustand状态管理库管理案例数据：

```typescript
// 案例状态管理
export const useCasesStore = create((set, get) => ({
  cases: [],
  currentCase: null,
  caseTasks: [],
  caseNotes: [],
  caseDocuments: [],
  caseTimeline: [],
  loading: false,
  error: null,
  
  // 加载顾问的案例列表
  loadConsultantCases: async (consultantId, options) => {
    set({ loading: true, error: null });
    try {
      const response = await casesApi.getConsultantCases(consultantId, options);
      set({ cases: response.data.cases, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // 加载案例详情
  loadCaseById: async (caseId) => {
    set({ loading: true, error: null });
    try {
      const response = await casesApi.getCaseById(caseId);
      set({ currentCase: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // 其他状态和方法...
}));
```
