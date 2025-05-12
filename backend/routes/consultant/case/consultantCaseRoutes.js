/**
 * 顾问案例管理路由
 * 定义案例管理相关的API端点
 */

const express = require('express');
const { verifyToken, checkRole } = require('../../../middleware/authMiddleware');
const consultantCaseController = require('../../../controllers/consultant/case/consultantCaseController');
const { body } = require('express-validator');

const router = express.Router();

router.use(verifyToken);

router.get('/:consultantId/cases', consultantCaseController.getConsultantCases);

router.get('/:consultantId/cases/stats', consultantCaseController.getCaseStats);

router.get('/:consultantId/cases/deadlines', consultantCaseController.getUpcomingDeadlines);

router.get('/:consultantId/cases/search', consultantCaseController.searchCases);

router.post(
  '/:consultantId/cases',
  [
    body('title').notEmpty().withMessage('案例标题不能为空'),
    body('clientId').notEmpty().withMessage('客户ID不能为空'),
    body('type').notEmpty().withMessage('案例类型不能为空')
  ],
  consultantCaseController.createCase
);

router.get('/cases/:caseId', consultantCaseController.getCaseById);

router.patch('/cases/:caseId', consultantCaseController.updateCase);

router.delete('/cases/:caseId', consultantCaseController.deleteCase);

router.patch('/cases/:caseId/progress', consultantCaseController.updateCaseProgress);

router.get('/cases/:caseId/tasks', consultantCaseController.getCaseTasks);

router.post(
  '/cases/:caseId/tasks',
  [
    body('title').notEmpty().withMessage('任务标题不能为空')
  ],
  consultantCaseController.createCaseTask
);

router.patch('/tasks/:taskId', consultantCaseController.updateCaseTask);

router.delete('/tasks/:taskId', consultantCaseController.deleteCaseTask);

router.get('/cases/:caseId/notes', consultantCaseController.getCaseNotes);

router.post(
  '/cases/:caseId/notes',
  [
    body('content').notEmpty().withMessage('笔记内容不能为空')
  ],
  consultantCaseController.createCaseNote
);

router.patch('/notes/:noteId', consultantCaseController.updateCaseNote);

router.delete('/notes/:noteId', consultantCaseController.deleteCaseNote);

router.get('/cases/:caseId/documents', consultantCaseController.getCaseDocuments);

router.post(
  '/cases/:caseId/documents',
  [
    body('name').notEmpty().withMessage('文档名称不能为空'),
    body('url').notEmpty().withMessage('文档URL不能为空'),
    body('size').isNumeric().withMessage('文档大小必须是数字'),
    body('type').notEmpty().withMessage('文档类型不能为空')
  ],
  consultantCaseController.uploadCaseDocument
);

router.patch('/documents/:documentId', consultantCaseController.updateCaseDocument);

router.delete('/documents/:documentId', consultantCaseController.deleteCaseDocument);

router.get('/cases/:caseId/timeline', consultantCaseController.getCaseTimeline);

router.post(
  '/cases/:caseId/milestones',
  [
    body('description').notEmpty().withMessage('里程碑描述不能为空')
  ],
  consultantCaseController.addMilestoneEvent
);

router.post(
  '/cases/:caseId/applications',
  [
    body('description').notEmpty().withMessage('申请描述不能为空')
  ],
  consultantCaseController.addApplicationEvent
);

router.post(
  '/cases/:caseId/decisions',
  [
    body('decision').notEmpty().withMessage('决定结果不能为空'),
    body('description').notEmpty().withMessage('决定描述不能为空')
  ],
  consultantCaseController.addDecisionEvent
);

router.get('/clients/:clientId/cases', consultantCaseController.getClientCases);

module.exports = router;
