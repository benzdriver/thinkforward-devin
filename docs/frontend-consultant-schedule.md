# 顾问日程管理页面技术规范

## 概述

顾问日程管理页面是ThinkForward AI平台中顾问工作流程的重要组成部分，允许顾问查看、创建、编辑和管理他们的工作日程安排。该页面提供了日历视图、时间段管理、预约确认和客户通知等功能，帮助顾问高效地管理他们的工作时间和客户预约。

## 页面路径

```
/consultant/schedule
```

## 数据模型

### 日程事件 (ScheduleEvent)

```typescript
interface ScheduleEvent {
  id: string;
  consultantId: string;
  title: string;
  description?: string;
  startTime: string; // ISO日期时间格式
  endTime: string; // ISO日期时间格式
  type: 'appointment' | 'block' | 'break' | 'meeting' | 'other';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  notes?: string;
  color?: string;
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[]; // 0-6, 0表示周日
    dayOfMonth?: number;
    monthOfYear?: number;
    count?: number;
  };
  reminders: {
    id: string;
    time: number; // 提前多少分钟
    type: 'email' | 'notification' | 'sms';
    sent: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### 工作时间 (WorkingHours)

```typescript
interface WorkingHours {
  consultantId: string;
  weekdays: {
    [key: string]: { // 'monday', 'tuesday', 等
      isWorking: boolean;
      slots: {
        start: string; // 24小时制，如 "09:00"
        end: string; // 24小时制，如 "17:00"
      }[];
    };
  };
  exceptions: {
    date: string; // YYYY-MM-DD
    isWorking: boolean;
    slots?: {
      start: string;
      end: string;
    }[];
    note?: string;
  }[];
  timezone: string;
  updatedAt: string;
}
```

### 预约请求 (AppointmentRequest)

```typescript
interface AppointmentRequest {
  id: string;
  consultantId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  proposedTimes: {
    startTime: string;
    endTime: string;
  }[];
  purpose: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'rescheduled';
  selectedTime?: {
    startTime: string;
    endTime: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### 日程统计 (ScheduleStats)

```typescript
interface ScheduleStats {
  totalAppointments: number;
  upcomingAppointments: number;
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyAppointments: number;
  appointmentsByType: {
    type: string;
    count: number;
  }[];
  appointmentsByStatus: {
    status: string;
    count: number;
  }[];
  busyHours: {
    hour: number;
    count: number;
  }[];
  busyDays: {
    day: number;
    count: number;
  }[];
}
```

## 组件结构

### 页面组件

```
/pages/consultant/schedule.tsx
```

主页面组件，包含以下子组件：
- 日程统计卡片
- 日历视图
- 工作时间设置
- 预约请求列表
- 事件创建/编辑模态框

### 子组件

1. **日历组件** (`/components/schedule/calendar.tsx`)
   - 支持月视图、周视图和日视图切换
   - 显示所有预约和阻塞时间
   - 支持拖放操作调整事件时间
   - 支持点击空白区域创建新事件

2. **工作时间设置组件** (`/components/schedule/working-hours.tsx`)
   - 设置每周工作日和工作时间
   - 添加特殊日期例外（假期、特殊工作日）
   - 设置时区

3. **预约请求组件** (`/components/schedule/appointment-requests.tsx`)
   - 显示待处理的预约请求
   - 接受/拒绝/重新安排预约
   - 查看客户详情

4. **事件详情组件** (`/components/schedule/event-details.tsx`)
   - 显示事件的详细信息
   - 提供编辑和删除选项
   - 显示相关客户信息（如适用）

5. **事件创建/编辑模态框** (`/components/schedule/event-form.tsx`)
   - 创建或编辑日程事件
   - 设置重复模式
   - 添加提醒
   - 设置在线会议链接

6. **时间段选择器** (`/components/schedule/time-slot-picker.tsx`)
   - 可视化选择时间段
   - 显示可用和不可用时间

## 状态管理

### Zustand Store

```
/lib/store/zustand/useScheduleStore.ts
```

```typescript
interface ScheduleState {
  events: ScheduleEvent[];
  workingHours: WorkingHours | null;
  appointmentRequests: AppointmentRequest[];
  stats: ScheduleStats | null;
  selectedDate: Date;
  selectedEvent: ScheduleEvent | null;
  viewMode: 'month' | 'week' | 'day' | 'agenda';
  isLoading: {
    events: boolean;
    workingHours: boolean;
    appointmentRequests: boolean;
    stats: boolean;
  };
  error: {
    events: string | null;
    workingHours: string | null;
    appointmentRequests: string | null;
    stats: string | null;
  };
  
  // 设置方法
  setEvents: (events: ScheduleEvent[]) => void;
  setWorkingHours: (workingHours: WorkingHours) => void;
  setAppointmentRequests: (requests: AppointmentRequest[]) => void;
  setStats: (stats: ScheduleStats) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: ScheduleEvent | null) => void;
  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => void;
  setLoading: (key: keyof ScheduleState['isLoading'], isLoading: boolean) => void;
  setError: (key: keyof ScheduleState['error'], error: string | null) => void;
  
  // 业务逻辑方法
  addEvent: (event: ScheduleEvent) => void;
  updateEvent: (eventId: string, updates: Partial<ScheduleEvent>) => void;
  removeEvent: (eventId: string) => void;
  updateWorkingHours: (updates: Partial<WorkingHours>) => void;
  updateAppointmentRequest: (requestId: string, updates: Partial<AppointmentRequest>) => void;
  resetState: () => void;
}
```

## API服务

### 日程API服务

```
/lib/api/services/schedule.ts
```

```typescript
// 获取日程事件
export const useScheduleEvents = (
  consultantId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['scheduleEvents', consultantId, startDate, endDate],
    queryFn: async () => {
      const response = await apiClient.get<{
        events: ScheduleEvent[];
      }>(`/api/consultant/${consultantId}/schedule/events`, {
        params: { startDate, endDate },
      });
      return response.data.events;
    },
    enabled: !!consultantId && !!startDate && !!endDate,
  });
};

// 获取工作时间
export const useWorkingHours = (consultantId: string) => {
  return useQuery({
    queryKey: ['workingHours', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<WorkingHours>(
        `/api/consultant/${consultantId}/schedule/working-hours`
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

// 获取预约请求
export const useAppointmentRequests = (consultantId: string) => {
  return useQuery({
    queryKey: ['appointmentRequests', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<{
        requests: AppointmentRequest[];
      }>(`/api/consultant/${consultantId}/schedule/appointment-requests`);
      return response.data.requests;
    },
    enabled: !!consultantId,
  });
};

// 获取日程统计
export const useScheduleStats = (consultantId: string) => {
  return useQuery({
    queryKey: ['scheduleStats', consultantId],
    queryFn: async () => {
      const response = await apiClient.get<ScheduleStats>(
        `/api/consultant/${consultantId}/schedule/stats`
      );
      return response.data;
    },
    enabled: !!consultantId,
  });
};

// 创建日程事件
export const useCreateEvent = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventData,
    }: {
      consultantId: string;
      eventData: Omit<ScheduleEvent, 'id' | 'consultantId' | 'createdAt' | 'updatedAt'>;
    }) => {
      const response = await apiClient.post<ScheduleEvent>(
        `/api/consultant/${consultantId}/schedule/events`,
        eventData
      );
      return response.data;
    },
  });
};

// 更新日程事件
export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventId,
      updates,
    }: {
      consultantId: string;
      eventId: string;
      updates: Partial<ScheduleEvent>;
    }) => {
      const response = await apiClient.patch<ScheduleEvent>(
        `/api/consultant/${consultantId}/schedule/events/${eventId}`,
        updates
      );
      return response.data;
    },
  });
};

// 删除日程事件
export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      eventId,
    }: {
      consultantId: string;
      eventId: string;
    }) => {
      await apiClient.delete(
        `/api/consultant/${consultantId}/schedule/events/${eventId}`
      );
      return eventId;
    },
  });
};

// 更新工作时间
export const useUpdateWorkingHours = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      workingHours,
    }: {
      consultantId: string;
      workingHours: Partial<WorkingHours>;
    }) => {
      const response = await apiClient.patch<WorkingHours>(
        `/api/consultant/${consultantId}/schedule/working-hours`,
        workingHours
      );
      return response.data;
    },
  });
};

// 处理预约请求
export const useHandleAppointmentRequest = () => {
  return useMutation({
    mutationFn: async ({
      consultantId,
      requestId,
      action,
      selectedTime,
    }: {
      consultantId: string;
      requestId: string;
      action: 'accept' | 'reject' | 'reschedule';
      selectedTime?: {
        startTime: string;
        endTime: string;
      };
    }) => {
      const response = await apiClient.post<AppointmentRequest>(
        `/api/consultant/${consultantId}/schedule/appointment-requests/${requestId}/${action}`,
        { selectedTime }
      );
      return response.data;
    },
  });
};
```

## 页面功能

1. **日历视图**
   - 月视图：显示整月的预约和事件
   - 周视图：显示一周的详细日程
   - 日视图：显示单日的详细时间表
   - 议程视图：以列表形式显示即将到来的事件

2. **工作时间管理**
   - 设置每周常规工作时间
   - 添加特殊日期（休假、特殊工作日）
   - 设置时区偏好

3. **预约管理**
   - 查看待处理的预约请求
   - 接受/拒绝/重新安排预约
   - 发送预约确认和提醒

4. **事件管理**
   - 创建新事件（预约、阻塞时间、休息等）
   - 编辑现有事件
   - 设置重复事件
   - 添加事件提醒

5. **可用性展示**
   - 显示可用和不可用时间段
   - 自动考虑工作时间和现有预约

## 用户交互流程

1. **查看日程**
   - 用户进入页面，默认显示月视图
   - 可以切换到周视图、日视图或议程视图
   - 可以通过日期选择器跳转到特定日期

2. **创建事件**
   - 用户点击日历上的空白区域
   - 弹出事件创建模态框
   - 填写事件详情并保存

3. **编辑事件**
   - 用户点击现有事件
   - 弹出事件详情视图
   - 点击编辑按钮修改事件

4. **设置工作时间**
   - 用户点击"工作时间"标签
   - 设置每周工作日和工作时间
   - 添加特殊日期例外

5. **处理预约请求**
   - 用户查看预约请求列表
   - 点击请求查看详情
   - 选择接受、拒绝或重新安排

## 后端集成要求

### 数据库设计

建议在数据库中创建以下表：

1. **schedule_events**
   ```sql
   CREATE TABLE schedule_events (
     id VARCHAR(36) PRIMARY KEY,
     consultant_id VARCHAR(36) NOT NULL,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     start_time DATETIME NOT NULL,
     end_time DATETIME NOT NULL,
     type VARCHAR(20) NOT NULL,
     status VARCHAR(20) NOT NULL,
     client_id VARCHAR(36),
     location VARCHAR(255),
     is_online BOOLEAN DEFAULT FALSE,
     meeting_link VARCHAR(255),
     notes TEXT,
     color VARCHAR(20),
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (consultant_id) REFERENCES users(id),
     FOREIGN KEY (client_id) REFERENCES users(id)
   );
   ```

2. **schedule_event_recurrences**
   ```sql
   CREATE TABLE schedule_event_recurrences (
     id VARCHAR(36) PRIMARY KEY,
     event_id VARCHAR(36) NOT NULL,
     pattern VARCHAR(20) NOT NULL,
     interval_value INT NOT NULL,
     end_date DATETIME,
     days_of_week VARCHAR(20),
     day_of_month INT,
     month_of_year INT,
     count INT,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (event_id) REFERENCES schedule_events(id) ON DELETE CASCADE
   );
   ```

3. **schedule_event_reminders**
   ```sql
   CREATE TABLE schedule_event_reminders (
     id VARCHAR(36) PRIMARY KEY,
     event_id VARCHAR(36) NOT NULL,
     time_before INT NOT NULL,
     type VARCHAR(20) NOT NULL,
     sent BOOLEAN DEFAULT FALSE,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (event_id) REFERENCES schedule_events(id) ON DELETE CASCADE
   );
   ```

4. **consultant_working_hours**
   ```sql
   CREATE TABLE consultant_working_hours (
     id VARCHAR(36) PRIMARY KEY,
     consultant_id VARCHAR(36) NOT NULL,
     weekday VARCHAR(10) NOT NULL,
     is_working BOOLEAN DEFAULT TRUE,
     timezone VARCHAR(50) NOT NULL,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (consultant_id) REFERENCES users(id),
     UNIQUE KEY (consultant_id, weekday)
   );
   ```

5. **working_hour_slots**
   ```sql
   CREATE TABLE working_hour_slots (
     id VARCHAR(36) PRIMARY KEY,
     working_hour_id VARCHAR(36) NOT NULL,
     start_time TIME NOT NULL,
     end_time TIME NOT NULL,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (working_hour_id) REFERENCES consultant_working_hours(id) ON DELETE CASCADE
   );
   ```

6. **working_hour_exceptions**
   ```sql
   CREATE TABLE working_hour_exceptions (
     id VARCHAR(36) PRIMARY KEY,
     consultant_id VARCHAR(36) NOT NULL,
     exception_date DATE NOT NULL,
     is_working BOOLEAN DEFAULT FALSE,
     note TEXT,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (consultant_id) REFERENCES users(id),
     UNIQUE KEY (consultant_id, exception_date)
   );
   ```

7. **exception_slots**
   ```sql
   CREATE TABLE exception_slots (
     id VARCHAR(36) PRIMARY KEY,
     exception_id VARCHAR(36) NOT NULL,
     start_time TIME NOT NULL,
     end_time TIME NOT NULL,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (exception_id) REFERENCES working_hour_exceptions(id) ON DELETE CASCADE
   );
   ```

8. **appointment_requests**
   ```sql
   CREATE TABLE appointment_requests (
     id VARCHAR(36) PRIMARY KEY,
     consultant_id VARCHAR(36) NOT NULL,
     client_id VARCHAR(36) NOT NULL,
     purpose VARCHAR(255) NOT NULL,
     notes TEXT,
     status VARCHAR(20) NOT NULL,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (consultant_id) REFERENCES users(id),
     FOREIGN KEY (client_id) REFERENCES users(id)
   );
   ```

9. **proposed_appointment_times**
   ```sql
   CREATE TABLE proposed_appointment_times (
     id VARCHAR(36) PRIMARY KEY,
     request_id VARCHAR(36) NOT NULL,
     start_time DATETIME NOT NULL,
     end_time DATETIME NOT NULL,
     is_selected BOOLEAN DEFAULT FALSE,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NOT NULL,
     FOREIGN KEY (request_id) REFERENCES appointment_requests(id) ON DELETE CASCADE
   );
   ```

### API端点

需要实现以下API端点：

1. **日程事件**
   - `GET /api/consultant/:consultantId/schedule/events` - 获取日程事件列表
   - `POST /api/consultant/:consultantId/schedule/events` - 创建新事件
   - `GET /api/consultant/:consultantId/schedule/events/:eventId` - 获取单个事件详情
   - `PATCH /api/consultant/:consultantId/schedule/events/:eventId` - 更新事件
   - `DELETE /api/consultant/:consultantId/schedule/events/:eventId` - 删除事件

2. **工作时间**
   - `GET /api/consultant/:consultantId/schedule/working-hours` - 获取工作时间设置
   - `PATCH /api/consultant/:consultantId/schedule/working-hours` - 更新工作时间设置

3. **预约请求**
   - `GET /api/consultant/:consultantId/schedule/appointment-requests` - 获取预约请求列表
   - `POST /api/consultant/:consultantId/schedule/appointment-requests/:requestId/accept` - 接受预约请求
   - `POST /api/consultant/:consultantId/schedule/appointment-requests/:requestId/reject` - 拒绝预约请求
   - `POST /api/consultant/:consultantId/schedule/appointment-requests/:requestId/reschedule` - 重新安排预约

4. **统计数据**
   - `GET /api/consultant/:consultantId/schedule/stats` - 获取日程统计数据

### 安全考虑

1. **权限控制**
   - 确保只有顾问本人可以访问和修改自己的日程
   - 客户只能查看已确认的预约，不能查看顾问的其他日程

2. **数据验证**
   - 验证日期和时间格式
   - 确保结束时间晚于开始时间
   - 验证工作时间不重叠

3. **并发控制**
   - 使用乐观锁或悲观锁防止并发修改冲突
   - 在高并发场景下考虑使用队列处理预约请求

## 国际化支持

页面需要支持多语言，主要包括：

1. **日期和时间格式**
   - 根据用户语言和地区设置显示适当的日期和时间格式
   - 支持不同时区的转换

2. **界面文本**
   - 所有界面文本应使用i18n键
   - 支持中文、英文等多种语言

3. **错误消息**
   - 提供本地化的错误消息
   - 确保消息清晰明了

## 性能优化

1. **数据加载**
   - 实现分页加载长时间范围的事件
   - 使用React Query缓存减少重复请求

2. **渲染优化**
   - 使用虚拟滚动优化长列表渲染
   - 避免不必要的重渲染

3. **状态管理**
   - 合理使用Zustand存储和更新状态
   - 避免过度的状态更新

## 可访问性

1. **键盘导航**
   - 确保所有功能可通过键盘访问
   - 提供清晰的焦点指示器

2. **屏幕阅读器支持**
   - 添加适当的ARIA标签
   - 确保动态内容变化可被屏幕阅读器捕获

3. **颜色对比**
   - 确保文本和背景之间有足够的对比度
   - 不仅依赖颜色传达信息

## 响应式设计

1. **移动端适配**
   - 在小屏幕上优化日历视图
   - 提供触摸友好的交互

2. **布局调整**
   - 根据屏幕尺寸调整组件布局
   - 确保所有功能在各种设备上可用

## 测试策略

1. **单元测试**
   - 测试状态管理逻辑
   - 测试日期和时间计算

2. **集成测试**
   - 测试与API的交互
   - 测试组件之间的协作

3. **端到端测试**
   - 测试完整的用户流程
   - 验证关键功能正常工作
