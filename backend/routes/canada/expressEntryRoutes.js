const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const expressEntryController = require('../../controllers/canada/expressEntryController');
const authMiddleware = require('../../middleware/authMiddleware');
const localeMiddleware = require('../../middleware/localeMiddleware');

router.use(localeMiddleware);

/**
 * @route POST /api/canada/express-entry/calculate-score
 * @desc Calculate Express Entry points
 * @access Public
 */
router.post(
  '/calculate-score',
  [
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    body('educationLevel').isString().notEmpty().withMessage('Education level is required'),
    body('languageProficiency').isArray().notEmpty().withMessage('Language proficiency is required'),
  ],
  expressEntryController.calculatePoints
);

/**
 * @route POST /api/canada/express-entry/check-eligibility
 * @desc Check eligibility for Express Entry
 * @access Public
 */
router.post(
  '/check-eligibility',
  [
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    body('educationLevel').isString().notEmpty().withMessage('Education level is required'),
    body('languageProficiency').isArray().notEmpty().withMessage('Language proficiency is required'),
  ],
  expressEntryController.checkEligibility
);

/**
 * @route GET /api/canada/express-entry/latest-draws
 * @desc Get latest Express Entry draws
 * @access Public
 */
router.get('/latest-draws', expressEntryController.getLatestDraws);

/**
 * @route POST /api/canada/express-entry/profile
 * @desc Create or update Express Entry profile
 * @access Private
 */
router.post(
  '/profile',
  authMiddleware,
  [
    body('age').isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    body('maritalStatus').isString().notEmpty().withMessage('Marital status is required'),
    body('languageProficiency').isArray().notEmpty().withMessage('Language proficiency is required'),
    body('education').isArray().notEmpty().withMessage('Education is required'),
  ],
  expressEntryController.saveProfile
);

/**
 * @route GET /api/canada/express-entry/profile
 * @desc Get user's Express Entry profile
 * @access Private
 */
router.get('/profile', authMiddleware, expressEntryController.getProfile);

/**
 * @route POST /api/canada/express-entry/quick-estimate
 * @desc Get quick estimate of CRS score
 * @access Public
 */
router.post(
  '/quick-estimate',
  [
    body('age').isString().notEmpty().withMessage('Age range is required'),
    body('education').isString().notEmpty().withMessage('Education level is required'),
    body('languageProficiency').isString().notEmpty().withMessage('Language proficiency is required'),
    body('canadianWorkExperience').isString().withMessage('Canadian work experience is required'),
  ],
  expressEntryController.getQuickEstimate
);

module.exports = router;
