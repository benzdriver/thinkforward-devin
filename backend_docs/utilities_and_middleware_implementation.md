# 工具和中间件实现文档

## 概述

本文档详细描述了ThinkForward AI平台的工具和中间件组件实现。这些组件为整个后端应用程序提供支持功能，包括本地化、错误处理、API客户端和各种中间件。

## 工具组件

### 本地化工具 (localization.js)

本地化工具提供多语言支持，使应用程序能够以用户首选语言显示内容。

#### 主要功能

- **translateMessage**: 将消息翻译为指定语言
- **getTranslations**: 获取特定命名空间的所有翻译
- **addTranslation**: 添加新翻译
- **hasTranslation**: 检查翻译是否存在
- **formatDate**: 根据语言环境格式化日期
- **formatNumber**: 根据语言环境格式化数字
- **formatCurrency**: 根据语言环境格式化货币

```javascript
/**
 * 将消息翻译为指定语言
 * @param {string} key - 翻译键
 * @param {string} locale - 语言代码（例如，'en', 'fr', 'zh'）
 * @param {Object} options - 翻译的其他选项
 * @returns {string} - 翻译后的消息
 */
function translateMessage(key, locale = 'en', options = {}) {
  return i18next.t(key, { lng: locale, ...options });
}
```

#### 支持的语言

- 英语 (en) - 默认
- 法语 (fr)
- 中文 (zh)

#### 翻译命名空间

- **common**: 通用消息
- **errors**: 错误消息
- **validation**: 验证消息

### API客户端 (apiClient.js)

API客户端提供与外部数据源交互的功能，特别是各国的移民API。

#### 主要功能

- **fetchExternalData**: 从外部API获取数据
- **fetchImmigrationData**: 从移民API获取数据
- **fetchImmigrationNews**: 获取最新移民新闻
- **fetchProgramDetails**: 获取移民项目详情
- **fetchProcessingTimes**: 获取处理时间
- **fetchDocumentChecklist**: 获取文件清单

```javascript
/**
 * 从外部API获取数据
 * @param {string} url - API端点URL
 * @param {Object} options - 请求选项
 * @param {string} locale - 错误消息的语言
 * @returns {Promise<Object>} - API响应数据
 */
async function fetchExternalData(url, options = {}, locale = 'en') {
  try {
    const { method = 'GET', data = null, headers = {}, params = {} } = options;
    
    const response = await apiClient({
      url,
      method,
      data,
      headers,
      params
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // 错误处理...
  }
}
```

#### 支持的国家

- 加拿大 (ca)
- 美国 (us)
- 澳大利亚 (au)
- 英国 (uk)
- 新西兰 (nz)

### 错误处理工具 (errorHandler.js)

错误处理工具提供统一的错误处理和翻译功能。

#### 主要功能

- **translateError**: 将错误消息翻译为用户语言
- **formatValidationErrors**: 格式化验证错误响应

```javascript
/**
 * 将错误翻译为用户语言
 * @param {Error} error - 错误对象
 * @param {string} locale - 语言代码
 * @returns {Object} - 翻译后的错误
 */
function translateError(error, locale = 'en') {
  const translatedError = {
    message: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    statusCode: error.statusCode || 500,
    details: error.details || null
  };
  
  // 翻译特定错误...
  
  return translatedError;
}
```

## 中间件组件

### 本地化中间件 (localeMiddleware.js)

本地化中间件根据请求设置响应语言。

#### 主要功能

- **localeMiddleware**: 设置请求的语言环境
- **getPreferredLocale**: 确定用户首选语言

```javascript
/**
 * 设置请求的语言环境
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个函数
 */
function localeMiddleware(req, res, next) {
  const locale = getPreferredLocale(req);
  req.locale = locale;
  next();
}
```

#### 语言检测方法

1. 查询参数 (`?lang=zh`)
2. 请求头 (`Accept-Language`)
3. 用户设置 (如果已认证)
4. 默认语言 (英语)

### 错误中间件 (errorMiddleware.js)

错误中间件提供全局错误处理功能。

#### 主要功能

- **handleErrors**: 全局错误处理
- **handle404**: 处理404错误
- **handleValidationErrors**: 处理验证错误
- **handleRateLimitExceeded**: 处理速率限制错误

```javascript
/**
 * 全局错误处理
 * @param {Error} err - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个函数
 */
function handleErrors(err, req, res, next) {
  const locale = req.locale || 'en';
  
  // 记录错误以便调试
  console.error('Error:', err);
  
  // 翻译和格式化错误
  const translatedError = translateError(err, locale);
  
  // 设置适当的状态码
  const statusCode = translatedError.statusCode || 500;
  
  // 发送错误响应
  res.status(statusCode).json({
    success: false,
    error: {
      code: translatedError.code || 'INTERNAL_SERVER_ERROR',
      message: translatedError.message || 'An unexpected error occurred',
      details: translatedError.details || null
    }
  });
}
```

### 认证中间件 (authMiddleware.js)

认证中间件验证API请求并检查用户权限。

#### 主要功能

- **verifyToken**: 验证JWT令牌
- **checkRole**: 验证用户角色和权限

```javascript
/**
 * 验证JWT令牌
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个函数
 */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }
}
```

## 应用程序集成

这些工具和中间件组件在主应用程序文件 (app.js) 中集成，为整个应用程序提供支持功能。

```javascript
// 导入中间件
const { localeMiddleware } = require('./middleware/localeMiddleware');
const { handleErrors, handle404, handleValidationErrors } = require('./middleware/errorMiddleware');

// 应用中间件
app.use(helmet()); // 安全头
app.use(cors()); // 启用CORS
app.use(morgan('dev')); // 日志记录
app.use(express.json()); // 解析JSON主体
app.use(express.urlencoded({ extended: true })); // 解析URL编码主体
app.use(localeMiddleware); // 根据请求设置语言环境

// 错误处理
app.use(handle404);
app.use(handleValidationErrors);
app.use(handleErrors);
```

## 文件结构

```
backend/
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── localeMiddleware.js
├── utils/
│   ├── apiClient.js
│   ├── errorHandler.js
│   └── localization.js
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── errors.json
│   │   └── validation.json
│   ├── fr/
│   │   ├── common.json
│   │   ├── errors.json
│   │   └── validation.json
│   └── zh/
│       ├── common.json
│       ├── errors.json
│       └── validation.json
└── app.js
```

## 未来改进

未来可能的改进包括：

1. **扩展语言支持**
   - 添加更多语言（如西班牙语、阿拉伯语等）
   - 改进翻译质量和覆盖范围

2. **增强API客户端**
   - 添加缓存机制
   - 实现重试逻辑
   - 添加更多外部API集成

3. **改进错误处理**
   - 添加更详细的错误分类
   - 实现错误日志记录系统
   - 添加用户友好的错误消息

4. **安全增强**
   - 实现更高级的速率限制
   - 添加CSRF保护
   - 增强认证机制
