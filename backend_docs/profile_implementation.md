# 用户档案模块实现文档

本文档详细描述了ThinkForward AI平台的用户档案模块实现，包括个人信息、教育背景、工作经验、语言技能和移民信息的管理功能。

## 1. 模块概述

用户档案模块负责管理用户的个人和专业信息，这些信息对于评估移民资格和推荐合适的移民途径至关重要。该模块支持分段更新用户档案的不同部分，并跟踪档案完成状态。

## 2. 技术栈

- Node.js 和 Express.js 框架
- MongoDB 数据库与 Mongoose ODM
- JWT 用于身份验证
- express-validator 用于请求验证

## 3. 数据模型

### Profile 模型

```javascript
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    nationality: String,
    countryOfResidence: String,
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String
    },
    phone: String
  },
  educationInfo: [{
    highestDegree: String,
    institution: String,
    graduationYear: Number,
    fieldOfStudy: String,
    country: String,
    completed: Boolean,
    additionalInfo: String
  }],
  workExperience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    isCurrentJob: Boolean,
    description: String,
    country: String,
    nocCode: String
  }],
  languageSkills: [{
    language: String,
    proficiencyLevel: String,
    readingScore: Number,
    writingScore: Number,
    speakingScore: Number,
    listeningScore: Number,
    testType: String,
    testDate: Date
  }],
  immigrationInfo: {
    interestedPrograms: [String],
    preferredDestination: String,
    immigrationStatus: String,
    previousApplications: [{
      program: String,
      year: Number,
      status: String
    }]
  },
  completionStatus: {
    personalInfo: Boolean,
    educationInfo: Boolean,
    workExperience: Boolean,
    languageSkills: Boolean,
    immigrationInfo: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}, {
  timestamps: true
});
```

## 4. API 端点

### 档案路由

| 方法 | 端点 | 描述 | 访问权限 |
|------|------|------|----------|
| GET | /api/profile/:userId | 获取用户档案 | 私有 |
| GET | /api/profile | 获取当前用户档案 | 私有 |
| PATCH | /api/profile/:userId | 更新整个档案 | 私有 |
| PATCH | /api/profile | 更新当前用户档案 | 私有 |
| PATCH | /api/profile/:userId/personal-info | 更新个人信息 | 私有 |
| PATCH | /api/profile/personal-info | 更新当前用户个人信息 | 私有 |
| PATCH | /api/profile/:userId/education-info | 更新教育信息 | 私有 |
| PATCH | /api/profile/education-info | 更新当前用户教育信息 | 私有 |
| PATCH | /api/profile/:userId/work-experience | 更新工作经验 | 私有 |
| PATCH | /api/profile/work-experience | 更新当前用户工作经验 | 私有 |
| PATCH | /api/profile/:userId/language-skills | 更新语言技能 | 私有 |
| PATCH | /api/profile/language-skills | 更新当前用户语言技能 | 私有 |
| PATCH | /api/profile/:userId/immigration-info | 更新移民信息 | 私有 |
| PATCH | /api/profile/immigration-info | 更新当前用户移民信息 | 私有 |
| GET | /api/profile/:userId/completion | 获取档案完成状态 | 私有 |
| GET | /api/profile/completion | 获取当前用户档案完成状态 | 私有 |

## 5. 请求和响应格式

### 获取档案响应

```json
{
  "success": true,
  "data": {
    "userId": "60d21b4667d0d8992e610c85",
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "nationality": "United States",
      "countryOfResidence": "Canada"
    },
    "educationInfo": [
      {
        "highestDegree": "bachelor",
        "institution": "University of Toronto",
        "graduationYear": 2015,
        "fieldOfStudy": "Computer Science",
        "country": "Canada",
        "completed": true
      }
    ],
    "workExperience": [
      {
        "company": "Tech Solutions Inc.",
        "position": "Software Developer",
        "startDate": "2015-06-01T00:00:00.000Z",
        "endDate": "2020-12-31T00:00:00.000Z",
        "isCurrentJob": false,
        "country": "Canada",
        "nocCode": "21234"
      }
    ],
    "languageSkills": [
      {
        "language": "English",
        "proficiencyLevel": "advanced",
        "readingScore": 9,
        "writingScore": 8,
        "speakingScore": 8,
        "listeningScore": 9,
        "testType": "ielts",
        "testDate": "2022-03-15T00:00:00.000Z"
      }
    ],
    "immigrationInfo": {
      "interestedPrograms": ["Express Entry", "Provincial Nominee Program"],
      "preferredDestination": "Ontario",
      "immigrationStatus": "work_permit"
    },
    "completionStatus": {
      "personalInfo": true,
      "educationInfo": true,
      "workExperience": true,
      "languageSkills": true,
      "immigrationInfo": true
    },
    "createdAt": "2023-01-15T12:00:00.000Z",
    "updatedAt": "2023-05-10T09:30:00.000Z"
  }
}
```

### 更新个人信息请求

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "nationality": "United States",
  "countryOfResidence": "Canada",
  "address": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "Ontario",
    "postalCode": "M5V 2N4",
    "country": "Canada"
  },
  "phone": "+1 (416) 555-1234"
}
```

### 更新教育信息请求

```json
[
  {
    "highestDegree": "bachelor",
    "institution": "University of Toronto",
    "graduationYear": 2015,
    "fieldOfStudy": "Computer Science",
    "country": "Canada",
    "completed": true
  },
  {
    "highestDegree": "master",
    "institution": "McGill University",
    "graduationYear": 2017,
    "fieldOfStudy": "Data Science",
    "country": "Canada",
    "completed": true
  }
]
```

## 6. 功能实现

### 档案完成状态跟踪

档案模型包含一个 `completionStatus` 对象，用于跟踪各个部分的完成状态。每次保存档案时，都会自动更新这些状态。

```javascript
profileSchema.methods.updateCompletionStatus = function() {
  // Check personal info completion
  this.completionStatus.personalInfo = !!(
    this.personalInfo.firstName &&
    this.personalInfo.lastName &&
    this.personalInfo.dateOfBirth &&
    this.personalInfo.nationality &&
    this.personalInfo.countryOfResidence
  );
  
  // Check other sections...
};

profileSchema.pre('save', function(next) {
  this.updateCompletionStatus();
  next();
});
```

### 分段更新

档案服务支持分段更新档案的不同部分，使用户可以逐步完成其档案。

```javascript
exports.updateProfileSection = async (userId, section, sectionData, locale = 'en') => {
  try {
    // Find existing profile
    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      // Create new profile with section data
      const profileData = {};
      profileData[section] = sectionData;
      
      profile = new Profile({
        userId,
        ...profileData
      });
    } else {
      // Update specific section
      profile[section] = sectionData;
    }
    
    await profile.save();
    
    return profile;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};
```

### 授权检查

控制器方法包含授权检查，确保用户只能访问和修改自己的档案，除非他们是管理员。

```javascript
// Check if user is authorized to access this profile
if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({
    success: false,
    message: translateError(new Error('Not authorized to access this profile'), locale).message
  });
}
```

## 7. 国际化支持

档案模块支持多语言错误消息，通过 `localeMiddleware` 中间件和 `translateError` 工具函数实现。

```javascript
// 在服务中使用翻译错误消息
const translatedError = translateError(error, locale);
throw translatedError;
```

## 8. 错误处理

实现了统一的错误处理机制，包括验证错误、授权错误和服务器错误。

```javascript
// 控制器中的错误处理示例
try {
  // 业务逻辑...
} catch (error) {
  console.error('Update profile error:', error);
  
  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || 'An error occurred while updating profile'
  });
}
```

## 9. 测试策略

### 单元测试

- 测试档案模型方法（isComplete, updateCompletionStatus）
- 测试档案服务函数（fetchProfile, saveProfile, updateProfileSection）
- 测试档案完成状态计算

### 集成测试

- 测试档案路由（GET /profile, PATCH /profile/:userId/personal-info 等）
- 测试授权检查
- 测试档案分段更新

## 10. 部署注意事项

- 确保数据库索引以优化查询性能
- 实现数据验证以确保数据完整性
- 考虑实现数据缓存以提高性能
- 确保敏感数据的安全处理

## 11. 未来改进

- 添加档案导出功能（PDF, CSV）
- 实现档案版本控制
- 添加档案共享功能（与顾问或移民官员）
- 实现档案数据分析和建议
- 添加档案照片和文档上传功能
