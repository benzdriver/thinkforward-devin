# ThinkForward AI - 技术架构设计

## 1. 整体架构概览

ThinkForward AI采用serverless架构，专注于快速交付MVP，同时保证可扩展性。整体架构如下：

```
+-------------------+     +----------------+     +------------------------+
|                   |     |                |     |                        |
|  Web客户端         |<--->| API Gateway    |<--->|  Serverless Functions  |
|  (Next.js)        |     |                |     |                        |
|                   |     +----------------+     +------------------------+
+-------------------+            |                          |
                                 |                          |
                         +----------------+         +----------------+
                         |                |         |                |
                         | Cognito认证    |         | MongoDB Atlas  |
                         |                |         |                |
                         +----------------+         +----------------+
                                                            |
                                                    +----------------+
                                                    |                |
                                                    | S3/Blob存储    |
                                                    |                |
                                                    +----------------+
                                                            |
                                                    +----------------+
                                                    |                |
                                                    | OpenAI API     |
                                                    |                |
                                                    +----------------+
```

### 核心技术组件

- **前端**：Next.js框架，React组件库，Tailwind CSS
- **API网关**：AWS API Gateway / Azure API Management
- **认证**：AWS Cognito / Auth0
- **Serverless函数**：AWS Lambda / Azure Functions (Node.js)
- **数据库**：MongoDB Atlas
- **存储**：AWS S3 / Azure Blob Storage
- **AI集成**：OpenAI API

### 技术架构原则

- **无服务器优先**：避免管理服务器，专注于业务逻辑
- **功能分离**：按业务域划分函数，确保职责单一
- **事件驱动**：使用事件模式进行服务间通信
- **缓存策略**：适当缓存以提高性能和降低成本
- **安全优先**：数据加密、身份验证和授权控制

## 2. 前端架构设计

### 2.1 技术栈

- **核心框架**：Next.js 13+
- **UI框架**：React 18+
- **样式解决方案**：Tailwind CSS
- **状态管理**：
  - React Query（服务器状态）
  - Context API（应用状态）
  - Zustand（复杂状态）
- **表单处理**：React Hook Form + Zod
- **国际化**：next-i18next

### 2.2 设计系统

参考Wealthsimple的简约设计，构建一套一致的设计系统：

- **色彩系统**：
  - 主色：蓝色 (#3B82F6)
  - 辅助色：绿色 (#10B981)，红色 (#EF4444)
  - 中性色：灰阶 (#F9FAFB 到 #1F2937)
- **排版**：
  - 字体：Inter (无衬线)
  - 标题：24px/20px/18px/16px
  - 正文：16px
- **组件库**：
  - 原子组件：按钮、输入框、选择器等
  - 分子组件：表单字段、卡片、模态框等
  - 模板组件：布局、页面结构等

### 2.3 页面架构

#### 公共页面

1. **登录页** (`/auth/login`)
   - 功能：用户登录、社交登录、密码重置入口
   - 后端映射：`auth/login` 函数
   - 输入：邮箱/密码
   - 输出：JWT令牌、用户基本信息

2. **注册页** (`/auth/register`)
   - 功能：新用户注册、角色选择（申请人/顾问）
   - 后端映射：`auth/register` 函数
   - 输入：邮箱、密码、名字、角色
   - 输出：账户创建确认、引导流程

3. **密码重置页** (`/auth/reset-password`)
   - 功能：密码重置流程
   - 后端映射：`auth/resetPassword` 函数
   - 输入：邮箱（请求重置）、令牌和新密码（实际重置）
   - 输出：重置确认

4. **关于我们** (`/about`)
   - 静态页面，无后端映射

5. **定价页** (`/pricing`)
   - 功能：展示订阅计划和功能比较
   - 后端映射：`subscription/getPlans` 函数
   - 输入：无
   - 输出：订阅计划数据

#### 客户页面

6. **客户仪表盘** (`/dashboard`)
   - 功能：概览、进度追踪、待办事项、通知
   - 后端映射：`dashboard/getUserDashboard` 函数
   - 输入：用户ID
   - 输出：个人资料完整度、评估状态、待办任务、通知

7. **初始评估页** (`/assessment/start`)
   - 功能：开始评估流程，收集基础信息
   - 后端映射：`assessment/startAssessment` 函数
   - 输入：基础个人信息
   - 输出：评估ID、初始问题集

8. **评估步骤页** (`/assessment/[step]`)
   - 功能：多步骤评估流程
   - 后端映射：`assessment/processStep` 函数
   - 输入：评估ID、步骤数据
   - 输出：下一步配置或评估结果

9. **评估结果页** (`/assessment/result/[id]`)
   - 功能：显示评估结果、移民路径建议
   - 后端映射：`assessment/getResult` 函数
   - 输入：评估ID
   - 输出：评估摘要、推荐路径、成功率预测

10. **路径选择页** (`/pathways/select`)
    - 功能：比较和选择移民路径
    - 后端映射：`pathways/comparePaths` 函数
    - 输入：用户ID、候选路径IDs
    - 输出：路径详情、比较数据、时间线预测

11. **资料收集页 - 对话式** (`/profile/build/conversation`)
    - 功能：通过AI对话收集用户信息
    - 后端映射：`profile/conversationCollect` 函数
    - 输入：用户ID、对话历史、当前回答
    - 输出：下一问题、收集进度、收集摘要
    - 附加功能：一键切换到表单模式按钮，保持当前进度和数据

12. **资料收集页 - 表单式** (`/profile/build/form`)
    - 功能：通过表单收集用户信息
    - 后端映射：`profile/formCollect` 函数
    - 输入：用户ID、表单数据
    - 输出：验证结果、完整度评分
    - 附加功能：一键切换到对话模式按钮，保持当前进度和数据

13. **模式切换组件** (在两种收集页面中共享)
    - 功能：允许用户在对话式和表单式数据收集模式间无缝切换
    - 后端映射：`profile/switchCollectionMode` 函数
    - 输入：用户ID、当前模式、目标模式、当前进度数据
    - 输出：切换确认、新模式初始化数据

13. **文档上传页** (`/documents/upload`)
    - 功能：上传和分类文档
    - 后端映射：`documents/uploadDocument` 函数
    - 输入：用户ID、文件数据、文档类型
    - 输出：上传确认、文档ID、初步分析

14. **文档管理页** (`/documents/manage`)
    - 功能：管理已上传的文档
    - 后端映射：`documents/getUserDocuments` 函数
    - 输入：用户ID
    - 输出：文档列表、状态、分析结果

15. **表格生成页** (`/forms/generate`)
    - 功能：选择和生成官方表格
    - 后端映射：`forms/generateForm` 函数
    - 输入：用户ID、表格类型
    - 输出：生成的表格数据、验证结果

16. **表格预览页** (`/forms/preview/[id]`)
    - 功能：预览和下载生成的表格
    - 后端映射：`forms/getForm` 函数
    - 输入：表格ID
    - 输出：表格数据、PDF链接

17. **顾问匹配页** (`/consultants/match`)
    - 功能：基于用户情况推荐顾问
    - 后端映射：`consultants/matchConsultants` 函数
    - 输入：用户ID、移民路径
    - 输出：匹配的顾问列表、专长、评分

18. **顾问预约页** (`/consultants/book/[id]`)
    - 功能：预约顾问咨询
    - 后端映射：`consultants/bookAppointment` 函数
    - 输入：顾问ID、日期时间、咨询类型
    - 输出：预约确认、支付链接

19. **协作空间页** (`/workspace/[id]`)
    - 功能：客户-顾问协作环境
    - 后端映射：`workspace/getWorkspace` 函数
    - 输入：工作空间ID
    - 输出：共享文档、消息历史、任务列表

20. **个人资料页** (`/profile/settings`)
    - 功能：查看和编辑个人资料
    - 后端映射：`profile/getUserProfile` 和 `profile/updateProfile` 函数
    - 输入：用户ID、更新数据
    - 输出：当前资料、更新确认

#### 顾问页面

21. **顾问仪表盘** (`/consultant/dashboard`)
    - 功能：客户概览、案例状态、任务管理
    - 后端映射：`consultant/getDashboard` 函数
    - 输入：顾问ID
    - 输出：客户列表、案例状态、待办任务

22. **客户管理页** (`/consultant/clients`)
    - 功能：管理所有客户
    - 后端映射：`consultant/getClients` 函数
    - 输入：顾问ID
    - 输出：客户列表、状态摘要

23. **客户详情页** (`/consultant/clients/[id]`)
    - 功能：查看客户详细资料
    - 后端映射：`consultant/getClientDetails` 函数
    - 输入：客户ID
    - 输出：完整客户资料、文档、评估结果

24. **案例管理页** (`/consultant/cases`)
    - 功能：管理移民案例
    - 后端映射：`consultant/getCases` 函数
    - 输入：顾问ID
    - 输出：案例列表、状态、关键日期

25. **日程管理页** (`/consultant/schedule`)
    - 功能：管理咨询预约
    - 后端映射：`consultant/getSchedule` 函数
    - 输入：顾问ID、日期范围
    - 输出：预约列表、可用时段

26. **顾问资料页** (`/consultant/profile`)
    - 功能：管理专业资料和服务选项
    - 后端映射：`consultant/getProfile` 和 `consultant/updateProfile` 函数
    - 输入：顾问ID、更新数据
    - 输出：当前资料、更新确认

#### 管理员页面

27. **管理员仪表盘** (`/admin/dashboard`)
    - 功能：系统概览、用户统计、使用情况
    - 后端映射：`admin/getDashboard` 函数
    - 输入：管理员ID
    - 输出：系统指标、活跃用户、关键统计

28. **用户管理页** (`/admin/users`)
    - 功能：管理所有用户
    - 后端映射：`admin/getUsers` 函数
    - 输入：筛选参数、分页信息
    - 输出：用户列表、状态

29. **系统设置页** (`/admin/settings`)
    - 功能：配置系统参数
    - 后端映射：`admin/getSettings` 和 `admin/updateSettings` 函数
    - 输入：设置类别、更新数据
    - 输出：当前设置、更新确认

## 3. 后端Serverless函数设计

按业务域组织serverless函数，每个函数职责单一，便于开发和维护。

### 3.1 认证域 (Auth)

#### 3.1.1 登录函数 (auth/login)
- **功能**：处理用户登录请求
- **输入**：
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **输出**：
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "enum(guest, client, consultant, admin)"
    }
  }
  ```
- **依赖**：Cognito/Auth0、UserRepository

#### 3.1.2 注册函数 (auth/register)
- **功能**：创建新用户账户
- **输入**：
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string",
    "role": "enum(client, consultant)"
  }
  ```
- **输出**：
  ```json
  {
    "success": "boolean",
    "userId": "string",
    "message": "string"
  }
  ```
- **依赖**：Cognito/Auth0、UserRepository

#### 3.1.3 密码重置函数 (auth/resetPassword)
- **功能**：处理密码重置请求
- **输入**：
  ```json
  {
    "email": "string" // 请求重置
  }
  ```
  或
  ```json
  {
    "token": "string",
    "newPassword": "string" // 执行重置
  }
  ```
- **输出**：
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```
- **依赖**：Cognito/Auth0

### 3.2 用户资料域 (Profile)

#### 3.2.1 获取用户资料函数 (profile/getUserProfile)
- **功能**：获取用户完整资料
- **输入**：
  ```json
  {
    "userId": "string"
  }
  ```
- **输出**：
  ```json
  {
    "personalInfo": {
      "name": "string",
      "dateOfBirth": "date",
      "nationality": "string",
      "address": "object",
      "contact": "object"
    },
    "education": ["array of education objects"],
    "workExperience": ["array of work experience objects"],
    "languageSkills": ["array of language skill objects"],
    "familyInfo": ["array of family member objects"],
    "travelHistory": ["array of travel history objects"],
    "completeness": {
      "overall": "number",
      "bySection": "object"
    }
  }
  ```
- **依赖**：UserRepository

#### 3.2.2 更新用户资料函数 (profile/updateProfile)
- **功能**：更新用户资料字段
- **输入**：
  ```json
  {
    "userId": "string",
    "section": "string", // 资料区域
    "data": "object" // 要更新的数据
  }
  ```
- **输出**：
  ```json
  {
    "success": "boolean",
    "updatedFields": ["array of strings"],
    "completeness": "number"
  }
  ```
- **依赖**：UserRepository

#### 3.2.3 对话式资料收集函数 (profile/conversationCollect)
- **功能**：通过AI对话收集用户资料
- **输入**：
  ```json
  {
    "userId": "string",
    "conversationId": "string",
    "message": "string", // 用户回答
    "context": "object" // 对话上下文
  }
  ```
- **输出**：
  ```json
  {
    "nextQuestion": "string",
    "extractedData": "object", // 从对话中提取的结构化数据
    "progress": "number",
    "updatedFields": ["array of strings"]
  }
  ```
- **依赖**：OpenAI API、UserRepository

#### 3.2.4 表单式资料收集函数 (profile/formCollect)
- **功能**：处理表单提交的用户资料
- **输入**：
  ```json
  {
    "userId": "string",
    "section": "string", // 资料区域
    "formData": "object" // 表单数据
  }
  ```
- **输出**：
  ```json
  {
    "success": "boolean",
    "validation": "object", // 验证结果
    "completeness": "number"
  }
  ```
- **依赖**：UserRepository

#### 3.2.5 收集模式切换函数 (profile/switchCollectionMode)
- **功能**：在对话式和表单式数据收集模式之间切换
- **输入**：
  ```json
  {
    "userId": "string",
    "fromMode": "string", // "conversation" 或 "form"
    "toMode": "string", // "conversation" 或 "form"
    "currentSection": "string", // 当前区段/主题
    "currentProgress": "object" // 当前模式下的进度和数据
  }
  ```
- **输出**：
  ```json
  {
    "success": "boolean",
    "newMode": "string",
    "resumeData": "object", // 在新模式中恢复的数据
    "nextPrompt": "string", // 对话模式下的下一个问题
    "focusSection": "string" // 表单模式下应聚焦的区段
  }
  ```
- **依赖**：UserRepository、ModeMapperService

### 3.3 评估域 (Assessment)

#### 3.3.1 开始评估函数 (assessment/startAssessment)
- **功能**：创建新的评估会话
- **输入**：
  ```json
  {
    "userId": "string",
    "initialData": "object" // 初始资料
  }
  ```
- **输出**：
  ```json
  {
    "assessmentId": "string",
    "firstStep": "object" // 首个步骤配置
  }
  ```
- **依赖**：AssessmentRepository

#### 3.3.2 处理评估步骤函数 (assessment/processStep)
- **功能**：处理评估流程中的单个步骤
- **输入**：
  ```json
  {
    "assessmentId": "string",
    "stepId": "string",
    "data": "object" // 步骤数据
  }
  ```
- **输出**：
  ```json
  {
    "nextStep": "object", // 下一步配置
    "isComplete": "boolean", // 评估是否完成
    "progress": "number"
  }
  ```
- **依赖**：AssessmentRepository、OpenAI API

#### 3.3.3 获取评估结果函数 (assessment/getResult)
- **功能**：获取已完成评估的结果
- **输入**：
  ```json
  {
    "assessmentId": "string"
  }
  ```
- **输出**：
  ```json
  {
    "overallResult": "object", // 总体评估
    "eligibilityByProgram": "object", // 按项目资格
    "recommendedPathways": ["array of pathway objects"],
    "scores": "object" // 各项评分
  }
  ```
- **依赖**：AssessmentRepository

### 3.4 文档域 (Documents)

#### 3.4.1 上传文档函数 (documents/uploadDocument)
- **功能**：处理文档上传和分类
- **输入**：
  - Multipart表单数据（文件 + 元数据）
  ```json
  {
    "userId": "string",
    "documentType": "string",
    "description": "string",
    "file": "binary"
  }
  ```
- **输出**：
  ```json
  {
    "documentId": "string",
    "uploadSuccess": "boolean",
    "previewUrl": "string",
    "initialAnalysis": "object" // 初步文档分析
  }
  ```
- **依赖**：S3/Blob存储、DocumentRepository

#### 3.4.2 获取用户文档函数 (documents/getUserDocuments)
- **功能**：获取用户上传的所有文档
- **输入**：
  ```json
  {
    "userId": "string",
    "filters": "object" // 可选筛选条件
  }
  ```
- **输出**：
  ```json
  {
    "documents": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "uploadDate": "date",
        "status": "string",
        "previewUrl": "string",
        "analysisResults": "object"
      }
    ],
    "counts": "object" // 按类型统计
  }
  ```
- **依赖**：DocumentRepository

#### 3.4.3 分析文档函数 (documents/analyzeDocument)
- **功能**：深度分析已上传文档
- **输入**：
  ```json
  {
    "documentId": "string",
    "analysisType": "string" // 分析类型
  }
  ```
- **输出**：
  ```json
  {
    "documentId": "string",
    "analysisResults": "object", // 分析结果
    "extractedData": "object", // 提取的结构化数据
    "confidence": "number"
  }
  ```
- **依赖**：DocumentRepository、S3/Blob存储、OpenAI API

### 3.5 表格域 (Forms)

#### 3.5.1 生成表格函数 (forms/generateForm)
- **功能**：根据用户资料生成官方表格
- **输入**：
  ```json
  {
    "userId": "string",
    "formType": "string",
    "options": "object" // 生成选项
  }
  ```
- **输出**：
  ```json
  {
    "formId": "string",
    "status": "string",
    "validationResults": "object",
    "missingFields": ["array of strings"],
    "warnings": ["array of warning objects"]
  }
  ```
- **依赖**：FormRepository、UserRepository、OpenAI API

#### 3.5.2 获取表格函数 (forms/getForm)
- **功能**：获取生成表格的详细信息
- **输入**：
  ```json
  {
    "formId": "string"
  }
  ```
- **输出**：
  ```json
  {
    "formId": "string",
    "formType": "string",
    "formData": "object", // 表格数据
    "status": "string",
    "generatedDate": "date",
    "downloadUrl": "string" // PDF下载链接
  }
  ```
- **依赖**：FormRepository、S3/Blob存储

#### 3.5.3 更新表格字段函数 (forms/updateFormField)
- **功能**：更新生成表格中的特定字段
- **输入**：
  ```json
  {
    "formId": "string",
    "fieldPath": "string",
    "value": "any"
  }
  ```
- **输出**：
  ```json
  {
    "success": "boolean",
    "validationResult": "object",
    "updatedFormData": "object"
  }
  ```
- **依赖**：FormRepository

### 3.6 顾问域 (Consultants)

#### 3.6.1 匹配顾问函数 (consultants/matchConsultants)
- **功能**：基于用户情况匹配适合的顾问
- **输入**：
  ```json
  {
    "userId": "string",
    "pathwayId": "string",
    "preferences": "object" // 匹配偏好
  }
  ```
- **输出**：
  ```json
  {
    "matches": [
      {
        "consultantId": "string",
        "name": "string",
        "specialties": ["array of strings"],
        "rating": "number",
        "matchScore": "number",
        "availability": "object"
      }
    ]
  }
  ```
- **依赖**：ConsultantRepository、UserRepository

#### 3.6.2 预约顾问函数 (consultants/bookAppointment)
- **功能**：创建顾问预约
- **输入**：
  ```json
  {
    "userId": "string",
    "consultantId": "string",
    "datetime": "datetime",
    "appointmentType": "string",
    "notes": "string"
  }
  ```
- **输出**：
  ```json
  {
    "appointmentId": "string",
    "status": "string",
    "paymentRequired": "boolean",
    "paymentUrl": "string", // 如需支付
    "confirmationDetails": "object"
  }
  ```
- **依赖**：AppointmentRepository、PaymentService

#### 3.6.3 获取顾问客户列表函数 (consultant/getClients)
- **功能**：获取顾问的客户列表
- **输入**：
  ```json
  {
    "consultantId": "string",
    "filters": "object", // 可选筛选条件
    "pagination": "object"
  }
  ```
- **输出**：
  ```json
  {
    "clients": [
      {
        "userId": "string",
        "name": "string",
        "pathway": "string",
        "status": "string",
        "lastActivity": "date",
        "priority": "number"
      }
    ],
    "totalCount": "number",
    "pagination": "object"
  }
  ```
- **依赖**：UserRepository、WorkspaceRepository

### 3.7 工作区域 (Workspace)

#### 3.7.1 获取工作区函数 (workspace/getWorkspace)
- **功能**：获取客户-顾问协作工作区
- **输入**：
  ```json
  {
    "workspaceId": "string"
  }
  ```
- **输出**：
  ```json
  {
    "workspaceId": "string",
    "client": "object",
    "consultant": "object",
    "sharedDocuments": ["array of document objects"],
    "tasks": ["array of task objects"],
    "conversations": ["array of message objects"],
    "createdDate": "date",
    "lastActivity": "date"
  }
  ```
- **依赖**：WorkspaceRepository

#### 3.7.2 创建任务函数 (workspace/createTask)
- **功能**：在工作区创建任务
- **输入**：
  ```json
  {
    "workspaceId": "string",
    "creatorId": "string",
    "assigneeId": "string",
    "title": "string",
    "description": "string",
    "dueDate": "date",
    "priority": "string"
  }
  ```
- **输出**：
  ```json
  {
    "taskId": "string",
    "status": "string",
    "createdDate": "date"
  }
  ```
- **依赖**：WorkspaceRepository、NotificationService

#### 3.7.3 发送消息函数 (workspace/sendMessage)
- **功能**：在工作区发送消息
- **输入**：
  ```json
  {
    "workspaceId": "string",
    "senderId": "string",
    "content": "string",
    "attachments": ["array of attachment objects"]
  }
  ```
- **输出**：
  ```json
  {
    "messageId": "string",
    "timestamp": "datetime",
    "status": "string"
  }
  ```
- **依赖**：WorkspaceRepository、NotificationService

### 3.8 仪表盘域 (Dashboard)

#### 3.8.1 获取用户仪表盘函数 (dashboard/getUserDashboard)
- **功能**：获取用户仪表盘数据
- **输入**：
  ```json
  {
    "userId": "string"
  }
  ```
- **输出**：
  ```json
  {
    "profileCompletion": "number",
    "pathway": "object",
    "nextSteps": ["array of step objects"],
    "recentDocuments": ["array of document objects"],
    "upcomingDeadlines": ["array of deadline objects"],
    "notifications": ["array of notification objects"]
  }
  ```
- **依赖**：UserRepository、AssessmentRepository、DocumentRepository

#### 3.8.2 获取顾问仪表盘函数 (consultant/getDashboard)
- **功能**：获取顾问仪表盘数据
- **输入**：
  ```json
  {
    "consultantId": "string"
  }
  ```
- **输出**：
  ```json
  {
    "activeClients": "number",
    "pendingTasks": ["array of task objects"],
    "upcomingAppointments": ["array of appointment objects"],
    "clientsByStatus": "object",
    "recentActivities": ["array of activity objects"],
    "notifications": ["array of notification objects"]
  }
  ```
- **依赖**：ConsultantRepository、WorkspaceRepository、AppointmentRepository

## 4. 数据模型设计

### 4.0 辅助服务

#### 4.0.1 模式映射服务 (ModeMapperService)

```javascript
// 负责在对话模式和表单模式之间映射数据
class ModeMapperService {
  constructor(openaiClient) {
    this.openaiClient = openaiClient;
  }
  
  // 从对话模式映射到表单模式
  async mapConversationToForm(userId, conversationHistory) {
    // 分析对话历史
    const extractedData = await this.extractStructuredDataFromConversation(conversationHistory);
    
    // 确定应该聚焦的表单区段
    const focusSection = this.determineFocusSection(extractedData, conversationHistory);
    
    // 生成表单初始化数据
    return {
      formData: extractedData,
      focusSection,
      completenessEstimate: this.calculateCompleteness(extractedData)
    };
  }
  
  // 从表单模式映射到对话模式
  async mapFormToConversation(userId, formData, currentSection) {
    // 构建合成对话历史
    const syntheticHistory = await this.generateSyntheticConversation(formData);
    
    // 确定下一个应该询问的问题
    const nextQuestion = await this.determineNextQuestion(formData, currentSection);
    
    return {
      conversationHistory: syntheticHistory,
      nextQuestion,
      context: {
        currentTopic: currentSection,
        knownData: formData
      }
    };
  }
  
  // 辅助方法...
}
```

### 4.1 用户数据模型 (MongoDB)

```javascript
// users 集合
{
  "_id": "ObjectId", // 用户ID
  "email": "string", // 电子邮件
  "name": "string", // 用户姓名
  "role": "string", // 角色：guest, client, consultant, admin
  "status": "string", // 状态：active, inactive, suspended
  "createdAt": "date", // 创建时间
  "lastLogin": "date", // 最后登录时间
  "profile": {
    "personalInfo": {
      "dateOfBirth": "date",
      "nationality": "string",
      "currentCountry": "string",
      "address": {
        "street": "string",
        "city": "string",
        "province": "string",
        "postalCode": "string",
        "country": "string"
      },
      "phone": "string",
      "gender": "string",
      "maritalStatus": "string"
    },
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "field": "string",
        "startDate": "date",
        "endDate": "date",
        "country": "string",
        "completed": "boolean"
      }
    ],
    "workExperience": [
      {
        "employer": "string",
        "position": "string",
        "description": "string",
        "startDate": "date",
        "endDate": "date",
        "country": "string",
        "hoursPerWeek": "number",
        "isCurrentJob": "boolean",
        "nocCode": "string"
      }
    ],
    "languageSkills": [
      {
        "language": "string",
        "test": "string", // IELTS, CELPIP, TEF, etc.
        "speaking": "number",
        "listening": "number",
        "reading": "number",
        "writing": "number",
        "testDate": "date"
      }
    ],
    "familyInfo": [
      {
        "relation": "string",
        "name": "string",
        "dateOfBirth": "date",
        "citizenship": "string",
        "immigrationStatus": "string"
      }
    ],
    "travelHistory": [
      {
        "country": "string",
        "purpose": "string",
        "entryDate": "date",
        "exitDate": "date"
      }
    ],
    "financialInfo": {
      "savings": "number",
      "assets": "number",
      "currency": "string"
    },
    "profileCompleteness": {
      "overall": "number",
      "personalInfo": "number",
      "education": "number",
      "workExperience": "number",
      "languageSkills": "number",
      "familyInfo": "number",
      "travelHistory": "number",
      "financialInfo": "number"
    }
  },
  "preferences": {
    "language": "string", // 界面语言
    "notifications": "object", // 通知偏好
    "dataCollectionMode": "string", // 偏好的数据收集模式："conversation" 或 "form"
    "modeTransitions": [
      {
        "fromMode": "string",
        "toMode": "string",
        "timestamp": "date",
        "section": "string", // 切换时的区段/主题
        "completedDataSnapshot": "object" // 切换时的数据快照
      }
    ]
  },
  "subscription": {
    "plan": "string",
    "startDate": "date",
    "endDate": "date",
    "status": "string",
    "paymentMethod": "object"
  }
}

// consultantProfiles 集合
{
  "_id": "ObjectId", // 与users集合中的_id相同
  "consultantId": "string", // 顾问ID
  "professionalInfo": {
    "licenseNumber": "string",
    "licenseType": "string",
    "expiryDate": "date",
    "memberships": ["array of strings"],
    "yearsOfExperience": "number"
  },
  "specialties": ["array of strings"], // 专长领域
  "languages": ["array of strings"], // 语言能力
  "education": ["array of education objects"],
  "biography": "string", // 个人简介
  "services": [
    {
      "name": "string",
      "description": "string",
      "duration": "number", // 分钟
      "price": "number",
      "currency": "string"
    }
  ],
  "availability": {
    "timezone": "string",
    "weeklySchedule": "object", // 每周可用时间
    "exceptions": ["array of date objects"] // 特殊日期
  },
  "rating": {
    "average": "number",
    "count": "number"
  },
  "successRate": "number" // 案例成功率
}
```

### 4.2 评估数据模型 (MongoDB)

```javascript
// assessments 集合
{
  "_id": "ObjectId", // 评估ID
  "userId": "string", // 用户ID
  "status": "string", // 状态：in-progress, completed, expired
  "type": "string", // 评估类型
  "startedAt": "date", // 开始时间
  "completedAt": "date", // 完成时间
  "currentStep": "number", // 当前步骤
  "steps": [
    {
      "stepId": "string",
      "title": "string",
      "description": "string",
      "data": "object", // 步骤收集的数据
      "completedAt": "date"
    }
  ],
  "results": {
    "overallEligibility": "string",
    "expressEntryScore": "number",
    "programEligibility": {
      "fsw": "boolean",
      "cec": "boolean",
      "fst": "boolean",
      "pnp": "object" // 各省提名项目资格
    },
    "recommendedPathways": [
      {
        "pathwayId": "string",
        "name": "string",
        "score": "number", // 匹配度
        "processingTime": "string",
        "successProbability": "number",
        "keyFactors": ["array of factor objects"]
      }
    ],
    "improvementAreas": ["array of area objects"],
    "analysisNotes": "string"
  }
}

// pathways 集合
{
  "_id": "ObjectId", // 路径ID
  "userId": "string", // 用户ID
  "name": "string", // 路径名称
  "description": "string", // 路径描述
  "status": "string", // 状态：active, completed, abandoned
  "selectedAt": "date", // 选择时间
  "estimatedTimeline": [
    {
      "stage": "string",
      "description": "string",
      "estimatedStartDate": "date",
      "estimatedEndDate": "date",
      "actualStartDate": "date",
      "actualEndDate": "date",
      "status": "string"
    }
  ],
  "requiredForms": ["array of form IDs"],
  "requiredDocuments": ["array of document type strings"],
  "notes": "string"
}
```

### 4.3 文档数据模型 (MongoDB + S3/Blob References)

```javascript
// documents 集合
{
  "_id": "ObjectId", // 文档ID
  "userId": "string", // 用户ID
  "filename": "string", // 原始文件名
  "fileSize": "number", // 文件大小(bytes)
  "mimeType": "string", // 文件类型
  "storageKey": "string", // S3/Blob存储键
  "uploadedAt": "date", // 上传时间
  "documentType": "string", // 文档类型
  "description": "string", // 文档描述
  "tags": ["array of strings"], // 标签
  "status": "string", // 状态：uploaded, processed, verified, rejected
  "analysis": {
    "processedAt": "date",
    "extractedData": "object", // OCR/分析提取的数据
    "confidence": "number", // 分析置信度
    "issues": ["array of issue objects"]
  },
  "verification": {
    "verifiedAt": "date",
    "verifiedBy": "string", // 用户ID或系统
    "status": "string",
    "notes": "string"
  }
}
```

### 4.4 表格数据模型 (MongoDB)

```javascript
// formTemplates 集合
{
  "_id": "ObjectId", // 模板ID
  "code": "string", // 表格代码(如IMM0008)
  "name": "string", // 表格名称
  "description": "string", // 表格描述
  "version": "string", // 版本号
  "effectiveDate": "date", // 生效日期
  "expiryDate": "date", // 过期日期
  "program": "string", // 相关移民项目
  "language": "string", // 语言
  "fields": [
    {
      "id": "string", // 字段ID
      "path": "string", // 字段路径
      "type": "string", // 字段类型
      "label": "string", // 字段标签
      "helpText": "string", // 帮助文本
      "required": "boolean", // 是否必填
      "validation": "object", // 验证规则
      "options": ["array of option objects"] // 选项(如下拉框)
    }
  ],
  "sections": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "fieldIds": ["array of field IDs"]
    }
  ],
  "mappingRules": [
    {
      "fieldId": "string",
      "userDataPath": "string", // 用户资料字段路径
      "transformationRule": "string" // 转换规则
    }
  ]
}

// generatedForms 集合
{
  "_id": "ObjectId", // 生成表格ID
  "userId": "string", // 用户ID
  "templateId": "string", // 模板ID
  "createdAt": "date", // 创建时间
  "updatedAt": "date", // 更新时间
  "status": "string", // 状态：draft, completed, submitted
  "data": "object", // 表格数据
  "validationResults": {
    "isValid": "boolean",
    "errors": ["array of error objects"],
    "warnings": ["array of warning objects"]
  },
  "submissionDetails": {
    "submittedAt": "date",
    "confirmationNumber": "string",
    "method": "string"
  },
  "pdfStorageKey": "string" // 生成PDF的存储键
}
```

### 4.5 协作数据模型 (MongoDB)

```javascript
// workspaces 集合
{
  "_id": "ObjectId", // 工作区ID
  "clientId": "string", // 客户ID
  "consultantId": "string", // 顾问ID
  "createdAt": "date", // 创建时间
  "lastActivityAt": "date", // 最后活动时间
  "status": "string", // 状态：active, closed
  "sharedDocuments": [
    {
      "documentId": "string",
      "sharedAt": "date",
      "sharedBy": "string",
      "permissions": "string" // 权限：read, comment, edit
    }
  ],
  "tasks": [
    {
      "taskId": "string",
      "title": "string",
      "description": "string",
      "assignedBy": "string",
      "assignedTo": "string",
      "createdAt": "date",
      "dueDate": "date",
      "priority": "string",
      "status": "string",
      "completedAt": "date"
    }
  ]
}

// messages 集合
{
  "_id": "ObjectId", // 消息ID
  "workspaceId": "string", // 工作区ID
  "senderId": "string", // 发送者ID
  "senderRole": "string", // 发送者角色
  "content": "string", // 消息内容
  "sentAt": "date", // 发送时间
  "readAt": "date", // 阅读时间
  "attachments": [
    {
      "type": "string", // 附件类型
      "name": "string", // 附件名称
      "url": "string", // 附件URL
      "size": "number" // 附件大小
    }
  ]
}

// appointments 集合
{
  "_id": "ObjectId", // 预约ID
  "clientId": "string", // 客户ID
  "consultantId": "string", // 顾问ID
  "workspaceId": "string", // 关联工作区ID
  "type": "string", // 预约类型
  "startTime": "date", // 开始时间
  "endTime": "date", // 结束时间
  "status": "string", // 状态：scheduled, completed, cancelled
  "notes": "string", // 备注
  "createdAt": "date", // 创建时间
  "paymentStatus": "string", // 支付状态
  "meetingLink": "string" // 会议链接
}
```

## 5. API 设计

### 5.1 API 基础架构

- **基础URL**: `https://api.thinkforwardai.com/v1`
- **认证**: Bearer Token (JWT)
- **内容类型**: application/json
- **错误处理**: 标准HTTP状态码 + 详细错误信息

### 5.2 统一响应格式

```json
// 成功响应
{
  "success": true,
  "data": {}, // 响应数据
  "meta": {} // 元数据(分页等)
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "string", // 错误代码
    "message": "string", // 用户友好错误消息
    "details": {} // 详细错误信息
  }
}
```

### 5.3 API 端点设计

下面列出核心API端点，确保前后端一致性：

#### 认证API

```
POST /auth/login - 用户登录
POST /auth/register - 用户注册
POST /auth/refresh-token - 刷新令牌
POST /auth/forgot-password - 忘记密码
POST /auth/reset-password - 重置密码
POST /auth/logout - 用户登出
```

#### 用户资料API

```
GET /profile - 获取当前用户资料
PATCH /profile - 更新用户资料
GET /profile/completeness - 获取资料完整度
POST /profile/conversation - 对话式资料收集
POST /profile/form - 表单式资料收集
POST /profile/switch-mode - 切换数据收集模式
```

#### 评估API

```
POST /assessments - 创建新评估
GET /assessments - 获取用户评估列表
GET /assessments/{id} - 获取特定评估
POST /assessments/{id}/steps/{stepId} - 提交评估步骤
GET /assessments/{id}/result - 获取评估结果
```

#### 路径API

```
GET /pathways - 获取可用移民路径
POST /pathways/compare - 比较多个移民路径
POST /pathways/select - 选择移民路径
GET /pathways/{id} - 获取特定路径详情
GET /pathways/{id}/timeline - 获取路径时间线
```

#### 文档API

```
POST /documents - 上传新文档
GET /documents - 获取用户文档列表
GET /documents/{id} - 获取特定文档
POST /documents/{id}/analyze - 分析文档
DELETE /documents/{id} - 删除文档
```

#### 表格API

```
GET /forms/templates - 获取表格模板列表
POST /forms/generate - 生成表格
GET /forms - 获取用户表格列表
GET /forms/{id} - 获取特定表格
PATCH /forms/{id} - 更新表格字段
GET /forms/{id}/download - 下载表格PDF
POST /forms/{id}/submit - 提交表格
```

#### 顾问API

```
GET /consultants - 获取顾问列表
GET /consultants/{id} - 获取顾问详情
POST /consultants/match - 匹配合适顾问
GET /consultants/{id}/availability - 获取顾问可用时间
POST /consultants/{id}/appointments - 创建顾问预约
```

#### 工作区API

```
GET /workspaces - 获取用户工作区列表
GET /workspaces/{id} - 获取特定工作区
POST /workspaces/{id}/messages - 发送工作区消息
GET /workspaces/{id}/messages - 获取工作区消息
POST /workspaces/{id}/tasks - 创建工作区任务
PATCH /workspaces/{id}/tasks/{taskId} - 更新任务状态
```

#### 仪表盘API

```
GET /dashboard - 获取用户仪表盘数据
GET /dashboard/stats - 获取仪表盘统计数据
GET /dashboard/notifications - 获取通知
```

#### 管理员API

```
GET /admin/users - 获取用户列表
GET /admin/stats - 获取系统统计数据
PATCH /admin/settings - 更新系统设置
```

## 6. OpenAI API 集成

为了实现自动表格填充、对话式数据收集和文档分析，系统需要深度集成OpenAI API。

### 6.1 中央OpenAI客户端服务

创建集中式OpenAI客户端服务，管理所有AI相关请求：

```javascript
// openai-client.js
class OpenAIClient {
  constructor() {
    this.api = new OpenAIAPI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.defaultModel = 'gpt-4';
  }
  
  async createCompletion(options) {
    const defaultOptions = {
      model: this.defaultModel,
      temperature: 0.7,
      max_tokens: 1000
    };
    
    try {
      const response = await this.api.createChatCompletion({
        ...defaultOptions,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
  
  async createEmbedding(text) {
    try {
      const response = await this.api.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text
      });
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('OpenAI Embedding Error:', error);
      throw new Error(`OpenAI Embedding Error: ${error.message}`);
    }
  }
}
```

### 6.2 领域特定AI封装

为各个业务领域创建专用AI服务：

#### 6.2.1 对话式数据收集AI

```javascript
// conversation-collector.js
class ConversationCollector {
  constructor(openaiClient) {
    this.openaiClient = openaiClient;
  }
  
  async processMessage(userId, message, context) {
    // 构建提示模板
    const prompt = this.buildPrompt(userId, message, context);
    
    // 调用OpenAI
    const completion = await this.openaiClient.createCompletion({
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        ...context.history,
        { role: 'user', content: message }
      ],
      temperature: 0.4
    });
    
    // 解析响应
    const response = completion.choices[0].message.content;
    const extractedData = this.extractStructuredData(response);
    
    return {
      nextQuestion: this.extractQuestion(response),
      extractedData,
      progress: this.calculateProgress(context, extractedData)
    };
  }
  
  getSystemPrompt() {
    return `你是ThinkForward AI的数据收集助手，专门帮助用户完成加拿大移民申请所需的个人资料。你的目标是通过自然对话方式，高效地收集准确、完整的用户信息。每次对话中，你应该：
1. 提出清晰、具体的问题
2. 解释为什么这些信息很重要
3. 从用户回答中提取结构化数据
4. 在适当时候提供指导和帮助
请确保你的语气专业友好，并尊重用户隐私。`;
  }
  
  // 其他辅助方法...
}
```

#### 6.2.2 表格填充AI

```javascript
// form-filler.js
class FormFiller {
  constructor(openaiClient) {
    this.openaiClient = openaiClient;
  }
  
  async mapUserDataToForm(userData, formTemplate) {
    // 构建提示
    const prompt = `
我需要将用户资料映射到加拿大移民表格字段。

用户资料:
${JSON.stringify(userData, null, 2)}

表格模板:
${JSON.stringify(formTemplate.fields, null, 2)}

请为每个表格字段提供:
1. 映射的数据值
2. 数据来源（用户资料中的路径）
3. 置信度（高/中/低）
4. 可能的问题或注意事项

以JSON格式返回结果。
`;
    
    // 调用OpenAI
    const completion = await this.openaiClient.createCompletion({
      messages: [
        { role: 'system', content: 'You are an expert in Canadian immigration forms.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    });
    
    // 解析响应
    return this.parseMapping(completion.choices[0].message.content);
  }
  
  async validateFormData(formData, formTemplate) {
    // 实现表格数据验证逻辑
    // ...
  }
  
  // 其他辅助方法...
}
```

#### 6.2.3 文档分析AI

```javascript
// document-analyzer.js
class DocumentAnalyzer {
  constructor(openaiClient) {
    this.openaiClient = openaiClient;
  }
  
  async extractInformation(documentText, documentType) {
    // 构建提示
    const prompt = `
请从以下${documentType}中提取关键信息:

${documentText}

请提取并返回以下字段（如果存在）:
- 全名
- 出生日期
- 文档编号
- 签发日期
- 过期日期
- 签发机构

以JSON格式返回结果。如果某字段不存在，请标记为"Not Available"。
`;
    
    // 调用OpenAI
    const completion = await this.openaiClient.createCompletion({
      messages: [
        { role: 'system', content: 'You are an expert document analyzer for immigration documents.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    });
    
    // 解析响应
    return this.parseExtractionResult(completion.choices[0].message.content);
  }
  
  // 其他辅助方法...
}
```

### 6.3 提示模板系统

创建集中管理的提示模板系统，确保AI交互一致性：

```javascript
// prompt-templates.js
const templates = {
  // 对话式数据收集模板
  profileCollection: {
    personalInfo: (context) => `
请通过自然对话收集用户的个人基本信息。目前已知信息:
${JSON.stringify(context.knownData, null, 2)}

请询问用户下一个最重要的缺失信息，解释为什么这个信息对移民申请很重要，并以友好的语气提问。
`,
    
    workExperience: (context) => `
请收集用户的工作经历信息，这对评估Express Entry非常重要。目前已知信息:
${JSON.stringify(context.knownData, null, 2)}

请询问用户下一个关于工作经历的重要信息，确保收集到职位名称、雇主名称、工作时间段、职责描述等细节。
`
    // 其他类别的模板...
  },
  
  // 表格填充模板
  formFilling: {
    mapping: (userData, formFields) => `
请将以下用户资料映射到加拿大移民表格字段:

用户资料:
${JSON.stringify(userData, null, 2)}

表格字段:
${JSON.stringify(formFields, null, 2)}

请为每个表格字段提供最佳匹配的数据和来源。
`,
    
    validation: (formData, formRules) => `
请验证以下填写的表格数据是否符合加拿大移民表格的要求:

表格数据:
${JSON.stringify(formData, null, 2)}

验证规则:
${JSON.stringify(formRules, null, 2)}

请指出任何错误、不一致或可能引起问题的地方。
`
  },
  
  // 文档分析模板
  documentAnalysis: {
    extraction: (documentText, documentType) => `
从以下${documentType}文档中提取关键信息:

${documentText}

请识别并返回所有重要的身份信息、日期、编号和状态信息。
`,
    
    verification: (extractedData, expectedData) => `
请验证从文档中提取的数据与用户提供的资料是否一致:

提取数据:
${JSON.stringify(extractedData, null, 2)}

预期数据:
${JSON.stringify(expectedData, null, 2)}

请指出任何不一致之处及其严重程度。
`
  }
};
```

## 7. 安全与合规

### 7.1 认证与授权策略

使用JWT和基于角色的访问控制:

```javascript
// auth-middleware.js
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'unauthorized',
        message: '未授权访问'
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'invalid_token',
        message: '无效或过期的令牌'
      }
    });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'unauthorized',
          message: '未授权访问'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'forbidden',
          message: '没有足够权限执行此操作'
        }
      });
    }
    
    next();
  };
}
```

### 7.2 数据保护措施

实施端到端数据保护:

- **传输中加密**: 使用TLS/SSL
- **存储加密**: 敏感字段加密
- **访问控制**: 严格的数据访问策略
- **数据最小化**: 只收集必要信息

### 7.3 合规考量

确保符合加拿大隐私法规:

- **PIPEDA合规**: 用户控制和知情同意
- **数据保留策略**: 明确的数据保留期限
- **数据可移植性**: 允许用户导出自己的数据
- **隐私政策**: 透明的数据使用说明

## 8. 部署与运维

### 8.1 基础设施即代码

使用Serverless Framework定义基础设施:

```yaml
# serverless.yml
service: thinkforward-ai-mvp

provider:
  name: aws
  runtime: nodejs16.x
  region: us-east-1
  environment:
    MONGODB_URI: ${ssm:/thinkforward/mongodb-uri}
    OPENAI_API_KEY: ${ssm:/thinkforward/openai-api-key}
    JWT_SECRET: ${ssm:/thinkforward/jwt-secret}
    STAGE: ${opt:stage, 'dev'}

functions:
  # 认证函数
  authLogin:
    handler: src/functions/auth/login.handler
    events:
      - http:
          path: /auth/login
          method: post
          cors: true
  
  authRegister:
    handler: src/functions/auth/register.handler
    events:
      - http:
          path: /auth/register
          method: post
          cors: true
  
  # 用户资料函数
  getUserProfile:
    handler: src/functions/profile/getUserProfile.handler
    events:
      - http:
          path: /profile
          method: get
          cors: true
          authorizer: jwtAuthorizer
  
  # 更多函数定义...
```

### 8.2 CI/CD管道

GitHub Actions工作流:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main, staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          if [[ $GITHUB_REF == 'refs/heads/main' ]]; then
            STAGE=prod npm run deploy
          else
            STAGE=staging npm run deploy
          fi
```

### 8.3 监控与日志

设置全面的监控和日志系统:

- **CloudWatch Logs**: 服务器端日志
- **CloudWatch Metrics**: 性能指标
- **Sentry**: 前端错误追踪
- **Application Insights**: 用户行为分析

## 9. 开发与测试

### 9.1 开发环境设置

本地开发环境:

```javascript
// 开发依赖
{
  "devDependencies": {
    "serverless": "^2.72.0",
    "serverless-offline": "^8.5.0",
    "jest": "^27.5.1",
    "eslint": "^8.19.0",
    "prettier": "^2.6.2",
    "husky": "^7.0.4",
    "lint-staged": "^12.3.7"
  },
  "scripts": {
    "start": "serverless offline start",
    "test": "jest",
    "lint": "eslint src",
    "format": "prettier --write \"src/**/*.js\"",
    "deploy": "serverless deploy --stage $STAGE"
  }
}
```

### 9.2 测试策略

全面的测试策略:

- **单元测试**: 使用Jest测试独立功能
- **集成测试**: 测试API端点和服务交互
- **端到端测试**: 使用Cypress测试完整用户流程
- **提示模板测试**: 验证AI交互质量

## 10. MVP功能优先级

### 第一阶段: 核心功能 (1-2个月)

1. 用户认证与基础资料管理
2. 对话式评估和路径建议
3. 基础表格生成 (支持2-3种关键表格)
4. 简单文档上传与管理
5. 简约的用户仪表盘
6. 双模式数据收集与无缝切换功能

### 第二阶段: 增强功能 (2-3个月)

1. 双模式数据收集 (对话/表单)
2. 高级表格填充与验证
3. 文档智能分析
4. 顾问匹配与预约
5. 基础协作工作区

### 第三阶段: 完善功能 (1-2个月)

1. 完整的顾问工具套件
2. 高级文档管理和分析
3. 表格批量生成与管理
4. 多语言支持增强
5. 性能优化与用户体验改进

以上架构设计专注于ThinkForward AI的MVP阶段，采用serverless架构以减少运维负担，同时确保可扩展性。设计简约而现代，以用户体验为中心，符合Wealthsimple的设计风格。每个模块职责明确，接口定义清晰，确保前后端一致性和高效的开发流程。
