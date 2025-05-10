# ThinkForward AI 前端仪表盘页面文档

本文档描述了ThinkForward AI平台的客户仪表盘页面实现，包括页面结构、组件使用和后端集成点。

## 客户仪表盘页面 (`/dashboard`)

### 页面概述

客户仪表盘是用户登录后的主页面，提供用户移民进度的概览和快速访问各项功能的入口。页面采用响应式设计，适配不同设备尺寸，并使用DashboardLayout组件提供一致的布局结构。

### 页面结构

页面由以下几个主要部分组成：

1. **欢迎卡片**：显示用户姓名、当前移民路径和个人资料完成度
2. **评估结果**：展示用户的评估分数和各项评分明细
3. **下一步任务**：列出用户需要完成的任务及其状态
4. **最近文档**：显示用户最近上传或修改的文档
5. **即将到来的预约**：显示用户即将进行的顾问咨询预约
6. **快速链接**：提供常用功能的快速访问入口

### 使用的组件

- `DashboardLayout`：提供带侧边栏和顶部导航的布局结构
- `Card`：用于各个内容区块的容器
- `Badge`：用于状态标签和通知计数
- `Progress`：用于显示进度条（如个人资料完成度和评分明细）
- `Button`：用于各种操作按钮
- `Link`：用于页面导航链接

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`dashboard`部分。

```json
"dashboard": {
  "title": "仪表盘",
  "description": "查看您的移民进度和下一步操作。",
  "welcome": "欢迎，{{name}}",
  "currentPath": "当前移民路径",
  ...
}
```

### 数据结构

仪表盘页面需要从后端获取以下数据结构：

```typescript
// 用户基本信息
interface UserDashboardData {
  name: string;
  email: string;
  profileCompletion: number; // 百分比
  immigrationPath: string;
  nextSteps: NextStep[];
  recentDocuments: Document[];
  upcomingAppointments: Appointment[];
  assessmentResults: AssessmentResult;
}

// 下一步任务
interface NextStep {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string; // ISO日期格式
}

// 文档
interface Document {
  id: number;
  name: string;
  type: string; // 文件类型，如pdf, docx等
  updatedAt: string; // ISO日期格式
}

// 预约
interface Appointment {
  id: number;
  title: string;
  date: string; // ISO日期格式
  time: string; // 时间范围，如"14:00-15:00"
  consultant: string;
}

// 评估结果
interface AssessmentResult {
  score: number;
  category: string;
  lastUpdated: string; // ISO日期格式
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}
```

### 后端集成点

仪表盘页面需要与以下后端API端点集成：

1. **获取仪表盘数据**：
   - 端点：`/api/dashboard`
   - 方法：`GET`
   - 返回：包含用户信息、任务、文档、预约和评估结果的综合数据

2. **更新任务状态**：
   - 端点：`/api/tasks/{taskId}`
   - 方法：`PATCH`
   - 数据：`{ status: 'pending' | 'in-progress' | 'completed' }`

3. **添加新任务**：
   - 端点：`/api/tasks`
   - 方法：`POST`
   - 数据：`{ title: string, dueDate: string }`

4. **上传文档**：
   - 端点：`/api/documents/upload`
   - 方法：`POST`
   - 数据：FormData包含文件和元数据

5. **预约管理**：
   - 端点：`/api/appointments/{appointmentId}`
   - 方法：`PATCH`（重新安排）或`DELETE`（取消）

### 服务器端渲染

页面使用Next.js的`getServerSideProps`进行服务器端渲染，确保页面内容是基于用户的最新数据。这也允许实现认证检查，未认证的用户会被重定向到登录页面。

```typescript
export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
  // 检查认证状态
  const session = await getSession(req);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  
  // 获取仪表盘数据
  const dashboardData = await fetchDashboardData(session.user.id);
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
      dashboardData,
    },
  };
};
```

### 状态管理

仪表盘页面使用React Query进行服务器状态管理，实现数据缓存、重新获取和乐观更新：

```typescript
// 获取仪表盘数据
const { data, isLoading, error } = useQuery(
  ['dashboard'],
  () => fetchDashboardData(),
  {
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    refetchOnWindowFocus: true,
  }
);

// 更新任务状态
const updateTaskMutation = useMutation(
  (data: { taskId: number; status: string }) => 
    updateTaskStatus(data.taskId, data.status),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard']);
    },
  }
);
```

### 性能优化

1. **组件分割**：将大型组件分割为更小的子组件，提高可维护性和性能
2. **图片优化**：使用Next.js的Image组件进行图片优化
3. **数据预取**：使用服务器端渲染预取初始数据
4. **懒加载**：非关键组件使用动态导入和懒加载

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 所有交互元素都可通过键盘访问
- 适当的ARIA标签和角色
- 足够的颜色对比度
- 响应式设计适应不同设备

### 待完成事项

- 实现实际的API集成，替换模拟数据
- 添加任务管理功能（添加、编辑、删除任务）
- 实现文档上传和预览功能
- 添加预约管理功能（预约、重新安排、取消）
- 实现实时通知功能
