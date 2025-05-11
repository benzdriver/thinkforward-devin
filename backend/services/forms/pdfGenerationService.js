/**
 * PDF生成服务
 * 提供表格数据转换为PDF文件的功能
 */

const fs = require('fs').promises;
const path = require('path');
const FormType = require('../../models/forms/FormType');
const FormTemplate = require('../../models/forms/FormTemplate');


/**
 * 生成PDF文件
 * @param {String} formType - 表格类型
 * @param {Object} formData - 表格数据
 * @returns {Promise<Buffer>} PDF文件Buffer
 */
async function generatePdf(formType, formData) {
  try {
    const formTypeDetails = await FormType.findOne({ id: formType, isActive: true });
    
    if (!formTypeDetails) {
      throw new Error('表格类型不存在');
    }
    
    const formTemplate = await FormTemplate.findByTemplateId(formTypeDetails.templateId);
    
    if (!formTemplate) {
      throw new Error('表格模板不存在');
    }
    
    const pdfTemplate = formTemplate.pdfTemplate;
    
    console.log(`生成表格 ${formType} 的PDF文件`);
    console.log('使用模板:', pdfTemplate);
    console.log('表格数据:', JSON.stringify(formData, null, 2));
    
    return Buffer.from('模拟PDF文件内容');
  } catch (error) {
    console.error('生成PDF失败:', error);
    throw new Error('生成PDF失败');
  }
}

/**
 * 保存PDF文件并返回URL
 * @param {String} userId - 用户ID
 * @param {String} formId - 表格ID
 * @param {Buffer} pdfBuffer - PDF文件Buffer
 * @returns {Promise<String>} PDF文件URL
 */
async function savePdfAndGetUrl(userId, formId, pdfBuffer) {
  try {
    const uploadDir = path.join(__dirname, '../../uploads/forms');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const fileName = `form_${formId}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    
    await fs.writeFile(filePath, pdfBuffer);
    
    return `/api/forms/${userId}/${formId}/download/${fileName}`;
  } catch (error) {
    console.error('保存PDF文件失败:', error);
    throw new Error('保存PDF文件失败');
  }
}

module.exports = {
  generatePdf,
  savePdfAndGetUrl
};
