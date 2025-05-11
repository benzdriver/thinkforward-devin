# 认证模块实现文档

本文档详细描述了ThinkForward AI平台的认证模块实现，包括用户管理、身份验证和授权功能。

## 1. 模块概述

认证模块负责处理用户注册、登录、注销以及令牌管理等功能，是整个应用程序的安全基础。该模块实现了JWT（JSON Web Token）认证机制，支持访问令牌和刷新令牌，并提供了密码重置和更改功能。

## 2. 技术栈

- Node.js 和 Express.js 框架
- MongoDB 数据库与 Mongoose ODM
- JWT 用于无状态身份验证
- bcryptjs 用于密码哈希
- express-validator 用于请求验证

## 3. 数据模型

### User 模型

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'consultant'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
```

## 4. API 端点

### 认证路由

| 方法 | 端点 | 描述 | 访问权限 |
|------|------|------|----------|
| POST | /api/auth/login | 用户登录 | 公开 |
| POST | /api/auth/register | 用户注册 | 公开 |
| POST | /api/auth/logout | 用户注销 | 私有 |
| POST | /api/auth/reset-password | 请求密码重置 | 公开 |
| POST | /api/auth/change-password | 更改用户密码 | 私有 |
| POST | /api/auth/refresh-token | 刷新认证令牌 | 公开 |
| GET | /api/auth/validate-token | 验证认证令牌 | 公开 |

## 5. 请求和响应格式

### 登录请求

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 登录响应

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "tokens": {
      "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 注册请求

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### 注册响应

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "tokens": {
      "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

## 6. 安全实现

### 密码哈希

使用 bcryptjs 库对密码进行哈希处理，确保数据库中不存储明文密码。

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

### JWT 认证

使用 JSON Web Token 实现无状态身份验证，包括短期访问令牌和长期刷新令牌。

```javascript
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'thinkforward-secret-key',
    { expiresIn: '1h' }
  );
};

userSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET || 'thinkforward-refresh-secret-key',
    { expiresIn: '7d' }
  );
  
  this.refreshToken = refreshToken;
  return refreshToken;
};
```

### 认证中间件

使用中间件验证请求中的 JWT 令牌，保护需要身份验证的路由。

```javascript
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: translateError(new Error('Authentication required'), req.locale || 'en').message
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thinkforward-secret-key');
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // 错误处理...
  }
};
```

## 7. 国际化支持

认证模块支持多语言错误消息，通过 `localeMiddleware` 中间件和 `translateError` 工具函数实现。

```javascript
// 在服务中使用翻译错误消息
const translatedError = translateError(error, locale);
throw translatedError;
```

## 8. 错误处理

实现了统一的错误处理机制，包括验证错误、认证错误和服务器错误。

```javascript
// 控制器中的错误处理示例
try {
  // 业务逻辑...
} catch (error) {
  console.error('Login error:', error);
  
  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || 'An error occurred during login'
  });
}
```

## 9. 测试策略

### 单元测试

- 测试用户模型方法（comparePassword, generateAuthToken, generateRefreshToken）
- 测试认证服务函数（authenticateUser, createUser, generateTokens, verifyToken）
- 测试密码哈希和验证

### 集成测试

- 测试认证路由（/login, /register, /logout 等）
- 测试认证中间件
- 测试令牌刷新机制

## 10. 部署注意事项

- 在生产环境中设置强密钥用于 JWT 签名（JWT_SECRET 和 JWT_REFRESH_SECRET）
- 配置适当的令牌过期时间
- 实现 HTTPS 以保护令牌传输
- 考虑实现速率限制以防止暴力攻击

## 11. 未来改进

- 实现双因素认证
- 添加社交媒体登录选项
- 实现更复杂的角色和权限系统
- 添加登录尝试限制和账户锁定机制
- 实现 OAuth2.0 支持
