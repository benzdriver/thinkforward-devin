const express = require('express');
const router = express.Router();
const expressEntryController = require('../../controllers/canada/expressEntryController');

/**
 * @route POST /api/canada/express-entry/calculate-score
 * @desc Calculate Express Entry points
 * @access Public
 */
router.post(
  '/calculate-score',
  expressEntryController.calculatePoints
);

/**
 * @route POST /api/canada/express-entry/check-eligibility
 * @desc Check eligibility for Express Entry
 * @access Public
 */
router.post(
  '/check-eligibility',
  expressEntryController.checkEligibility
);

/**
 * @route GET /api/canada/express-entry/latest-draws
 * @desc Get latest Express Entry draws
 * @access Public
 */
router.get('/latest-draws', expressEntryController.getLatestDraws);

module.exports = router;
