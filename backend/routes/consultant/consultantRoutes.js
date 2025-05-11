/**
 * 顾问路由
 * 定义顾问相关的API端点
 */

const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const consultantController = require('../../controllers/consultant/consultantController');

const router = express.Router();

router.get('/', consultantController.getConsultants);
router.get('/filter-options', consultantController.getConsultantFilterOptions);
router.get('/:consultantId', consultantController.getConsultantById);
router.get('/:consultantId/reviews', consultantController.getConsultantReviews);
router.get('/:consultantId/availability', consultantController.getConsultantAvailability);

router.post('/:consultantId/reviews', verifyToken, consultantController.addConsultantReview);
router.post('/:userId/match', verifyToken, consultantController.matchConsultants);
router.get('/:userId/match-results', verifyToken, consultantController.getUserMatchResults);
router.put('/:consultantId/availability', verifyToken, consultantController.updateConsultantAvailability);

module.exports = router;
