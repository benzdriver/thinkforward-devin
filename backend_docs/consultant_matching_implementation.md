# 顾问匹配模块实现文档

本文档详细描述了ThinkForward AI平台的顾问匹配模块的实现细节，包括数据模型、服务、控制器和路由。

## 概述

顾问匹配模块允许用户查找、匹配和预约移民顾问。该模块包括以下主要功能：

1. 顾问列表和筛选
2. 顾问匹配算法
3. 顾问详情和评价
4. 顾问可用性管理
5. 预约管理系统

## 数据模型

### Consultant 模型（扩展现有模型）

```javascript
const consultantSchema = new mongoose.Schema({
  // 现有字段
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  profileImage: String,
  specialization: [String],
  countries: [String],
  experience: Number,
  languages: [String],
  credentials: [String],
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // 新增字段
  avatar: String,
  title: String,
  company: String,
  specialties: [String],
  successRate: { type: Number, default: 0 },
  price: {
    hourly: { type: Number, required: true },
    currency: { type: String, default: 'CAD' }
  },
  bio: String,
  education: [{
    institution: String,
    degree: String,
    year: Number
  }],
  certifications: [String],
  reviewCount: { type: Number, default: 0 }
});
```

### ConsultantReview 模型

```javascript
const consultantReviewSchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
```

### ConsultantAvailability 模型

```javascript
const consultantAvailabilitySchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slots: [{
    start: String,
    end: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }]
});
```

### MatchResult 模型

```javascript
const matchResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  matchReasons: [{
    factor: String,
    score: Number,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### Booking 模型

```javascript
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'phone', 'in-person'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  topic: {
    type: String,
    required: true
  },
  questions: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentCurrency: {
    type: String,
    default: 'CAD'
  },
  meetingLink: String
}, {
  timestamps: true
});
```

## API 端点

### 顾问相关端点

- `GET /api/consultants` - 获取顾问列表（支持筛选）
- `GET /api/consultants/:consultantId` - 获取顾问详情
- `GET /api/consultants/:consultantId/availability` - 获取顾问可用时间
- `GET /api/consultants/:consultantId/reviews` - 获取顾问评价
- `POST /api/consultants/match` - 匹配顾问
- `POST /api/consultants/:consultantId/reviews` - 添加顾问评价

### 预约相关端点

- `GET /api/bookings` - 获取用户预约
- `GET /api/bookings/:bookingId` - 获取预约详情
- `POST /api/bookings` - 创建预约
- `PUT /api/bookings/:bookingId` - 更新预约
- `POST /api/bookings/:bookingId/cancel` - 取消预约

## 实现计划

1. 扩展现有的 Consultant 模型
2. 创建新的数据模型：ConsultantReview, ConsultantAvailability, MatchResult, Booking
3. 实现顾问服务：consultantService, consultantMatchingService
4. 实现预约服务：bookingService
5. 实现控制器：consultantController, bookingController
6. 定义路由：consultantRoutes, bookingRoutes
7. 更新 app.js 添加新路由
8. 实现顾问匹配算法
9. 实现预约管理系统
