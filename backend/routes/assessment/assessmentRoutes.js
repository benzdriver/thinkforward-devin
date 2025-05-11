/**
 * Assessment routes
 */
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const assessmentController = require('../../controllers/assessment/assessmentController');
const authMiddleware = require('../../middleware/authMiddleware');
const localeMiddleware = require('../../middleware/localeMiddleware');

router.use(localeMiddleware);

/**
 * @route GET /assessment/types
 * @desc Get assessment types
 * @access Public
 */
router.get('/types', assessmentController.getAssessmentTypes);

/**
 * @route POST /assessment/start
 * @desc Start a new assessment
 * @access Private
 */
router.post(
  '/start',
  authMiddleware,
  [
    body('type').isIn(['comprehensive', 'express', 'targeted']).withMessage('Invalid assessment type'),
    body('metadata').optional().isObject()
  ],
  assessmentController.startAssessment
);

/**
 * @route GET /assessment/:id/questions/:step
 * @desc Get assessment question
 * @access Private
 */
router.get(
  '/:id/questions/:step',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid assessment ID'),
    param('step').isInt({ min: 1 }).withMessage('Step must be a positive integer')
  ],
  assessmentController.getQuestion
);

/**
 * @route POST /assessment/:id/responses
 * @desc Submit response to assessment question
 * @access Private
 */
router.post(
  '/:id/responses',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid assessment ID'),
    body('questionId').isMongoId().withMessage('Invalid question ID'),
    body('response').exists().withMessage('Response is required')
  ],
  assessmentController.submitResponse
);

/**
 * @route GET /assessment/:id/progress
 * @desc Get assessment progress
 * @access Private
 */
router.get(
  '/:id/progress',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid assessment ID')
  ],
  assessmentController.getProgress
);

/**
 * @route GET /assessment/:id/result
 * @desc Get assessment result
 * @access Private
 */
router.get(
  '/:id/result',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid assessment ID')
  ],
  assessmentController.getResult
);

/**
 * @route GET /assessment/user/:userId
 * @desc Get user's assessments
 * @access Private
 */
router.get(
  '/user/:userId',
  authMiddleware,
  [
    param('userId').isMongoId().withMessage('Invalid user ID')
  ],
  assessmentController.listUserAssessments
);

/**
 * @route GET /assessment/user
 * @desc Get current user's assessments
 * @access Private
 */
router.get(
  '/user',
  authMiddleware,
  assessmentController.listUserAssessments
);

module.exports = router;
