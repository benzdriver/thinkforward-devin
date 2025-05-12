# 移民途径组件实现文档

## 概述

本文档详细描述了ThinkForward AI平台移民途径模块的扩展组件实现，包括移民途径申请、顾问和顾问匹配功能。这些组件增强了平台的功能，使用户能够申请移民途径、与移民顾问连接并跟踪整个移民过程。

## 数据模型

### 移民途径申请模型 (PathwayApplication)

移民途径申请模型跟踪用户对特定移民途径的申请，包括：

- 用户ID和途径ID
- 申请状态（草稿、已提交、处理中、已批准、已拒绝、已撤回、已完成）
- 提交和更新时间
- 申请笔记
- 所需文件及其状态
- 申请时间线
- 用户反馈

```javascript
const pathwayApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pathwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathway',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in_progress', 'approved', 'rejected', 'withdrawn', 'completed'],
    default: 'draft'
  },
  // 其他字段...
});
```

#### 主要方法

- `updateStatus(status, notes)`: 更新申请状态并添加到时间线
- `submit()`: 提交申请并更新状态
- `addDocument(document)`: 添加文件到申请
- `updateDocumentStatus(documentId, status, notes)`: 更新文件状态
- `addFeedback(rating, comments)`: 添加用户反馈

### 移民顾问模型 (Consultant)

移民顾问模型存储移民顾问的详细信息，包括：

- 个人和联系信息
- 专业领域和经验
- 语言能力
- 资格证书
- 评分和评论
- 可用性和工作时间
- 费用结构
- 位置信息

```javascript
const consultantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: [{
    type: String,
    enum: ['express_entry', 'provincial_nominee', 'business_immigration', 'family_sponsorship', 'refugee', 'study_permit', 'work_permit', 'citizenship', 'appeals', 'other'],
    required: true
  }],
  // 其他字段...
});
```

#### 主要方法

- `addReview(review)`: 添加或更新顾问评论
- `updateAvailability(status, nextAvailableDate)`: 更新顾问可用性
- `findBySpecialization(specialization)`: 按专业领域查找顾问
- `findByLanguage(language)`: 按语言能力查找顾问
- `findByLocation(country, province, city)`: 按位置查找顾问

### 顾问匹配模型 (ConsultantMatch)

顾问匹配模型连接用户与移民顾问，包括：

- 用户ID、顾问ID和途径ID
- 匹配状态（待处理、已接受、已拒绝、已完成、已取消）
- 匹配分数
- 请求详情
- 顾问回复
- 预约信息
- 通信记录
- 双方反馈

```javascript
const consultantMatchSchema = new mongoose.Schema({
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
  pathwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathway'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  // 其他字段...
});
```

#### 主要方法

- `updateStatus(status)`: 更新匹配状态
- `addConsultantResponse(response)`: 添加顾问回复
- `scheduleAppointment(appointment)`: 安排预约
- `addMessage(message)`: 添加通信消息
- `addUserFeedback(feedback)`: 添加用户反馈
- `addConsultantFeedback(feedback)`: 添加顾问反馈
- `findByUser(userId)`: 查找用户的匹配
- `findByConsultant(consultantId)`: 查找顾问的匹配
- `findByPathway(pathwayId)`: 查找途径的匹配

## 功能实现

### 移民途径申请流程

1. 用户浏览移民途径并选择申请
2. 系统创建草稿申请
3. 用户提交所需文件和信息
4. 用户提交申请，状态更新为"已提交"
5. 系统或管理员审核申请
6. 申请状态根据审核结果更新
7. 用户可以跟踪申请进度和时间线
8. 申请完成后，用户可以提供反馈

```javascript
// 提交申请
pathwayApplicationSchema.methods.submit = function() {
  if (this.status === 'draft') {
    this.status = 'submitted';
    this.submittedAt = new Date();
    this.lastUpdatedAt = new Date();
    
    // 添加到时间线
    this.timeline.push({
      date: new Date(),
      status: 'submitted',
      notes: 'Application submitted'
    });
  }
  
  return this;
};
```

### 顾问匹配流程

1. 用户请求与顾问匹配
2. 系统根据用户需求和顾问专业创建匹配
3. 顾问收到匹配请求并回复
4. 如果顾问接受，双方安排预约
5. 用户和顾问通过系统进行通信
6. 预约完成后，双方可以提供反馈
7. 匹配状态更新为"已完成"

```javascript
// 添加顾问回复
consultantMatchSchema.methods.addConsultantResponse = function(response) {
  this.consultantResponse = {
    ...response,
    responseTime: new Date()
  };
  
  if (response.accepted) {
    this.status = 'accepted';
  } else {
    this.status = 'declined';
  }
  
  this.updatedAt = new Date();
  
  return this;
};
```

### 顾问搜索和筛选

系统支持按多种条件搜索和筛选顾问：

1. 专业领域（如快速通道、省提名计划等）
2. 语言能力（如英语、法语、中文等）
3. 位置（国家、省/州、城市）
4. 评分和评论
5. 可用性和费用

```javascript
// 按专业领域查找顾问
consultantSchema.statics.findBySpecialization = function(specialization) {
  return this.find({
    specialization: specialization,
    isActive: true,
    isVerified: true
  }).sort({ 'rating.average': -1 });
};
```

## 数据关系

### 实体关系

1. **用户 (User)**
   - 有多个移民途径申请 (PathwayApplication)
   - 有多个顾问匹配 (ConsultantMatch)

2. **移民途径 (Pathway)**
   - 有多个移民途径申请 (PathwayApplication)
   - 有多个顾问匹配 (ConsultantMatch)

3. **移民顾问 (Consultant)**
   - 有多个顾问匹配 (ConsultantMatch)
   - 有多个评论 (通过reviews字段)

4. **移民途径申请 (PathwayApplication)**
   - 属于一个用户 (User)
   - 属于一个移民途径 (Pathway)
   - 有多个文件 (通过documents字段)
   - 有多个时间线事件 (通过timeline字段)

5. **顾问匹配 (ConsultantMatch)**
   - 属于一个用户 (User)
   - 属于一个顾问 (Consultant)
   - 可能关联一个移民途径 (Pathway)
   - 有多个通信消息 (通过communication字段)

### 数据库索引

为了优化查询性能，各模型实现了以下索引：

1. **PathwayApplication**
   - 复合索引：`{ userId: 1, pathwayId: 1 }`

2. **Consultant**
   - 复合索引：`{ specialization: 1, isActive: 1, isVerified: 1 }`
   - 复合索引：`{ 'languages.language': 1, isActive: 1, isVerified: 1 }`
   - 复合索引：`{ 'location.country': 1, 'location.province': 1, 'location.city': 1, isActive: 1, isVerified: 1 }`
   - 单字段索引：`{ 'rating.average': -1 }`

3. **ConsultantMatch**
   - 复合索引：`{ userId: 1, createdAt: -1 }`
   - 复合索引：`{ consultantId: 1, createdAt: -1 }`
   - 复合索引：`{ pathwayId: 1, createdAt: -1 }`
   - 单字段索引：`{ status: 1 }`

## 安全性考虑

移民途径组件实现了以下安全措施：

1. **访问控制**
   - 用户只能访问自己的申请和匹配
   - 顾问只能访问与自己相关的匹配
   - 管理员可以访问所有数据

2. **数据验证**
   - 所有输入数据经过验证
   - 敏感字段（如费用、评分）有范围限制

3. **隐私保护**
   - 用户和顾问的联系信息受保护
   - 通信记录仅对相关方可见

## 未来改进

未来可能的改进包括：

1. **实时通知**
   - 为状态更新、新消息和预约提醒实现实时通知

2. **文件管理**
   - 添加文件上传、存储和验证功能
   - 实现文件版本控制

3. **预约管理**
   - 添加日历集成
   - 实现自动预约提醒

4. **支付集成**
   - 添加顾问服务的支付功能
   - 实现发票和收据生成

5. **高级匹配算法**
   - 使用机器学习改进顾问匹配
   - 基于历史数据和成功案例优化推荐
