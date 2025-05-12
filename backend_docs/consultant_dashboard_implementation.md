# 顾问仪表盘模块实现文档

## 概述

顾问仪表盘模块为顾问提供了一个集中管理其任务、预约、活动和状态的平台。该模块使顾问能够高效地管理其日常工作，跟踪任务进度，查看预约安排，并监控系统活动。

## 数据模型

### ConsultantTask 模型

顾问任务模型用于管理顾问的任务列表：

- **基本信息**：标题、描述、截止日期
- **优先级**：低、中、高、紧急
- **状态**：待处理、进行中、已完成、已取消
- **关联实体**：可以关联到客户、案例、预约或申请
- **标签**：用于分类任务
- **完成时间**：记录任务完成的时间

主要方法：
- `getTasksByConsultant`: 获取顾问的任务列表
- `getPendingTasks`: 获取待办任务
- `getOverdueTasks`: 获取逾期任务
- `getTodayTasks`: 获取今日任务
- `updateTaskStatus`: 更新任务状态
- `createTask`: 创建新任务
- `getTaskStats`: 获取任务统计数据

### ConsultantActivity 模型

顾问活动模型记录顾问的活动历史：

- **活动类型**：登录、登出、资料更新、预约确认等
- **描述**：活动的详细描述
- **元数据**：活动的附加信息
- **关联实体**：可以关联到用户、客户、案例、预约等
- **已读状态**：标记活动是否已读
- **时间戳**：活动发生的时间

主要方法：
- `logActivity`: 记录新活动
- `getActivities`: 获取活动列表
- `getUnreadCount`: 获取未读活动数量
- `markAsRead`: 标记活动为已读
- `markAllAsRead`: 标记所有活动为已读
- `getRecentActivities`: 获取最近活动
- `getActivitiesByType`: 获取特定类型的活动
- `getActivitiesByRelatedEntity`: 获取与特定实体相关的活动

## 服务层

### consultantDashboardService

顾问仪表盘服务提供以下功能：

1. **getConsultantDashboard**: 获取仪表盘数据，包括：
   - 顾问基本信息
   - 任务统计
   - 待办任务
   - 今日任务
   - 今日预约
   - 未读活动数量
   - 最近活动
   - 客户统计
   - 案例统计

2. **updateConsultantStatus**: 更新顾问状态（在线、离线、忙碌、离开）

3. **getConsultantAppointments**: 获取顾问预约列表，支持按状态和日期过滤

4. **getConsultantTasks**: 获取顾问任务列表，支持按状态、优先级和截止日期过滤

5. **updateTaskStatus**: 更新任务状态，并记录相关活动

6. **getConsultantActivities**: 获取顾问活动列表，支持按类型和已读状态过滤

7. **confirmAppointment**: 确认预约，并创建相关任务

8. **cancelAppointment**: 取消预约，并记录取消原因

## 控制器层

### consultantDashboardController

顾问仪表盘控制器处理以下HTTP请求：

1. **getConsultantDashboard**: GET /api/consultant-dashboard/:consultantId/dashboard
2. **updateConsultantStatus**: PATCH /api/consultant-dashboard/:consultantId/status
3. **getConsultantAppointments**: GET /api/consultant-dashboard/:consultantId/appointments
4. **getConsultantTasks**: GET /api/consultant-dashboard/:consultantId/tasks
5. **updateTaskStatus**: PATCH /api/consultant-dashboard/tasks/:taskId/status
6. **getConsultantActivities**: GET /api/consultant-dashboard/:consultantId/activities
7. **confirmAppointment**: PATCH /api/consultant-dashboard/appointments/:appointmentId/confirm
8. **cancelAppointment**: PATCH /api/consultant-dashboard/appointments/:appointmentId/cancel

每个控制器方法都包含权限验证，确保只有顾问本人或管理员可以访问相关数据。

## 路由层

### consultantDashboardRoutes

所有顾问仪表盘路由都需要验证令牌：

```javascript
router.use(verifyToken);
```

路由定义：

```javascript
router.get('/:consultantId/dashboard', consultantDashboardController.getConsultantDashboard);
router.patch('/:consultantId/status', consultantDashboardController.updateConsultantStatus);
router.get('/:consultantId/appointments', consultantDashboardController.getConsultantAppointments);
router.get('/:consultantId/tasks', consultantDashboardController.getConsultantTasks);
router.patch('/tasks/:taskId/status', consultantDashboardController.updateTaskStatus);
router.get('/:consultantId/activities', consultantDashboardController.getConsultantActivities);
router.patch('/appointments/:appointmentId/confirm', consultantDashboardController.confirmAppointment);
router.patch('/appointments/:appointmentId/cancel', consultantDashboardController.cancelAppointment);
```

## 安全考虑

1. **权限验证**：
   - 所有路由都需要认证
   - 顾问只能访问自己的数据
   - 管理员可以访问所有顾问的数据

2. **输入验证**：
   - 验证状态值、优先级等枚举类型
   - 验证日期格式
   - 验证必填字段

3. **活动记录**：
   - 记录所有重要操作，如状态更新、预约确认/取消等
   - 提供活动历史查询功能

## 前后端交互

前端通过以下API与后端交互：

1. **获取仪表盘数据**：
   ```javascript
   const { fetchDashboard } = useConsultantDashboard();
   const dashboardData = await fetchDashboard(consultantId);
   ```

2. **更新顾问状态**：
   ```javascript
   const { updateStatus } = useConsultantStatus();
   await updateStatus(consultantId, 'online');
   ```

3. **获取任务列表**：
   ```javascript
   const { fetchTasks } = useConsultantTasks();
   const tasks = await fetchTasks(consultantId, { status: 'pending' });
   ```

4. **更新任务状态**：
   ```javascript
   const { updateTaskStatus } = useConsultantTasks();
   await updateTaskStatus(taskId, 'completed');
   ```

## 实现注意事项

1. **性能优化**：
   - 使用分页和过滤减少数据传输量
   - 优化查询以提高响应速度
   - 考虑使用缓存减少数据库查询

2. **用户体验**：
   - 提供实时更新机制（如WebSocket）
   - 支持任务排序和过滤
   - 提供未读活动通知

3. **扩展性**：
   - 设计允许轻松添加新的任务类型和活动类型
   - 支持自定义仪表盘视图

4. **集成**：
   - 与预约系统集成
   - 与客户管理系统集成
   - 与案例管理系统集成
