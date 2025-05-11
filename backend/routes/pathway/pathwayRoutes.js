/**
 * Pathway routes
 */
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const pathwayController = require('../../controllers/pathway/pathwayController');
const authMiddleware = require('../../middleware/authMiddleware');
const localeMiddleware = require('../../middleware/localeMiddleware');

router.use(localeMiddleware);

/**
 * @route GET /pathway
 * @desc Get all pathways
 * @access Public
 */
router.get('/', pathwayController.getAllPathways);

/**
 * @route GET /pathway/categories
 * @desc Get pathway categories
 * @access Public
 */
router.get('/categories', pathwayController.getPathwayCategories);

/**
 * @route GET /pathway/countries
 * @desc Get pathway countries
 * @access Public
 */
router.get('/countries', pathwayController.getPathwayCountries);

/**
 * @route GET /pathway/id/:id
 * @desc Get pathway by ID
 * @access Public
 */
router.get(
  '/id/:id',
  [
    param('id').isMongoId().withMessage('Invalid pathway ID')
  ],
  pathwayController.getPathwayById
);

/**
 * @route GET /pathway/code/:code
 * @desc Get pathway by code
 * @access Public
 */
router.get(
  '/code/:code',
  [
    param('code').isString().trim().notEmpty().withMessage('Invalid pathway code')
  ],
  pathwayController.getPathwayByCode
);

/**
 * @route POST /pathway/eligibility/:id
 * @desc Check pathway eligibility
 * @access Private
 */
router.post(
  '/eligibility/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid pathway ID'),
    body('profileData').optional().isObject()
  ],
  pathwayController.checkEligibility
);

/**
 * @route POST /pathway/recommendations
 * @desc Get recommended pathways
 * @access Private
 */
router.post(
  '/recommendations',
  authMiddleware,
  [
    body('profileData').optional().isObject()
  ],
  pathwayController.getRecommendedPathways
);

/**
 * @route POST /pathway
 * @desc Create a new pathway (admin only)
 * @access Private/Admin
 */
router.post(
  '/',
  authMiddleware,
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('code').isString().trim().notEmpty().withMessage('Code is required'),
    body('country').isString().trim().notEmpty().withMessage('Country is required'),
    body('category').isIn(['federal', 'provincial', 'regional', 'business', 'family', 'humanitarian', 'other']).withMessage('Invalid category'),
    body('description').isString().trim().notEmpty().withMessage('Description is required'),
    body('eligibilityCriteria').isArray().withMessage('Eligibility criteria must be an array'),
    body('processingTime').isObject().withMessage('Processing time must be an object'),
    body('applicationFee').isObject().withMessage('Application fee must be an object'),
    body('requiredDocuments').isArray().withMessage('Required documents must be an array'),
    body('steps').isArray().withMessage('Steps must be an array'),
    body('officialLink').isURL().withMessage('Official link must be a valid URL')
  ],
  pathwayController.createPathway
);

/**
 * @route PUT /pathway/:id
 * @desc Update pathway (admin only)
 * @access Private/Admin
 */
router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid pathway ID'),
    body('name').optional().isString().trim().notEmpty().withMessage('Name is required'),
    body('code').optional().isString().trim().notEmpty().withMessage('Code is required'),
    body('country').optional().isString().trim().notEmpty().withMessage('Country is required'),
    body('category').optional().isIn(['federal', 'provincial', 'regional', 'business', 'family', 'humanitarian', 'other']).withMessage('Invalid category'),
    body('description').optional().isString().trim().notEmpty().withMessage('Description is required'),
    body('eligibilityCriteria').optional().isArray().withMessage('Eligibility criteria must be an array'),
    body('processingTime').optional().isObject().withMessage('Processing time must be an object'),
    body('applicationFee').optional().isObject().withMessage('Application fee must be an object'),
    body('requiredDocuments').optional().isArray().withMessage('Required documents must be an array'),
    body('steps').optional().isArray().withMessage('Steps must be an array'),
    body('officialLink').optional().isURL().withMessage('Official link must be a valid URL')
  ],
  pathwayController.updatePathway
);

/**
 * @route DELETE /pathway/:id
 * @desc Delete pathway (admin only)
 * @access Private/Admin
 */
router.delete(
  '/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid pathway ID')
  ],
  pathwayController.deletePathway
);

module.exports = router;
