/**
 * 表格服务
 * 提供表格生成、更新、验证和PDF生成等核心功能
 */

const Form = require('../../models/forms/Form');
const FormType = require('../../models/forms/FormType');
const FormTemplate = require('../../models/forms/FormTemplate');
const formValidationService = require('./formValidationService');
const pdfGenerationService = require('./pdfGenerationService');
const dataMappingService = require('./dataMappingService');

/**
 * 获取所有表格类型
 * @param {Object} options - 查询选项
 * @param {String} options.country - 国家筛选
 * @param {String} options.category - 类别筛选
 * @param {String} locale - 语言代码
 * @returns {Promise<Array>} 表格类型列表
 */
async function getFormTypes(options = {}, locale = 'en') {
  try {
    const { country, category } = options;
    let query = { isActive: true };
    
    if (country) {
      query.country = country;
    }
    
    if (category) {
      query.category = category;
    }
    
    const formTypes = await FormType.find(query);
    
    return formTypes.map(formType => ({
      id: formType.id,
      name: formType.getLocalizedName(locale),
      description: formType.getLocalizedDescription(locale),
      category: formType.category,
      country: formType.country,
      metadata: formType.metadata
    }));
  } catch (error) {
    console.error('获取表格类型失败:', error);
    throw new Error('获取表格类型失败');
  }
}

/**
 * 获取用户的所有表格
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 用户表格列表
 */
async function getUserForms(userId) {
  try {
    return await Form.find({ userId }).sort({ lastUpdated: -1 });
  } catch (error) {
    console.error('获取用户表格失败:', error);
    throw new Error('获取用户表格失败');
  }
}

/**
 * 获取特定表格详情
 * @param {String} userId - 用户ID
 * @param {String} formId - 表格ID
 * @returns {Promise<Object>} 表格详情
 */
async function getFormById(userId, formId) {
  try {
    const form = await Form.findOne({ _id: formId, userId });
    
    if (!form) {
      throw new Error('表格不存在');
    }
    
    return form;
  } catch (error) {
    console.error('获取表格详情失败:', error);
    throw new Error('获取表格详情失败');
  }
}

/**
 * 生成新表格
 * @param {String} userId - 用户ID
 * @param {String} formType - 表格类型
 * @param {Object} options - 生成选项
 * @returns {Promise<Object>} 生成的表格
 */
async function generateForm(userId, formType, options = {}) {
  try {
    const formTypeDetails = await FormType.findOne({ id: formType, isActive: true });
    
    if (!formTypeDetails) {
      throw new Error('表格类型不存在');
    }
    
    const formTemplate = await FormTemplate.findByTemplateId(formTypeDetails.templateId);
    
    if (!formTemplate) {
      throw new Error('表格模板不存在');
    }
    
    const formData = await dataMappingService.mapUserDataToForm(userId, formType);
    
    const newForm = new Form({
      userId,
      formType,
      formData,
      status: 'generating'
    });
    
    await newForm.save();
    
    const validationResults = await formValidationService.validateForm(formType, formData);
    newForm.validationResults = validationResults;
    
    if (options.generatePdf) {
      try {
        const pdfBuffer = await pdfGenerationService.generatePdf(formType, formData);
        const downloadUrl = await pdfGenerationService.savePdfAndGetUrl(userId, newForm._id, pdfBuffer);
        newForm.downloadUrl = downloadUrl;
        newForm.status = 'completed';
      } catch (pdfError) {
        console.error('生成PDF失败:', pdfError);
        newForm.status = 'error';
      }
    }
    
    await newForm.save();
    
    return newForm;
  } catch (error) {
    console.error('生成表格失败:', error);
    throw new Error('生成表格失败');
  }
}

/**
 * 更新表格数据
 * @param {String} userId - 用户ID
 * @param {String} formId - 表格ID
 * @param {Object} formData - 表格数据
 * @returns {Promise<Object>} 更新后的表格
 */
async function updateForm(userId, formId, formData) {
  try {
    const form = await Form.findOne({ _id: formId, userId });
    
    if (!form) {
      throw new Error('表格不存在');
    }
    
    form.version += 1;
    
    form.formData = formData;
    
    form.clearValidationResults();
    
    const validationResults = await formValidationService.validateForm(form.formType, formData);
    form.validationResults = validationResults;
    
    form.status = 'generating';
    
    await form.save();
    
    return form;
  } catch (error) {
    console.error('更新表格失败:', error);
    throw new Error('更新表格失败');
  }
}

/**
 * 更新表格特定字段
 * @param {String} userId - 用户ID
 * @param {String} formId - 表格ID
 * @param {String} fieldPath - 字段路径
 * @param {any} value - 字段值
 * @returns {Promise<Object>} 更新结果
 */
async function updateFormField(userId, formId, fieldPath, value) {
  try {
    const form = await Form.findOne({ _id: formId, userId });
    
    if (!form) {
      throw new Error('表格不存在');
    }
    
    const formData = { ...form.formData };
    
    const pathParts = fieldPath.split('.');
    let current = formData;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    
    const fieldValidation = await formValidationService.validateField(form.formType, fieldPath, value);
    
    form.formData = formData;
    
    form.validationResults = form.validationResults.filter(result => result.fieldPath !== fieldPath);
    
    if (fieldValidation) {
      form.validationResults.push(fieldValidation);
    }
    
    await form.save();
    
    return {
      success: true,
      fieldPath,
      value,
      validation: fieldValidation
    };
  } catch (error) {
    console.error('更新表格字段失败:', error);
    throw new Error('更新表格字段失败');
  }
}

/**
 * 获取表格PDF下载链接
 * @param {String} userId - 用户ID
 * @param {String} formId - 表格ID
 * @returns {Promise<Object>} 下载链接
 */
async function getFormDownloadUrl(userId, formId) {
  try {
    const form = await Form.findOne({ _id: formId, userId });
    
    if (!form) {
      throw new Error('表格不存在');
    }
    
    if (form.downloadUrl) {
      return {
        success: true,
        downloadUrl: form.downloadUrl
      };
    }
    
    const pdfBuffer = await pdfGenerationService.generatePdf(form.formType, form.formData);
    const downloadUrl = await pdfGenerationService.savePdfAndGetUrl(userId, formId, pdfBuffer);
    
    form.downloadUrl = downloadUrl;
    form.status = 'completed';
    await form.save();
    
    return {
      success: true,
      downloadUrl
    };
  } catch (error) {
    console.error('获取表格下载链接失败:', error);
    throw new Error('获取表格下载链接失败');
  }
}

module.exports = {
  getFormTypes,
  getUserForms,
  getFormById,
  generateForm,
  updateForm,
  updateFormField,
  getFormDownloadUrl
};
