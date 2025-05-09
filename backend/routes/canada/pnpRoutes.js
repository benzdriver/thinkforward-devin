/**
 * Provincial Nominee Program (PNP) Routes
 * Defines API endpoints for PNP-related operations
 */

const express = require('express');
const router = express.Router();
const pnpController = require('../../controllers/canada/pnpController');
const { body, param } = require('express-validator');
const authMiddleware = require('../../middleware/authMiddleware');

/**
 * @route POST /api/canada/pnp/check-eligibility
 * @desc Check eligibility for Provincial Nominee Programs
 * @access Public
 */
router.post('/check-eligibility', [
  body('province').notEmpty().withMessage('Province is required'),
  body('profile').isObject().withMessage('Profile data is required')
], pnpController.checkEligibility);

/**
 * @route POST /api/canada/pnp/find-programs
 * @desc Find PNP programs matching the profile
 * @access Public
 */
router.post('/find-programs', [
  body('province').notEmpty().withMessage('Province is required'),
  body('profile').isObject().withMessage('Profile data is required')
], pnpController.findPrograms);

/**
 * @route GET /api/canada/pnp/program/:province/:streamName
 * @desc Get PNP program details
 * @access Public
 */
router.get('/program/:province/:streamName', [
  param('province').notEmpty().withMessage('Province is required'),
  param('streamName').notEmpty().withMessage('Stream name is required')
], pnpController.getProgramDetails);

/**
 * @route GET /api/canada/pnp/draws/:province
 * @desc Get latest PNP draws for a province
 * @access Public
 */
router.get('/draws/:province', [
  param('province').notEmpty().withMessage('Province is required')
], pnpController.getLatestDraws);

/**
 * @route POST /api/canada/pnp/application
 * @desc Save PNP application
 * @access Private
 */
router.post('/application', authMiddleware, [
  body('province').notEmpty().withMessage('Province is required'),
  body('stream').notEmpty().withMessage('Stream is required'),
  body('profile').isObject().withMessage('Profile data is required')
], pnpController.saveApplication);

/**
 * @route GET /api/canada/pnp/applications
 * @desc Get user's PNP applications
 * @access Private
 */
router.get('/applications', authMiddleware, pnpController.getUserApplications);

module.exports = router;
