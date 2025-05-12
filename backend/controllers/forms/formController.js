/**
 * 表格控制器
 * 处理表格相关的HTTP请求
 */

const formService = require('../../services/forms/formService');
const { translateMessage } = require('../../utils/localization');

/**
 * 获取表格类型列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getFormTypes(req, res, next) {
  try {
    const { country, category } = req.query;
    const locale = req.locale || 'en';
    
    const formTypes = await formService.getFormTypes({ country, category }, locale);
    
    res.status(200).json({
      success: true,
      data: formTypes
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户表格列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getUserForms(req, res, next) {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const forms = await formService.getUserForms(userId);
    
    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取特定表格
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getForm(req, res, next) {
  try {
    const { userId, formId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const form = await formService.getFormById(userId, formId);
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 生成新表格
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function generateForm(req, res, next) {
  try {
    const { userId } = req.params;
    const { formType, generatePdf } = req.body;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    if (!formType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingFormType', req.locale)
        }
      });
    }
    
    const form = await formService.generateForm(userId, formType, { generatePdf });
    
    res.status(201).json({
      success: true,
      data: form
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新表格
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function updateForm(req, res, next) {
  try {
    const { userId, formId } = req.params;
    const { formData } = req.body;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    if (!formData) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingFormData', req.locale)
        }
      });
    }
    
    const updatedForm = await formService.updateForm(userId, formId, formData);
    
    res.status(200).json({
      success: true,
      data: updatedForm
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新表格字段
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function updateFormField(req, res, next) {
  try {
    const { userId, formId } = req.params;
    const { fieldPath, value } = req.body;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    if (!fieldPath) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingFieldPath', req.locale)
        }
      });
    }
    
    const result = await formService.updateFormField(userId, formId, fieldPath, value);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取表格下载链接
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getFormDownload(req, res, next) {
  try {
    const { userId, formId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const result = await formService.getFormDownloadUrl(userId, formId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFormTypes,
  getUserForms,
  getForm,
  generateForm,
  updateForm,
  updateFormField,
  getFormDownload
};
