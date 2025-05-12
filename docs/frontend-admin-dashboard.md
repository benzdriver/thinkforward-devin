# 管理员仪表盘页面技术规范

## 概述

管理员仪表盘页面是系统管理员的中心控制台，提供系统运行状态、用户统计、活动日志和健康指标的全面视图。该页面旨在帮助管理员监控系统性能、管理用户和快速响应潜在问题。

## 数据模型

### DashboardStats

```typescript
interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  activeConsultants: number;
  consultantGrowth: number;
  completedAssessments: number;
  assessmentGrowth: number;
  totalSessions: number;
  sessionGrowth: number;
  averageRating: number;
  revenueThisMonth: number;
  revenueGrowth: number;
}
```

### User

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
}
```

### SystemHealthMetric

```typescript
interface SystemHealthMetric {
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  threshold: number;
  details?: string;
}
```

### SystemHealth

```typescript
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  lastChecked: string;
  metrics: SystemHealthMetric[];
}
```

### SystemActivity

```typescript
interface SystemActivity {
  id: string;
  type: 'user' | 'system' | 'security';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
```

## 组件结构

### 页面组件

```
AdminDashboardPage
├── StatisticsCards
│   ├── UserStatsCard
│   ├── ConsultantStatsCard
│   ├── AssessmentStatsCard
│   └── SystemHealthCard
├── DashboardTabs
│   ├── RecentUsersTab
│   │   └── UsersTable
│   ├── SystemActivitiesTab
│   │   └── ActivityList
│   └── HealthMetricsTab
│       └── MetricCards
└── ActionButtons
    ├── SystemSettingsButton
    └── RefreshDataButton
```

### 状态管理

使用Zustand创建`useAdminDashboardStore`来管理管理员仪表盘状态：

```typescript
interface AdminDashboardState {
  stats: DashboardStats | null;
  users: User[] | null;
  recentActivities: SystemActivity[] | null;
  systemHealth: SystemHealth | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  
  // 操作方法
  setStats: (stats: DashboardStats) => void;
  setUsers: (users: User[]) => void;
  setRecentActivities: (activities: SystemActivity[]) => void;
  setSystemHealth: (health: SystemHealth) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDashboardData: () => Promise<void>;
  resetState: () => void;
}
```

## API服务

### 端点设计

```typescript
// 获取管理员仪表盘数据
GET /api/admin/dashboard

// 获取系统健康状态
GET /api/admin/system/health

// 获取系统活动日志
GET /api/admin/system/activities?page={page}&limit={limit}

// 获取最近注册用户
GET /api/admin/users/recent?page={page}&limit={limit}

// 重启系统服务
POST /api/admin/system/services/{serviceId}/restart

// 清除系统缓存
POST /api/admin/system/cache/clear

// 获取系统配置
GET /api/admin/system/config

// 更新系统配置
PATCH /api/admin/system/config
```

### API服务实现

```typescript
// admin-dashboard.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { DashboardStats, User, SystemActivity, SystemHealth } from '../../store/zustand/useAdminDashboardStore';

interface AdminDashboardData {
  stats: DashboardStats;
  users: User[];
  activities: SystemActivity[];
  health: SystemHealth;
}

// 获取管理员仪表盘数据
export const useAdminDashboardData = () => {
  const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get<AdminDashboardData>('/api/admin/dashboard');
    return response.data;
  };

  const query = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchAdminDashboardData,
  });

  return {
    ...query,
    fetchAdminDashboardData,
  };
};

// 获取系统健康状态
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const response = await apiClient.get<SystemHealth>('/api/admin/system/health');
      return response.data;
    },
  });
};

// 获取系统活动日志
export const useSystemActivities = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['systemActivities', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        activities: SystemActivity[];
        total: number;
      }>(`/api/admin/system/activities?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

// 获取最近注册用户
export const useRecentUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['recentUsers', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        users: User[];
        total: number;
      }>(`/api/admin/users/recent?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

// 重启系统服务
export const useRestartService = () => {
  return useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/admin/system/services/${serviceId}/restart`
      );
      return response.data;
    },
  });
};

// 清除系统缓存
export const useClearCache = () => {
  return useMutation({
    mutationFn: async (cacheType: 'all' | 'api' | 'database' | 'files') => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/api/admin/system/cache/clear`,
        { type: cacheType }
      );
      return response.data;
    },
  });
};

// 获取系统配置
export const useSystemConfig = () => {
  return useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      const response = await apiClient.get<Record<string, any>>('/api/admin/system/config');
      return response.data;
    },
  });
};

// 更新系统配置
export const useUpdateSystemConfig = () => {
  return useMutation({
    mutationFn: async (config: Record<string, any>) => {
      const response = await apiClient.patch<{ success: boolean; message: string }>(
        '/api/admin/system/config',
        config
      );
      return response.data;
    },
  });
};
```

## 后端集成要求

### 数据库表结构

1. `system_activities` 表
   - id (主键)
   - type (活动类型：user, system, security)
   - title (活动标题)
   - description (活动描述)
   - timestamp (时间戳)
   - metadata (JSON格式的元数据)

2. `system_health_checks` 表
   - id (主键)
   - status (健康状态：healthy, warning, critical)
   - message (状态消息)
   - last_checked (最后检查时间)
   - created_at (创建时间)

3. `system_health_metrics` 表
   - id (主键)
   - health_check_id (外键，关联system_health_checks表)
   - name (指标名称)
   - description (指标描述)
   - status (指标状态：healthy, warning, critical)
   - value (指标值)
   - threshold (阈值)
   - details (详细信息)

4. `system_configs` 表
   - id (主键)
   - key (配置键)
   - value (配置值)
   - type (值类型：string, number, boolean, json)
   - description (配置描述)
   - updated_at (更新时间)
   - updated_by (更新者ID)

### API响应格式

1. 获取管理员仪表盘数据

```json
{
  "stats": {
    "totalUsers": 1250,
    "userGrowth": 5.2,
    "activeConsultants": 48,
    "consultantGrowth": 12.5,
    "completedAssessments": 876,
    "assessmentGrowth": 8.3,
    "totalSessions": 1432,
    "sessionGrowth": 15.7,
    "averageRating": 4.8,
    "revenueThisMonth": 25600,
    "revenueGrowth": 18.2
  },
  "users": [
    {
      "id": "user-123",
      "name": "张三",
      "email": "zhangsan@example.com",
      "role": "client",
      "status": "active",
      "avatar": "https://example.com/avatars/user-123.jpg",
      "createdAt": "2023-05-15T08:30:00Z",
      "updatedAt": "2023-05-15T08:30:00Z"
    },
    // 更多用户...
  ],
  "activities": [
    {
      "id": "act-456",
      "type": "system",
      "title": "系统更新",
      "description": "系统已更新到版本v2.3.0",
      "timestamp": "2023-05-14T22:15:00Z",
      "metadata": {
        "previousVersion": "v2.2.5",
        "newVersion": "v2.3.0",
        "changelogUrl": "https://example.com/changelog/v2.3.0"
      }
    },
    // 更多活动...
  ],
  "health": {
    "status": "healthy",
    "message": "所有系统组件运行正常",
    "lastChecked": "2023-05-15T09:45:00Z",
    "metrics": [
      {
        "name": "CPU使用率",
        "description": "服务器CPU使用百分比",
        "status": "healthy",
        "value": 35,
        "threshold": 80,
        "details": "当前CPU负载正常"
      },
      // 更多指标...
    ]
  }
}
```

2. 系统健康状态

```json
{
  "status": "healthy",
  "message": "所有系统组件运行正常",
  "lastChecked": "2023-05-15T09:45:00Z",
  "metrics": [
    {
      "name": "CPU使用率",
      "description": "服务器CPU使用百分比",
      "status": "healthy",
      "value": 35,
      "threshold": 80,
      "details": "当前CPU负载正常"
    },
    {
      "name": "内存使用率",
      "description": "服务器内存使用百分比",
      "status": "healthy",
      "value": 45,
      "threshold": 85,
      "details": "当前内存使用正常"
    },
    {
      "name": "数据库连接",
      "description": "数据库连接状态",
      "status": "healthy",
      "value": 100,
      "threshold": 50,
      "details": "数据库连接正常"
    },
    {
      "name": "API响应时间",
      "description": "API平均响应时间(ms)",
      "status": "warning",
      "value": 75,
      "threshold": 70,
      "details": "API响应时间略高于正常水平"
    }
  ]
}
```

## 国际化支持

管理员仪表盘页面支持多语言，使用next-i18next进行国际化。主要翻译键包括：

```json
{
  "admin_dashboard": "管理员仪表盘",
  "admin_dashboard_description": "监控系统性能和用户活动",
  "total_users": "总用户数",
  "active_consultants": "活跃顾问",
  "completed_assessments": "已完成评估",
  "system_health": "系统健康状态",
  "from_last_month": "相比上月",
  "healthy": "健康",
  "warning": "警告",
  "critical": "严重",
  "recent_users": "最近用户",
  "system_activities": "系统活动",
  "health_metrics": "健康指标",
  "user": "用户",
  "email": "邮箱",
  "role": "角色",
  "status": "状态",
  "joined_date": "加入日期",
  "actions": "操作",
  "view": "查看",
  "no_users_found": "未找到用户",
  "no_users_found_description": "当前没有符合条件的用户",
  "invite_users": "邀请用户",
  "no_activities_found": "未找到活动",
  "no_activities_found_description": "当前没有系统活动记录",
  "no_health_metrics": "未找到健康指标",
  "no_health_metrics_description": "当前没有系统健康指标数据",
  "refresh_metrics": "刷新指标",
  "system_settings": "系统设置",
  "loading_dashboard": "加载仪表盘数据中...",
  "error_loading_dashboard": "加载仪表盘数据失败",
  "retry": "重试"
}
```

## 权限控制

管理员仪表盘页面仅对具有管理员权限的用户可见。权限检查在两个层面实施：

1. 前端路由保护：使用高阶组件包装页面组件，检查用户是否具有管理员权限。
2. API端点保护：所有管理员API端点都需要验证用户具有管理员权限。

```typescript
// 权限检查HOC示例
export const withAdminAuth = (Component: React.ComponentType) => {
  const WithAdminAuth: React.FC = (props) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && (!user || user.role !== 'admin')) {
        router.replace('/auth/login?redirect=' + encodeURIComponent(router.asPath));
      }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== 'admin') {
      return <LoadingState title="验证管理员权限..." />;
    }

    return <Component {...props} />;
  };

  return WithAdminAuth;
};
```

## 响应式设计

管理员仪表盘页面采用响应式设计，确保在不同设备上都能提供良好的用户体验：

1. 移动设备（< 768px）：统计卡片和表格垂直堆叠，简化表格显示。
2. 平板设备（768px - 1024px）：统计卡片两列排列，表格适应屏幕宽度。
3. 桌面设备（> 1024px）：统计卡片四列排列，完整显示所有数据。

## 性能优化

为确保管理员仪表盘页面的高性能，实施以下优化措施：

1. 数据缓存：使用React Query缓存API响应，减少重复请求。
2. 分页加载：用户列表和活动日志采用分页加载，避免一次加载大量数据。
3. 延迟加载：非关键组件和数据采用延迟加载策略。
4. 状态持久化：使用Zustand的persist中间件持久化用户偏好设置。

## 错误处理

管理员仪表盘页面实施全面的错误处理策略：

1. API错误：捕获并显示友好的错误消息，提供重试选项。
2. 数据加载状态：显示加载指示器，防止用户与未完全加载的UI交互。
3. 空状态处理：为空数据集提供明确的空状态UI和操作建议。
4. 全局错误边界：捕获未处理的异常，防止整个应用崩溃。

## 测试策略

管理员仪表盘页面的测试策略包括：

1. 单元测试：测试各个组件和状态管理逻辑。
2. 集成测试：测试组件之间的交互和数据流。
3. 端到端测试：模拟用户交互，验证完整功能流程。
4. 性能测试：确保在大数据集下的性能表现。
