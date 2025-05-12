# 顾问仪表盘页面技术规范

## 概述

顾问仪表盘是顾问用户登录后的主页面，提供顾问工作所需的关键信息和功能入口。页面设计注重信息的清晰展示和快速访问，帮助顾问高效管理客户、案例和日程。

## 页面路径

```
/consultant/dashboard
```

## 数据模型

### 顾问用户

```typescript
interface Consultant {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  title: string;
  specializations: string[];
  languages: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  bio: string;
  experience: number; // 年数
  rating: number;
  reviewCount: number;
  availability: {
    availableDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    availableHours: {
      start: string; // 格式: "HH:MM"
      end: string; // 格式: "HH:MM"
    };
    timezone: string;
  };
  status: 'active' | 'away' | 'offline';
  createdAt: string;
  updatedAt: string;
}
```

### 仪表盘统计数据

```typescript
interface DashboardStats {
  activeClients: number;
  pendingAppointments: number;
  completedCases: number;
  averageRating: number;
  recentActivity: {
    type: 'message' | 'appointment' | 'document' | 'case_update';
    timestamp: string;
    description: string;
    relatedId: string;
    relatedType: 'client' | 'case' | 'appointment';
  }[];
  upcomingAppointments: {
    id: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    startTime: string;
    endTime: string;
    type: string;
    status: 'scheduled' | 'confirmed' | 'cancelled';
  }[];
  pendingTasks: {
    id: string;
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    relatedId?: string;
    relatedType?: 'client' | 'case';
  }[];
}
```

## 组件结构

```
ConsultantDashboardPage
├── DashboardHeader
│   ├── ConsultantProfile (头像、姓名、状态切换)
│   └── QuickActions (快速操作按钮)
├── StatsSummary (关键统计数据)
│   ├── StatCard (活跃客户数)
│   ├── StatCard (待处理预约)
│   ├── StatCard (已完成案例)
│   └── StatCard (平均评分)
├── AppointmentsSection
│   ├── SectionHeader (标题和"查看全部"链接)
│   └── AppointmentList
│       └── AppointmentCard (多个)
├── TasksSection
│   ├── SectionHeader (标题和"查看全部"链接)
│   └── TaskList
│       └── TaskItem (多个)
├── RecentActivitySection
│   ├── SectionHeader (标题和"查看全部"链接)
│   └── ActivityFeed
│       └── ActivityItem (多个)
└── ClientsSection
    ├── SectionHeader (标题和"查看全部"链接)
    └── ClientList
        └── ClientCard (多个)
```

## API 端点

### 获取仪表盘数据

```
GET /api/consultant/{consultantId}/dashboard
```

响应:

```json
{
  "consultant": {
    "id": "cons-123",
    "userId": "user-456",
    "firstName": "李",
    "lastName": "明",
    "displayName": "李明",
    "email": "liming@example.com",
    "phone": "+86 123 4567 8901",
    "avatar": "https://example.com/avatars/liming.jpg",
    "title": "资深移民顾问",
    "specializations": ["技术移民", "企业家移民", "家庭团聚"],
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
    "bio": "10年加拿大移民咨询经验，专注技术移民和企业家移民",
    "experience": 10,
    "rating": 4.8,
    "reviewCount": 156,
    "availability": {
      "availableDays": ["monday", "tuesday", "wednesday", "thursday", "friday"],
      "availableHours": {
        "start": "09:00",
        "end": "18:00"
      },
      "timezone": "Asia/Shanghai"
    },
    "status": "active",
    "createdAt": "2020-01-15T08:00:00Z",
    "updatedAt": "2023-05-20T14:30:00Z"
  },
  "stats": {
    "activeClients": 24,
    "pendingAppointments": 5,
    "completedCases": 78,
    "averageRating": 4.8,
    "recentActivity": [
      {
        "type": "message",
        "timestamp": "2023-05-25T10:30:00Z",
        "description": "张三发送了新消息",
        "relatedId": "client-789",
        "relatedType": "client"
      },
      {
        "type": "appointment",
        "timestamp": "2023-05-25T09:15:00Z",
        "description": "与王五的预约已确认",
        "relatedId": "appointment-456",
        "relatedType": "appointment"
      },
      {
        "type": "document",
        "timestamp": "2023-05-24T16:45:00Z",
        "description": "李四上传了新文档",
        "relatedId": "client-101",
        "relatedType": "client"
      }
    ],
    "upcomingAppointments": [
      {
        "id": "appointment-123",
        "clientId": "client-789",
        "clientName": "张三",
        "clientAvatar": "https://example.com/avatars/zhangsan.jpg",
        "startTime": "2023-05-26T14:00:00Z",
        "endTime": "2023-05-26T15:00:00Z",
        "type": "初次咨询",
        "status": "confirmed"
      },
      {
        "id": "appointment-124",
        "clientId": "client-101",
        "clientName": "李四",
        "clientAvatar": "https://example.com/avatars/lisi.jpg",
        "startTime": "2023-05-27T10:30:00Z",
        "endTime": "2023-05-27T11:30:00Z",
        "type": "文件审核",
        "status": "scheduled"
      }
    ],
    "pendingTasks": [
      {
        "id": "task-001",
        "title": "审核张三的申请文件",
        "dueDate": "2023-05-28T23:59:59Z",
        "priority": "high",
        "status": "pending",
        "relatedId": "client-789",
        "relatedType": "client"
      },
      {
        "id": "task-002",
        "title": "准备王五的评估报告",
        "dueDate": "2023-05-30T23:59:59Z",
        "priority": "medium",
        "status": "in_progress",
        "relatedId": "case-202",
        "relatedType": "case"
      }
    ]
  }
}
```

## 状态管理

使用Zustand创建顾问仪表盘状态管理存储:

```typescript
interface ConsultantDashboardState {
  consultant: Consultant | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  setConsultant: (consultant: Consultant) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  updateConsultantStatus: (status: 'active' | 'away' | 'offline') => void;
  markTaskAsInProgress: (taskId: string) => void;
  markTaskAsCompleted: (taskId: string) => void;
  resetState: () => void;
}
```

## 页面功能

1. **状态切换**：顾问可以切换自己的状态（在线、离开、离线）
2. **数据概览**：显示关键统计数据（活跃客户数、待处理预约、已完成案例、平均评分）
3. **预约管理**：显示即将到来的预约，可以确认或取消
4. **任务管理**：显示待处理任务，可以标记为进行中或已完成
5. **活动记录**：显示最近的活动，如客户消息、文档上传等
6. **客户列表**：显示最近活跃的客户，可以快速访问客户详情

## 交互设计

1. **状态切换**：点击状态指示器，弹出下拉菜单选择状态
2. **预约操作**：预约卡片上提供确认、取消、重新安排按钮
3. **任务操作**：任务项上提供开始处理、标记完成按钮
4. **快速导航**：提供快速导航到客户管理、案例管理、日程管理的按钮
5. **通知提醒**：新消息、新预约等会在相应区域显示提醒标记

## 响应式设计

1. **桌面布局**：多列布局，充分利用宽屏空间
2. **平板布局**：减少列数，调整卡片大小
3. **移动布局**：单列布局，折叠部分内容，提供展开选项

## 实现注意事项

1. 使用React Query进行数据获取和缓存
   ```typescript
   // 在consultant-dashboard.ts中实现
   export const useConsultantDashboard = (consultantId: string) => {
     return useQuery({
       queryKey: ['consultantDashboard', consultantId],
       queryFn: async () => {
         const response = await apiClient.get<{
           consultant: Consultant;
           stats: DashboardStats;
         }>(`/api/consultant/${consultantId}/dashboard`);
         return response.data;
       },
       enabled: !!consultantId,
     });
   };
   ```

2. 实现错误处理和加载状态
   ```tsx
   // 加载状态处理
   if (isLoading) {
     return (
       <DashboardLayout>
         <LoadingState description={t('consultant.dashboard.loading')} />
       </DashboardLayout>
     );
   }
   
   // 错误状态处理
   if (error) {
     return (
       <DashboardLayout>
         <ErrorState
           title={t('consultant.dashboard.errorTitle')}
           description={error}
           retryAction={
             <Button onClick={() => dashboardQuery.refetch()}>
               {t('common.retry')}
             </Button>
           }
         />
       </DashboardLayout>
     );
   }
   ```

3. 实现国际化支持
   ```tsx
   const { t } = useTranslation('common');
   
   // 使用翻译键
   <h3 className="text-lg font-semibold">
     {t('consultant.dashboard.title')}
   </h3>
   ```

4. 实现响应式设计
   ```tsx
   {/* 统计数据 */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     {/* 统计卡片 */}
   </div>
   
   {/* 内容区域 */}
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     {/* 左侧：预约和任务 */}
     <div className="lg:col-span-2 space-y-6">
       {/* 预约和任务内容 */}
     </div>
     
     {/* 右侧：活动和客户 */}
     <div className="space-y-6">
       {/* 活动和客户内容 */}
     </div>
   </div>
   ```

5. 实现状态管理与更新
   ```typescript
   // 状态更新示例
   const handleStatusChange = async (status: 'active' | 'away' | 'offline') => {
     try {
       await updateStatusMutation.mutateAsync({
         consultantId,
         status,
       });
       updateConsultantStatus(status);
     } catch (error) {
       setError((error as Error)?.message || '更新状态失败');
     }
   };
   ```

## 与其他页面的关联

- 从仪表盘可以导航到客户管理、案例管理、日程管理等页面
- 点击客户卡片可以进入客户详情页
- 点击预约可以进入预约详情页
- 点击任务可以进入任务详情页或相关客户/案例页面

## 安全考虑

1. 确保只有已认证的顾问用户可以访问仪表盘
2. 实现适当的权限检查，确保顾问只能看到自己的数据
3. 保护敏感客户信息，遵循数据保护规定

## 已实现的文件结构

```
frontend/
├── pages/
│   └── consultant/
│       └── dashboard.tsx         # 顾问仪表盘页面
├── lib/
│   ├── api/
│   │   └── services/
│   │       └── consultant-dashboard.ts  # 顾问仪表盘API服务
│   └── store/
│       └── zustand/
│           └── useConsultantDashboardStore.ts  # 顾问仪表盘状态管理
```

## 实现细节

### 页面组件实现

顾问仪表盘页面已实现以下功能：

1. **顾问状态管理**：顾问可以切换自己的在线状态（在线、离开、离线）
2. **统计数据展示**：显示活跃客户数、待处理预约、已完成案例和平均评分
3. **预约管理**：显示即将到来的预约，支持确认和取消操作
4. **任务管理**：显示待处理任务，支持将任务标记为进行中或已完成
5. **活动记录**：显示最近的活动，包括消息、预约、文档和案例更新
6. **响应式布局**：适配桌面、平板和移动设备

### 状态管理实现

使用Zustand实现了顾问仪表盘的状态管理，主要功能包括：

1. **数据存储**：存储顾问信息和仪表盘统计数据
2. **状态更新**：提供更新顾问状态、任务状态的方法
3. **错误处理**：提供错误状态管理和重置功能
4. **持久化**：使用persist中间件实现状态持久化

### API服务实现

使用React Query实现了顾问仪表盘的API服务，主要功能包括：

1. **数据获取**：获取仪表盘数据、预约列表、任务列表和活动列表
2. **状态更新**：更新顾问状态、任务状态、预约状态
3. **缓存管理**：实现数据缓存和自动重新获取
4. **分页加载**：支持分页加载更多数据

## 后端集成要求

为了支持顾问仪表盘功能，后端需要实现以下API端点：

### 1. 获取仪表盘数据

```
GET /api/consultant/{consultantId}/dashboard
```

**响应格式**：
```json
{
  "consultant": {
    // 顾问信息
  },
  "stats": {
    "activeClients": 24,
    "pendingAppointments": 5,
    "completedCases": 78,
    "averageRating": 4.8,
    "recentActivity": [
      // 活动列表
    ],
    "upcomingAppointments": [
      // 预约列表
    ],
    "pendingTasks": [
      // 任务列表
    ]
  }
}
```

### 2. 更新顾问状态

```
PATCH /api/consultant/{consultantId}/status
```

**请求体**：
```json
{
  "status": "active" | "away" | "offline"
}
```

### 3. 更新任务状态

```
PATCH /api/tasks/{taskId}/status
```

**请求体**：
```json
{
  "status": "pending" | "in_progress" | "completed"
}
```

### 4. 确认预约

```
PATCH /api/appointments/{appointmentId}/confirm
```

### 5. 取消预约

```
PATCH /api/appointments/{appointmentId}/cancel
```

### 6. 分页获取数据

```
GET /api/consultant/{consultantId}/appointments?page={page}&limit={limit}
GET /api/consultant/{consultantId}/tasks?page={page}&limit={limit}
GET /api/consultant/{consultantId}/activities?page={page}&limit={limit}
```

## 数据库设计建议

为支持顾问仪表盘功能，建议后端数据库包含以下表结构：

1. **consultants**：存储顾问信息
   - id (主键)
   - user_id (外键，关联用户表)
   - first_name, last_name, display_name
   - email, phone
   - avatar
   - title
   - bio
   - experience
   - rating, review_count
   - status
   - created_at, updated_at

2. **consultant_specializations**：存储顾问专业领域
   - id (主键)
   - consultant_id (外键)
   - specialization

3. **consultant_languages**：存储顾问语言能力
   - id (主键)
   - consultant_id (外键)
   - language
   - proficiency

4. **consultant_availability**：存储顾问可用时间
   - id (主键)
   - consultant_id (外键)
   - day_of_week
   - start_time
   - end_time
   - timezone

5. **appointments**：存储预约信息
   - id (主键)
   - consultant_id (外键)
   - client_id (外键)
   - start_time, end_time
   - type
   - status
   - created_at, updated_at

6. **tasks**：存储任务信息
   - id (主键)
   - consultant_id (外键)
   - title
   - description
   - due_date
   - priority
   - status
   - related_id
   - related_type
   - created_at, updated_at

7. **activities**：存储活动信息
   - id (主键)
   - consultant_id (外键)
   - type
   - description
   - timestamp
   - related_id
   - related_type
   - created_at

## 测试要点

在实现后端API时，建议关注以下测试要点：

1. **权限验证**：确保只有已认证的顾问用户可以访问API
2. **数据隔离**：确保顾问只能访问自己的数据
3. **输入验证**：验证所有API输入，防止恶意请求
4. **错误处理**：提供清晰的错误消息和状态码
5. **性能测试**：测试API在高负载下的性能
6. **并发处理**：确保并发请求不会导致数据不一致
