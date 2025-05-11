# 表格生成功能实现文档

## 概述

表格生成功能允许用户基于其个人资料数据自动生成官方移民申请表格。该功能包括表格模板选择、数据自动填充、表格验证和PDF生成与下载等核心功能。本文档详细描述了后端实现方案。

## 数据模型

### 表格模型 (Form)

```javascript
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formType: {
    type: String,
    required: true
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'error'],
    default: 'generating'
  },
  validationResults: [{
    fieldPath: String,
    severity: {
      type: String,
      enum: ['error', 'warning', 'info']
    },
    message: String,
    code: String
  }],
  generatedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  downloadUrl: String,
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// 更新时间戳
formSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
```

### 表格类型模型 (FormType)

```javascript
const mongoose = require('mongoose');

const formTypeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  requiredFields: [String],
  templateId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const FormType = mongoose.model('FormType', formTypeSchema);

module.exports = FormType;
```

### 表格模板模型 (FormTemplate)

```javascript
const mongoose = require('mongoose');

const formTemplateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  structure: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  validationRules: [mongoose.Schema.Types.Mixed]
}, {
  timestamps: true
});

const FormTemplate = mongoose.model('FormTemplate', formTemplateSchema);

module.exports = FormTemplate;
```

## 服务层

### 表格服务 (formService.js)

表格服务提供表格生成、更新、验证和PDF生成等核心功能。

```javascript
/**
 * 获取所有表格类型
 * @returns {Promise<Array>} 表格类型列表
 */
async function getFormTypes() {
  // 实现获取表格类型的逻辑
}

/**
 * 获取用户的所有表格
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} 用户表格列表
 */
async function getUserForms(userId) {
  // 实现获取用户表格的逻辑
}

/**
 * 获取特定表格详情
 * @param {string} userId - 用户ID
 * @param {string} formId - 表格ID
 * @returns {Promise<Object>} 表格详情
 */
async function getFormById(userId, formId) {
  // 实现获取特定表格的逻辑
}

/**
 * 生成新表格
 * @param {string} userId - 用户ID
 * @param {string} formType - 表格类型
 * @param {Object} options - 生成选项
 * @returns {Promise<Object>} 生成的表格
 */
async function generateForm(userId, formType, options = {}) {
  // 实现表格生成逻辑
}

/**
 * 更新表格数据
 * @param {string} userId - 用户ID
 * @param {string} formId - 表格ID
 * @param {Object} formData - 表格数据
 * @returns {Promise<Object>} 更新后的表格
 */
async function updateForm(userId, formId, formData) {
  // 实现表格更新逻辑
}

/**
 * 更新表格特定字段
 * @param {string} userId - 用户ID
 * @param {string} formId - 表格ID
 * @param {string} fieldPath - 字段路径
 * @param {any} value - 字段值
 * @returns {Promise<Object>} 更新结果
 */
async function updateFormField(userId, formId, fieldPath, value) {
  // 实现字段更新逻辑
}

/**
 * 获取表格PDF下载链接
 * @param {string} userId - 用户ID
 * @param {string} formId - 表格ID
 * @returns {Promise<Object>} 下载链接
 */
async function getFormDownloadUrl(userId, formId) {
  // 实现获取下载链接的逻辑
}
```

### 表格验证服务 (formValidationService.js)

表格验证服务提供表格数据验证功能。

```javascript
/**
 * 验证表格数据
 * @param {string} formType - 表格类型
 * @param {Object} formData - 表格数据
 * @returns {Promise<Array>} 验证结果
 */
async function validateForm(formType, formData) {
  // 实现表格验证逻辑
}

/**
 * 验证特定字段
 * @param {string} formType - 表格类型
 * @param {string} fieldPath - 字段路径
 * @param {any} value - 字段值
 * @returns {Promise<Object>} 验证结果
 */
async function validateField(formType, fieldPath, value) {
  // 实现字段验证逻辑
}
```

### PDF生成服务 (pdfGenerationService.js)

PDF生成服务提供表格数据转换为PDF文件的功能。

```javascript
/**
 * 生成PDF文件
 * @param {string} formType - 表格类型
 * @param {Object} formData - 表格数据
 * @returns {Promise<Buffer>} PDF文件Buffer
 */
async function generatePdf(formType, formData) {
  // 实现PDF生成逻辑
}

/**
 * 保存PDF文件并返回URL
 * @param {string} userId - 用户ID
 * @param {string} formId - 表格ID
 * @param {Buffer} pdfBuffer - PDF文件Buffer
 * @returns {Promise<string>} PDF文件URL
 */
async function savePdfAndGetUrl(userId, formId, pdfBuffer) {
  // 实现PDF保存和URL生成逻辑
}
```

### 数据映射服务 (dataMappingService.js)

数据映射服务提供用户资料数据到表格字段的映射功能。

```javascript
/**
 * 将用户资料映射到表格数据
 * @param {string} userId - 用户ID
 * @param {string} formType - 表格类型
 * @returns {Promise<Object>} 映射后的表格数据
 */
async function mapUserDataToForm(userId, formType) {
  // 实现数据映射逻辑
}
```

## 控制器层

### 表格控制器 (formController.js)

表格控制器处理表格相关的HTTP请求。

```javascript
/**
 * 获取表格类型列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getFormTypes(req, res, next) {
  // 实现获取表格类型的控制器逻辑
}

/**
 * 获取用户表格列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getUserForms(req, res, next) {
  // 实现获取用户表格的控制器逻辑
}

/**
 * 获取特定表格
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getForm(req, res, next) {
  // 实现获取特定表格的控制器逻辑
}

/**
 * 生成新表格
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function generateForm(req, res, next) {
  // 实现生成表格的控制器逻辑
}

/**
 * 更新表格
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function updateForm(req, res, next) {
  // 实现更新表格的控制器逻辑
}

/**
 * 更新表格字段
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function updateFormField(req, res, next) {
  // 实现更新表格字段的控制器逻辑
}

/**
 * 获取表格下载链接
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getFormDownload(req, res, next) {
  // 实现获取表格下载链接的控制器逻辑
}
```

## 路由层

### 表格路由 (formRoutes.js)

表格路由定义表格相关的API端点。

```javascript
const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const formController = require('../../controllers/forms/formController');

const router = express.Router();

// 获取表格类型
router.get('/types', formController.getFormTypes);

// 获取用户表格
router.get('/:userId', verifyToken, formController.getUserForms);

// 获取特定表格
router.get('/:userId/:formId', verifyToken, formController.getForm);

// 生成新表格
router.post('/:userId/generate', verifyToken, formController.generateForm);

// 更新表格
router.put('/:userId/:formId', verifyToken, formController.updateForm);

// 更新表格字段
router.patch('/:userId/:formId/field', verifyToken, formController.updateFormField);

// 获取表格下载链接
router.get('/:userId/:formId/download', verifyToken, formController.getFormDownload);

module.exports = router;
```

## 集成到应用程序

在主应用程序文件 (app.js) 中集成表格路由：

```javascript
const formRoutes = require('./routes/forms/formRoutes');

// ...

app.use('/api/forms', formRoutes);
```

## 技术实现细节

### 表格模板管理

表格模板使用JSON结构定义，包含字段定义、验证规则和布局信息。

### 数据映射

用户资料数据通过映射规则转换为表格字段值，支持复杂的数据转换和计算。

### PDF生成

使用PDFKit或类似库将表格数据转换为PDF文件，支持自定义布局和样式。

### 表格验证

实现多级验证规则，包括必填字段、格式验证、逻辑验证和跨字段验证。

### 版本控制

支持表格版本历史管理，允许用户查看和恢复历史版本。

## 未来改进

1. 表格批量生成
2. 表格模板自定义
3. 表格数据导入/导出
4. 高级表格验证规则
5. 表格填写指南和帮助提示
6. 表格共享功能
7. 表格签名功能
