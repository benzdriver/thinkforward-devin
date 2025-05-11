# 顾问匹配功能

## 概述

顾问匹配功能允许用户根据其移民需求和个人资料找到合适的移民顾问，并进行预约咨询。该功能包括顾问搜索、筛选、匹配算法、顾问详情查看和预约管理等核心功能。

## 页面

### 顾问匹配页面 (`/consultants/match`)

顾问匹配页面允许用户查看系统推荐的顾问列表，并根据专业领域、语言能力、评分等条件进行筛选。

**功能特点：**

- 基于用户资料的智能推荐
- 多条件筛选
- 顾问卡片展示
- 排序选项（评分、成功率、价格等）
- 顾问详情查看
- 直接预约入口

### 顾问预约页面 (`/consultants/book/[id]`)

顾问预约页面允许用户选择特定顾问，查看其详细资料，并进行时间段选择和预约。

**功能特点：**

- 顾问详细资料展示
- 可用时间段选择
- 预约类型选择（视频、电话、面对面）
- 预约主题和问题描述
- 预约确认和支付
- 预约状态跟踪

## 数据模型

### 顾问 (Consultant)

```typescript
interface Consultant {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company?: string;
  specialties: string[];
  languages: string[];
  experience: number; // 年数
  rating: number; // 1-5星
  successRate: number; // 百分比
  price: {
    hourly: number;
    currency: string;
  };
  availability: {
    date: string;
    slots: {
      start: string;
      end: string;
      isBooked: boolean;
    }[];
  }[];
  bio: string;
  education: {
    institution: string;
    degree: string;
    year: number;
  }[];
  certifications: string[];
  reviewCount: number;
  reviews: {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}
```

### 预约 (Booking)

```typescript
interface Booking {
  id: string;
  userId: string;
  consultantId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  topic: string;
  questions?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
  paymentCurrency: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 匹配结果 (MatchResult)

```typescript
interface MatchResult {
  consultantId: string;
  score: number; // 匹配分数，0-100
  matchReasons: {
    factor: string;
    score: number;
    description: string;
  }[];
}
```

## 状态管理

顾问匹配功能使用Zustand进行状态管理，主要通过`useConsultantStore`存储：

- 顾问列表
- 筛选条件
- 匹配结果
- 选中的顾问
- 预约信息
- 加载状态
- 错误信息

## API集成

### 顾问API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/consultants` | GET | 获取所有顾问列表 |
| `/consultants/match` | POST | 根据用户资料获取匹配的顾问 |
| `/consultants/:id` | GET | 获取特定顾问详情 |
| `/consultants/:id/availability` | GET | 获取顾问可用时间段 |
| `/consultants/:id/reviews` | GET | 获取顾问评价 |
| `/bookings` | GET | 获取用户的所有预约 |
| `/bookings` | POST | 创建新预约 |
| `/bookings/:id` | GET | 获取特定预约详情 |
| `/bookings/:id` | PUT | 更新预约信息 |
| `/bookings/:id/cancel` | POST | 取消预约 |

### API钩子函数

```typescript
// 顾问相关
useGetConsultants(filters?: ConsultantFilters)
useMatchConsultants(userId: string, preferences?: MatchPreferences)
useGetConsultant(consultantId: string)
useGetConsultantAvailability(consultantId: string, startDate: string, endDate: string)
useGetConsultantReviews(consultantId: string)

// 预约相关
useGetBookings(userId: string)
useCreateBooking(userId: string)
useGetBooking(bookingId: string)
useUpdateBooking(bookingId: string)
useCancelBooking(bookingId: string)
```

## 组件

### ConsultantCard

顾问卡片组件，显示顾问基本信息和匹配分数。

**属性：**

- `consultant`: 顾问信息
- `matchScore`: 匹配分数
- `onSelect`: 选择回调
- `isSelected`: 是否被选中

### ConsultantFilter

顾问筛选组件，提供多种筛选条件。

**属性：**

- `filters`: 当前筛选条件
- `onFilterChange`: 筛选条件变更回调
- `specialties`: 可选专业领域
- `languages`: 可选语言

### MatchScoreIndicator

匹配分数指示器组件，可视化展示匹配程度。

**属性：**

- `score`: 匹配分数
- `size`: 组件大小
- `showLabel`: 是否显示文字标签

### AvailabilityCalendar

可用时间日历组件，展示顾问可预约的时间段。

**属性：**

- `availability`: 可用时间数据
- `onSlotSelect`: 时间段选择回调
- `selectedSlot`: 当前选中的时间段
- `minDate`: 最早可选日期
- `maxDate`: 最晚可选日期

### BookingForm

预约表单组件，用于填写预约详情。

**属性：**

- `consultantId`: 顾问ID
- `selectedSlot`: 选中的时间段
- `onSubmit`: 提交回调
- `onCancel`: 取消回调

## 多语言支持

顾问匹配功能支持多语言，通过i18n实现。主要翻译键包括：

- `consultants.match.title`
- `consultants.match.description`
- `consultants.book.title`
- `consultants.book.description`
- `consultants.filters.*`
- `consultants.specialties.*`
- `consultants.booking.*`
- `consultants.errors.*`

## 后端集成要求

1. 顾问数据服务：需要提供顾问信息的存储和检索
2. 匹配算法服务：需要根据用户资料和顾问特点计算匹配分数
3. 预约管理服务：需要处理预约创建、更新和取消
4. 时间管理服务：需要管理顾问可用时间和预约时间冲突
5. 支付集成：需要处理预约支付流程
6. 通知服务：需要发送预约确认、提醒和变更通知

## 实现步骤

1. 创建顾问状态管理存储
2. 实现顾问卡片和筛选组件
3. 实现顾问匹配页面
4. 实现可用时间日历组件
5. 实现预约表单组件
6. 实现顾问预约页面
7. 添加多语言支持
8. 集成支付功能

## 未来改进

1. 顾问实时在线状态
2. 即时通讯功能
3. 视频会议集成
4. 顾问推荐系统优化
5. 用户-顾问匹配历史分析
6. 预约提醒和日历同步
7. 顾问评价和反馈系统增强
