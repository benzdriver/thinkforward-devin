/**
 * 表格模板模型
 * 存储表格结构和验证规则
 */

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
  validationRules: [mongoose.Schema.Types.Mixed],
  pdfTemplate: {
    type: String,
    required: true
  },
  fieldMappings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

/**
 * 获取表格结构
 * @returns {Object} 表格结构
 */
formTemplateSchema.methods.getStructure = function() {
  return this.structure;
};

/**
 * 获取表格验证规则
 * @returns {Array} 验证规则
 */
formTemplateSchema.methods.getValidationRules = function() {
  return this.validationRules;
};

/**
 * 获取字段映射
 * @returns {Object} 字段映射
 */
formTemplateSchema.methods.getFieldMappings = function() {
  return this.fieldMappings;
};

/**
 * 按ID查找表格模板
 * @param {String} id - 模板ID
 * @returns {Promise<Object>} 表格模板
 */
formTemplateSchema.statics.findByTemplateId = function(id) {
  return this.findOne({ id, isActive: true });
};

/**
 * 获取最新版本的表格模板
 * @param {String} id - 模板ID
 * @returns {Promise<Object>} 最新版本的表格模板
 */
formTemplateSchema.statics.findLatestVersion = function(id) {
  return this.findOne({ id, isActive: true }).sort({ version: -1 });
};

const FormTemplate = mongoose.model('FormTemplate', formTemplateSchema);

module.exports = FormTemplate;
