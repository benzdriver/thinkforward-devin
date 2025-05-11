# 移民途径模块实现文档

## 概述

移民途径模块是ThinkForward AI平台的关键组件，提供各种移民途径的详细信息、资格检查和个性化推荐。该模块允许用户浏览不同国家和类别的移民途径，检查自己对特定途径的资格，并获取基于其个人资料的推荐途径。

## 技术栈

- **后端框架**: Node.js + Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT (JSON Web Tokens)
- **验证**: express-validator
- **国际化**: 支持多语言内容和错误消息

## 数据模型

### 移民途径模型 (Pathway)

移民途径模型存储各种移民途径的详细信息，包括：

- 名称和代码
- 国家和类别
- 描述
- 资格标准
- 处理时间和申请费用
- 所需文件
- 申请步骤
- 官方链接
- 多语言翻译

```javascript
const pathwaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['federal', 'provincial', 'regional', 'business', 'family', 'humanitarian', 'other'],
    required: true
  },
  // 其他字段...
});
```

## API端点

### 移民途径浏览

- **GET /api/pathway**: 获取所有移民途径
  - 查询参数: `country`, `category`
- **GET /api/pathway/categories**: 获取移民途径类别
  - 查询参数: `country`
- **GET /api/pathway/countries**: 获取提供移民途径的国家

### 移民途径详情

- **GET /api/pathway/id/:id**: 通过ID获取移民途径详情
- **GET /api/pathway/code/:code**: 通过代码获取移民途径详情

### 资格检查和推荐

- **POST /api/pathway/eligibility/:id**: 检查用户对特定途径的资格
  - 请求体: `{ profileData: {...} }`
- **POST /api/pathway/recommendations**: 获取推荐的移民途径
  - 请求体: `{ profileData: {...} }`

### 管理端点（仅限管理员）

- **POST /api/pathway**: 创建新的移民途径
- **PUT /api/pathway/:id**: 更新移民途径
- **DELETE /api/pathway/:id**: 删除移民途径

## 功能实现

### 移民途径浏览

系统支持按国家和类别筛选移民途径，并提供多语言支持：

```javascript
exports.getAllPathways = async (filters = {}, locale = 'en') => {
  try {
    const query = { isActive: true };
    
    // 应用筛选条件
    if (filters.country) {
      query.country = filters.country;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    // 获取途径
    const pathways = await Pathway.find(query).sort({ popularity: -1 });
    
    // 应用翻译
    return pathways.map(pathway => {
      const translation = pathway.getTranslation(locale);
      
      return {
        id: pathway._id,
        code: pathway.code,
        name: translation.name,
        // 其他字段...
      };
    });
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};
```

### 资格检查

系统根据用户的个人资料检查其对特定移民途径的资格：

```javascript
pathwaySchema.methods.checkEligibility = function(userProfile) {
  const requiredCriteria = this.eligibilityCriteria.filter(c => c.type === 'required');
  const optionalCriteria = this.eligibilityCriteria.filter(c => c.type === 'optional');
  const bonusCriteria = this.eligibilityCriteria.filter(c => c.type === 'bonus');
  
  // 检查必要条件（必须全部满足）
  const requiredResults = requiredCriteria.map(criteria => {
    return {
      name: criteria.name,
      met: /* 检查逻辑 */,
      points: 0
    };
  });
  
  // 检查可选条件
  const optionalResults = optionalCriteria.map(criteria => {
    const met = /* 检查逻辑 */;
    return {
      name: criteria.name,
      met,
      points: met ? criteria.points : 0
    };
  });
  
  // 计算总分
  const totalPoints = [...requiredResults, ...optionalResults, ...bonusResults]
    .reduce((sum, result) => sum + result.points, 0);
  
  // 确定资格状态
  let eligibilityStatus;
  if (allRequiredMet) {
    eligibilityStatus = 'eligible';
  } else if (requiredResults.filter(r => r.met).length >= requiredResults.length * 0.7) {
    eligibilityStatus = 'potentially_eligible';
  } else {
    eligibilityStatus = 'not_eligible';
  }
  
  return {
    status: eligibilityStatus,
    points: totalPoints,
    // 其他字段...
  };
};
```

### 途径推荐

系统根据用户的个人资料推荐最适合的移民途径：

```javascript
exports.getRecommendedPathways = async (userId, profileData = null, locale = 'en') => {
  try {
    // 获取所有活跃的途径
    const pathways = await Pathway.find({ isActive: true });
    
    // 获取用户资料
    let userProfile = profileData || /* 从数据库获取用户资料 */;
    
    // 检查每个途径的资格
    const recommendations = await Promise.all(
      pathways.map(async (pathway) => {
        const eligibilityResult = pathway.checkEligibility(userProfile);
        const translation = pathway.getTranslation(locale);
        
        return {
          id: pathway._id,
          code: pathway.code,
          name: translation.name,
          // 其他字段...
          eligibility: eligibilityResult.status,
          points: eligibilityResult.points,
          maxPoints: eligibilityResult.maxPoints,
          matchPercentage: Math.round((eligibilityResult.points / eligibilityResult.maxPoints) * 100) || 0
        };
      })
    );
    
    // 按资格状态和匹配度排序
    return recommendations.sort((a, b) => {
      // 首先按资格状态排序
      const statusOrder = { eligible: 0, potentially_eligible: 1, not_eligible: 2 };
      const statusDiff = statusOrder[a.eligibility] - statusOrder[b.eligibility];
      
      if (statusDiff !== 0) {
        return statusDiff;
      }
      
      // 然后按匹配度排序
      return b.matchPercentage - a.matchPercentage;
    });
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};
```

## 国际化支持

移民途径模块支持多语言，包括：

- 途径名称、描述和详情的翻译
- 资格标准和所需文件的翻译
- 申请步骤的翻译
- 错误消息的翻译

```javascript
pathwaySchema.methods.getTranslation = function(locale = 'en') {
  if (!this.translations.has(locale)) {
    return {
      name: this.name,
      description: this.description,
      // 其他字段...
    };
  }
  
  const translation = this.translations.get(locale);
  
  return {
    name: translation.name || this.name,
    description: translation.description || this.description,
    // 其他字段...
  };
};
```

## 安全性

移民途径模块实现了以下安全措施：

- 公共端点（浏览和详情）不需要认证
- 个人化端点（资格检查和推荐）需要认证
- 管理端点（创建、更新和删除）需要管理员权限
- 输入验证防止无效数据
- 错误处理避免敏感信息泄露

## 测试策略

移民途径模块的测试应包括：

- 单元测试：测试各个服务方法和模型方法
- 集成测试：测试API端点和数据流
- 端到端测试：测试完整的用户流程

## 部署考虑

部署移民途径模块时应考虑：

- 数据库索引优化查询性能
- 缓存常用途径和类别
- 监控用户参与度和推荐准确性

## 未来改进

未来可能的改进包括：

- 实现更复杂的资格检查算法
- 添加机器学习推荐系统
- 支持更多国家和途径类型
- 添加途径比较功能
- 实现途径更新通知功能
