/**
 * 错误处理工具
 * 提供统一的错误处理和响应格式化
 */

/**
 * 处理API错误并返回格式化的响应
 * @param {Error} error - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
const errorHandler = (error, req, res) => {
  console.error('错误:', error);
  
  let statusCode = 500;
  let errorResponse = {
    success: false,
    message: '服务器内部错误',
    code: 'SERVER_ERROR',
    errors: []
  };
  
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.message = '数据验证失败';
    errorResponse.code = 'VALIDATION_ERROR';
    
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        errorResponse.errors.push({
          field: key,
          message: error.errors[key].message,
          value: error.errors[key].value
        });
      });
    }
  } else if (error.name === 'CastError') {
    statusCode = 400;
    errorResponse.message = '无效的ID格式';
    errorResponse.code = 'INVALID_ID';
    errorResponse.errors.push({
      field: error.path,
      message: `无法将 "${error.value}" 转换为 ${error.kind}`,
      value: error.value
    });
  } else if (error.code === 11000) {
    statusCode = 409;
    errorResponse.message = '数据已存在';
    errorResponse.code = 'DUPLICATE_KEY';
    
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    errorResponse.errors.push({
      field,
      message: `${field} "${value}" 已存在`,
      value
    });
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse.message = '无效的认证令牌';
    errorResponse.code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse.message = '认证令牌已过期';
    errorResponse.code = 'TOKEN_EXPIRED';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    errorResponse.message = error.message || errorResponse.message;
    errorResponse.code = error.code || errorResponse.code;
    errorResponse.errors = error.errors || errorResponse.errors;
  } else if (error.message) {
    errorResponse.message = error.message;
  }
  
  if (process.env.NODE_ENV === 'development') {
    errorResponse.request = {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    };
    
    errorResponse.stack = error.stack;
  }
  
  logError(error, req, statusCode, errorResponse);
  
  return res.status(statusCode).json(errorResponse);
};

/**
 * 创建自定义错误对象
 * @param {String} message - 错误消息
 * @param {Number} statusCode - HTTP状态码
 * @param {String} code - 错误代码
 * @param {Array} errors - 错误详情数组
 */
const createError = (message, statusCode = 500, code = 'SERVER_ERROR', errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.errors = errors;
  return error;
};

/**
 * 记录错误日志
 * @param {Error} error - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Number} statusCode - HTTP状态码
 * @param {Object} errorResponse - 错误响应对象
 */
const logError = (error, req, statusCode, errorResponse) => {
  const logInfo = {
    timestamp: new Date().toISOString(),
    statusCode,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: req.user ? req.user.id : 'unauthenticated',
    errorCode: errorResponse.code,
    errorMessage: errorResponse.message,
    stack: error.stack
  };
  
  if (statusCode >= 500) {
    console.error('严重错误:', JSON.stringify(logInfo));
  } else if (statusCode >= 400) {
    console.warn('客户端错误:', JSON.stringify(logInfo));
  } else {
    console.info('其他错误:', JSON.stringify(logInfo));
  }
  
};

/**
 * 异步处理中间件
 * 包装异步路由处理器，自动捕获并处理错误
 * @param {Function} fn - 异步路由处理函数
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      errorHandler(error, req, res);
    });
  };
};

/**
 * 验证请求数据
 * 检查请求数据是否符合指定的验证规则
 * @param {Object} data - 要验证的数据
 * @param {Object} rules - 验证规则
 */
const validateRequest = (data, rules) => {
  const errors = [];
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: fieldRules.message || `${field} 是必填项`,
        code: 'REQUIRED_FIELD'
      });
      return; // 跳过此字段的其他验证
    }
    
    if (value === undefined || value === null) {
      return;
    }
    
    if (fieldRules.type && typeof value !== fieldRules.type) {
      errors.push({
        field,
        message: fieldRules.typeMessage || `${field} 必须是 ${fieldRules.type} 类型`,
        code: 'INVALID_TYPE',
        expected: fieldRules.type,
        received: typeof value
      });
    }
    
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors.push({
        field,
        message: fieldRules.minLengthMessage || `${field} 长度不能小于 ${fieldRules.minLength}`,
        code: 'MIN_LENGTH',
        min: fieldRules.minLength,
        actual: value.length
      });
    }
    
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors.push({
        field,
        message: fieldRules.maxLengthMessage || `${field} 长度不能大于 ${fieldRules.maxLength}`,
        code: 'MAX_LENGTH',
        max: fieldRules.maxLength,
        actual: value.length
      });
    }
    
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors.push({
        field,
        message: fieldRules.patternMessage || `${field} 格式不正确`,
        code: 'PATTERN_MISMATCH'
      });
    }
    
    if (fieldRules.validate && typeof fieldRules.validate === 'function') {
      const validateResult = fieldRules.validate(value, data);
      if (validateResult !== true) {
        errors.push({
          field,
          message: validateResult || `${field} 验证失败`,
          code: 'CUSTOM_VALIDATION'
        });
      }
    }
  });
  
  if (errors.length > 0) {
    const error = createError('数据验证失败', 400, 'VALIDATION_ERROR', errors);
    throw error;
  }
  
  return true;
};

module.exports = {
  errorHandler,
  createError,
  asyncHandler,
  validateRequest
};
