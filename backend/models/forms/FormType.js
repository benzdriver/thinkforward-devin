/**
 * 表格类型模型
 * 定义可用的表格类型
 */

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
  country: {
    type: String,
    required: true
  },
  requiredFields: [String],
  templateId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  translations: {
    type: Map,
    of: {
      name: String,
      description: String
    },
    default: {}
  }
}, {
  timestamps: true
});

/**
 * 获取表格类型的本地化名称
 * @param {String} locale - 语言代码
 * @returns {String} 本地化名称
 */
formTypeSchema.methods.getLocalizedName = function(locale = 'en') {
  if (this.translations.has(locale) && this.translations.get(locale).name) {
    return this.translations.get(locale).name;
  }
  return this.name;
};

/**
 * 获取表格类型的本地化描述
 * @param {String} locale - 语言代码
 * @returns {String} 本地化描述
 */
formTypeSchema.methods.getLocalizedDescription = function(locale = 'en') {
  if (this.translations.has(locale) && this.translations.get(locale).description) {
    return this.translations.get(locale).description;
  }
  return this.description;
};

/**
 * 按国家查找表格类型
 * @param {String} country - 国家代码
 * @returns {Promise<Array>} 表格类型列表
 */
formTypeSchema.statics.findByCountry = function(country) {
  return this.find({ country, isActive: true });
};

/**
 * 按类别查找表格类型
 * @param {String} category - 类别
 * @returns {Promise<Array>} 表格类型列表
 */
formTypeSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

const FormType = mongoose.model('FormType', formTypeSchema);

module.exports = FormType;
