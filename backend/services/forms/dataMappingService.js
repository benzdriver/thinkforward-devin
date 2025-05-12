/**
 * 数据映射服务
 * 提供用户资料数据到表格字段的映射功能
 */

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const FormType = require('../../models/forms/FormType');
const FormTemplate = require('../../models/forms/FormTemplate');

/**
 * 将用户资料映射到表格数据
 * @param {String} userId - 用户ID
 * @param {String} formType - 表格类型
 * @returns {Promise<Object>} 映射后的表格数据
 */
async function mapUserDataToForm(userId, formType) {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      throw new Error('用户档案不存在');
    }
    
    const formTypeDetails = await FormType.findOne({ id: formType, isActive: true });
    
    if (!formTypeDetails) {
      throw new Error('表格类型不存在');
    }
    
    const formTemplate = await FormTemplate.findByTemplateId(formTypeDetails.templateId);
    
    if (!formTemplate) {
      throw new Error('表格模板不存在');
    }
    
    const fieldMappings = formTemplate.getFieldMappings();
    
    const formData = {};
    
    for (const [formField, mapping] of Object.entries(fieldMappings)) {
      const { source, path, transform } = mapping;
      
      let sourceData;
      
      switch (source) {
        case 'user':
          sourceData = user;
          break;
        
        case 'profile':
          sourceData = profile;
          break;
        
        default:
          sourceData = null;
      }
      
      if (!sourceData) {
        continue;
      }
      
      let value = getNestedValue(sourceData, path);
      
      if (transform && typeof transform === 'string') {
        value = applyTransform(value, transform);
      }
      
      setNestedValue(formData, formField, value);
    }
    
    return formData;
  } catch (error) {
    console.error('映射用户数据失败:', error);
    throw new Error('映射用户数据失败');
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
 * 设置嵌套对象的值
 * @param {Object} obj - 对象
 * @param {String} path - 路径
 * @param {any} value - 值
 */
function setNestedValue(obj, path, value) {
  const pathParts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (!current[pathParts[i]]) {
      current[pathParts[i]] = {};
    }
    
    current = current[pathParts[i]];
  }
  
  current[pathParts[pathParts.length - 1]] = value;
}

/**
 * 应用转换函数
 * @param {any} value - 值
 * @param {String} transform - 转换函数名称
 * @returns {any} 转换后的值
 */
function applyTransform(value, transform) {
  switch (transform) {
    case 'toUpperCase':
      return typeof value === 'string' ? value.toUpperCase() : value;
    
    case 'toLowerCase':
      return typeof value === 'string' ? value.toLowerCase() : value;
    
    case 'capitalize':
      return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    
    case 'formatDate':
      return formatDate(value);
    
    case 'formatPhone':
      return formatPhone(value);
    
    case 'formatPostalCode':
      return formatPostalCode(value);
    
    default:
      return value;
  }
}

/**
 * 格式化日期
 * @param {String|Date} date - 日期
 * @returns {String} 格式化后的日期
 */
function formatDate(date) {
  if (!date) {
    return '';
  }
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
}

/**
 * 格式化电话号码
 * @param {String} phone - 电话号码
 * @returns {String} 格式化后的电话号码
 */
function formatPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else {
    return phone;
  }
}

/**
 * 格式化邮政编码
 * @param {String} postalCode - 邮政编码
 * @returns {String} 格式化后的邮政编码
 */
function formatPostalCode(postalCode) {
  if (!postalCode || typeof postalCode !== 'string') {
    return '';
  }
  
  const code = postalCode.replace(/\s/g, '');
  
  if (/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(code)) {
    return `${code.slice(0, 3)} ${code.slice(3)}`.toUpperCase();
  } else {
    return postalCode;
  }
}

module.exports = {
  mapUserDataToForm
};
