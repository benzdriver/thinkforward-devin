/**
 * 表格验证服务
 * 提供表格数据验证功能
 */

const FormType = require('../../models/forms/FormType');
const FormTemplate = require('../../models/forms/FormTemplate');

/**
 * 验证表格数据
 * @param {String} formType - 表格类型
 * @param {Object} formData - 表格数据
 * @returns {Promise<Array>} 验证结果
 */
async function validateForm(formType, formData) {
  try {
    const formTypeDetails = await FormType.findOne({ id: formType, isActive: true });
    
    if (!formTypeDetails) {
      throw new Error('表格类型不存在');
    }
    
    const formTemplate = await FormTemplate.findByTemplateId(formTypeDetails.templateId);
    
    if (!formTemplate) {
      throw new Error('表格模板不存在');
    }
    
    const validationRules = formTemplate.getValidationRules();
    
    const validationResults = [];
    
    const requiredFields = formTypeDetails.requiredFields || [];
    
    for (const field of requiredFields) {
      const value = getNestedValue(formData, field);
      
      if (value === undefined || value === null || value === '') {
        validationResults.push({
          fieldPath: field,
          severity: 'error',
          message: `${field} 是必填字段`,
          code: 'REQUIRED_FIELD'
        });
      }
    }
    
    for (const rule of validationRules) {
      const { field, type, params, message, severity = 'error', code } = rule;
      const value = getNestedValue(formData, field);
      
      if ((value === undefined || value === null || value === '') && !requiredFields.includes(field)) {
        continue;
      }
      
      const isValid = applyValidationRule(type, value, params);
      
      if (!isValid) {
        validationResults.push({
          fieldPath: field,
          severity,
          message,
          code
        });
      }
    }
    
    const crossFieldRules = validationRules.filter(rule => rule.type === 'crossField');
    
    for (const rule of crossFieldRules) {
      const { fields, condition, message, severity = 'error', code } = rule;
      
      const fieldValues = {};
      
      for (const field of fields) {
        fieldValues[field] = getNestedValue(formData, field);
      }
      
      const isValid = evaluateCondition(condition, fieldValues);
      
      if (!isValid) {
        validationResults.push({
          fieldPath: fields.join(','),
          severity,
          message,
          code
        });
      }
    }
    
    return validationResults;
  } catch (error) {
    console.error('验证表格失败:', error);
    throw new Error('验证表格失败');
  }
}

/**
 * 验证特定字段
 * @param {String} formType - 表格类型
 * @param {String} fieldPath - 字段路径
 * @param {any} value - 字段值
 * @returns {Promise<Object>} 验证结果
 */
async function validateField(formType, fieldPath, value) {
  try {
    const formTypeDetails = await FormType.findOne({ id: formType, isActive: true });
    
    if (!formTypeDetails) {
      throw new Error('表格类型不存在');
    }
    
    const formTemplate = await FormTemplate.findByTemplateId(formTypeDetails.templateId);
    
    if (!formTemplate) {
      throw new Error('表格模板不存在');
    }
    
    const validationRules = formTemplate.getValidationRules();
    
    const fieldRules = validationRules.filter(rule => rule.field === fieldPath);
    
    const requiredFields = formTypeDetails.requiredFields || [];
    
    if (requiredFields.includes(fieldPath) && (value === undefined || value === null || value === '')) {
      return {
        fieldPath,
        severity: 'error',
        message: `${fieldPath} 是必填字段`,
        code: 'REQUIRED_FIELD'
      };
    }
    
    for (const rule of fieldRules) {
      const { type, params, message, severity = 'error', code } = rule;
      
      if ((value === undefined || value === null || value === '') && !requiredFields.includes(fieldPath)) {
        continue;
      }
      
      const isValid = applyValidationRule(type, value, params);
      
      if (!isValid) {
        return {
          fieldPath,
          severity,
          message,
          code
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('验证字段失败:', error);
    throw new Error('验证字段失败');
  }
}

/**
 * 获取嵌套对象的值
 * @param {Object} obj - 对象
 * @param {String} path - 路径
 * @returns {any} 值
 */
function getNestedValue(obj, path) {
  const pathParts = path.split('.');
  let value = obj;
  
  for (const part of pathParts) {
    if (value === undefined || value === null) {
      return undefined;
    }
    
    value = value[part];
  }
  
  return value;
}

/**
 * 应用验证规则
 * @param {String} type - 规则类型
 * @param {any} value - 值
 * @param {Object} params - 参数
 * @returns {Boolean} 是否有效
 */
function applyValidationRule(type, value, params) {
  switch (type) {
    case 'required':
      return value !== undefined && value !== null && value !== '';
    
    case 'minLength':
      return typeof value === 'string' && value.length >= params.min;
    
    case 'maxLength':
      return typeof value === 'string' && value.length <= params.max;
    
    case 'pattern':
      return typeof value === 'string' && new RegExp(params.regex).test(value);
    
    case 'min':
      return typeof value === 'number' && value >= params.min;
    
    case 'max':
      return typeof value === 'number' && value <= params.max;
    
    case 'email':
      return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
    case 'date':
      return isValidDate(value);
    
    case 'dateRange':
      return isValidDateRange(value, params.min, params.max);
    
    case 'enum':
      return params.values.includes(value);
    
    default:
      return true;
  }
}

/**
 * 检查日期是否有效
 * @param {String} value - 日期字符串
 * @returns {Boolean} 是否有效
 */
function isValidDate(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * 检查日期范围是否有效
 * @param {String} value - 日期字符串
 * @param {String} min - 最小日期
 * @param {String} max - 最大日期
 * @returns {Boolean} 是否有效
 */
function isValidDateRange(value, min, max) {
  if (!isValidDate(value)) {
    return false;
  }
  
  const date = new Date(value);
  
  if (min && isValidDate(min)) {
    const minDate = new Date(min);
    
    if (date < minDate) {
      return false;
    }
  }
  
  if (max && isValidDate(max)) {
    const maxDate = new Date(max);
    
    if (date > maxDate) {
      return false;
    }
  }
  
  return true;
}

/**
 * 评估条件
 * @param {String} condition - 条件表达式
 * @param {Object} fieldValues - 字段值
 * @returns {Boolean} 条件是否满足
 */
function evaluateCondition(condition, fieldValues) {
  try {
    let evalCondition = condition;
    
    for (const [field, value] of Object.entries(fieldValues)) {
      const regex = new RegExp(`\\b${field}\\b`, 'g');
      
      if (typeof value === 'string') {
        evalCondition = evalCondition.replace(regex, `'${value}'`);
      } else if (value === null || value === undefined) {
        evalCondition = evalCondition.replace(regex, 'null');
      } else {
        evalCondition = evalCondition.replace(regex, value);
      }
    }
    
    return Function(`'use strict'; return (${evalCondition});`)();
  } catch (error) {
    console.error('评估条件失败:', error);
    return false;
  }
}

module.exports = {
  validateForm,
  validateField
};
