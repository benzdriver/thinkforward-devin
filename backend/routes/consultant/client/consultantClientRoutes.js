/**
 * 顾问客户管理路由
 * 定义顾问客户管理相关的API端点
 */

const express = require('express');
const { verifyToken, checkRole } = require('../../../middleware/authMiddleware');
const consultantClientController = require('../../../controllers/consultant/client/consultantClientController');
const { body } = require('express-validator');

const router = express.Router();

router.use(verifyToken);

router.get('/:consultantId/clients', consultantClientController.getClients);

router.get('/:consultantId/clients/stats', consultantClientController.getClientStats);

router.get('/:consultantId/clients/:clientId', consultantClientController.getClientById);

router.post(
  '/:consultantId/clients',
  [
    body('firstName').notEmpty().withMessage('名字不能为空'),
    body('lastName').notEmpty().withMessage('姓氏不能为空'),
    body('email').isEmail().withMessage('邮箱格式不正确')
  ],
  consultantClientController.createClient
);

router.patch(
  '/:consultantId/clients/:clientId',
  consultantClientController.updateClient
);

router.delete('/:consultantId/clients/:clientId', consultantClientController.deleteClient);

router.post(
  '/:consultantId/clients/:clientId/tags',
  [
    body('tag').notEmpty().withMessage('标签不能为空')
  ],
  consultantClientController.addClientTag
);

router.delete('/:consultantId/clients/:clientId/tags/:tag', consultantClientController.removeClientTag);

router.post(
  '/:consultantId/clients/:clientId/notes',
  [
    body('content').notEmpty().withMessage('笔记内容不能为空')
  ],
  consultantClientController.addClientNote
);

router.get('/:consultantId/clients/:clientId/notes', consultantClientController.getClientNotes);

router.get('/:consultantId/clients/:clientId/activities', consultantClientController.getClientActivities);

router.get('/:consultantId/clients/search', consultantClientController.searchClients);

router.get('/:consultantId/tags', consultantClientController.getConsultantTags);

router.get('/:consultantId/clients/by-tag', consultantClientController.findClientsByTag);

module.exports = router;
