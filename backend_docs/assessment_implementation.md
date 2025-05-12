# 评估模块实现文档

## 概述

评估模块是ThinkForward AI平台的核心功能之一，允许用户完成不同类型的移民评估，并获取个性化的移民途径建议。该模块支持多种评估类型，包括综合评估、快速评估和针对性评估，以满足不同用户的需求。

## 技术栈

- **后端框架**: Node.js + Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT (JSON Web Tokens)
- **验证**: express-validator
- **国际化**: 支持多语言错误消息和问题翻译

## 数据模型

### 评估模型 (Assessment)

评估模型存储用户的评估会话信息，包括：

- 用户ID
- 评估类型（综合、快速、针对性）
- 评估状态（已开始、进行中、已完成、已放弃）
- 当前步骤和总步骤数
- 完成进度
- 开始和完成时间
- 用户回答
- 结果ID
- 元数据

```javascript
const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['comprehensive', 'express', 'targeted'],
    required: true
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'abandoned'],
    default: 'started'
  },
  // 其他字段...
});
```

### 评估问题模型 (AssessmentQuestion)

评估问题模型定义了评估中的问题，包括：

- 问题文本
- 问题类型（多选、单选、文本、数字、日期、布尔、量表）
- 选项及其分数
- 问题类别（个人、教育、工作、语言、移民、偏好）
- 评估类型（适用于哪种评估）
- 顺序
- 是否必填
- 依赖条件
- 翻译

```javascript
const assessmentQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'single_choice', 'text', 'number', 'date', 'boolean', 'scale'],
    required: true
  },
  // 其他字段...
});
```

### 评估结果模型 (AssessmentResult)

评估结果模型存储评估的结果和建议，包括：

- 评估ID和用户ID
- 总分和分类别得分
- 推荐的移民途径
- 匹配的移民途径及匹配度
- 总结、优势、劣势和下一步建议

```javascript
const assessmentResultSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 其他字段...
});
```

## API端点

### 评估类型

- **GET /api/assessment/types**: 获取可用的评估类型

### 开始评估

- **POST /api/assessment/start**: 开始新的评估
  - 请求体: `{ type: 'comprehensive', metadata: {} }`

### 问题和回答

- **GET /api/assessment/:id/questions/:step**: 获取评估问题
- **POST /api/assessment/:id/responses**: 提交问题回答
  - 请求体: `{ questionId: '...', response: '...' }`

### 进度和结果

- **GET /api/assessment/:id/progress**: 获取评估进度
- **GET /api/assessment/:id/result**: 获取评估结果
- **GET /api/assessment/user/:userId**: 获取用户的评估列表
- **GET /api/assessment/user**: 获取当前用户的评估列表

## 功能实现

### 评估流程

1. 用户选择评估类型并开始评估
2. 系统按顺序呈现问题
3. 用户回答问题，系统记录回答并计算分数
4. 评估完成后，系统生成结果和建议

### 问题依赖逻辑

评估问题可以依赖于之前问题的回答，实现条件性问题流程：

```javascript
// 如果问题依赖于之前的回答
if (currentQuestion.dependsOn && currentQuestion.dependsOn.questionId) {
  const dependentResponse = assessment.getResponse(currentQuestion.dependsOn.questionId);
  
  // 如果依赖的问题未回答或不匹配所需值，跳过此问题
  if (!dependentResponse || dependentResponse.response !== currentQuestion.dependsOn.value) {
    // 移至下一个问题
    return await exports.fetchQuestions(assessmentId, step + 1, locale);
  }
}
```

### 分数计算

系统根据用户回答计算分数，不同问题类型有不同的计分逻辑：

```javascript
// 单选题计分
const option = this.options.find(o => o.value === response);
return option ? option.score : 0;

// 多选题计分
return response.reduce((total, value) => {
  const option = this.options.find(o => o.value === value);
  return total + (option ? option.score : 0);
}, 0);
```

### 结果生成

评估完成后，系统生成结果，包括：

1. 计算各类别得分
2. 计算总体得分
3. 确定匹配的移民途径及匹配度
4. 生成优势、劣势和下一步建议

## 国际化支持

评估模块支持多语言，包括：

- 问题和选项的翻译
- 错误消息的翻译
- 结果和建议的翻译

```javascript
// 获取翻译后的问题
assessmentQuestionSchema.methods.getTranslation = function(locale = 'en') {
  if (!this.translations.has(locale)) {
    return {
      questionText: this.questionText,
      options: this.options
    };
  }
  
  const translation = this.translations.get(locale);
  
  return {
    questionText: translation.questionText || this.questionText,
    options: translation.options || this.options
  };
};
```

## 安全性

评估模块实现了以下安全措施：

- 所有评估API端点都需要认证
- 用户只能访问自己的评估
- 输入验证防止无效数据
- 错误处理避免敏感信息泄露

## 测试策略

评估模块的测试应包括：

- 单元测试：测试各个服务方法和模型方法
- 集成测试：测试API端点和数据流
- 端到端测试：测试完整的评估流程

## 部署考虑

部署评估模块时应考虑：

- 数据库索引优化查询性能
- 缓存常用评估类型和问题
- 监控评估完成率和用户参与度

## 未来改进

未来可能的改进包括：

- 实现更复杂的评分算法
- 添加机器学习推荐系统
- 支持自定义评估类型
- 添加评估结果比较功能
- 实现评估结果导出功能
