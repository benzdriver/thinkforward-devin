/**
 * 表格模型
 * 存储用户生成的表格数据
 */

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

formSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

/**
 * 获取表格验证错误
 * @returns {Array} 验证错误列表
 */
formSchema.methods.getValidationErrors = function() {
  return this.validationResults.filter(result => result.severity === 'error');
};

/**
 * 获取表格验证警告
 * @returns {Array} 验证警告列表
 */
formSchema.methods.getValidationWarnings = function() {
  return this.validationResults.filter(result => result.severity === 'warning');
};

/**
 * 检查表格是否有验证错误
 * @returns {Boolean} 是否有验证错误
 */
formSchema.methods.hasValidationErrors = function() {
  return this.getValidationErrors().length > 0;
};

/**
 * 添加验证结果
 * @param {String} fieldPath - 字段路径
 * @param {String} severity - 严重程度 (error, warning, info)
 * @param {String} message - 消息
 * @param {String} code - 错误代码
 */
formSchema.methods.addValidationResult = function(fieldPath, severity, message, code) {
  this.validationResults.push({
    fieldPath,
    severity,
    message,
    code
  });
};

/**
 * 清除验证结果
 */
formSchema.methods.clearValidationResults = function() {
  this.validationResults = [];
};

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
