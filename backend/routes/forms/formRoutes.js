/**
 * 表格路由
 * 定义表格相关的API端点
 */

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const formController = require('../../controllers/forms/formController');

const router = express.Router();

router.get('/types', formController.getFormTypes);

router.get('/:userId', verifyToken, formController.getUserForms);

router.get('/:userId/:formId', verifyToken, formController.getForm);

router.post('/:userId/generate', verifyToken, formController.generateForm);

router.put('/:userId/:formId', verifyToken, formController.updateForm);

router.patch('/:userId/:formId/field', verifyToken, formController.updateFormField);

router.get('/:userId/:formId/download', verifyToken, formController.getFormDownload);

module.exports = router;
