/**
 * Profile routes
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const localeMiddleware = require('../middleware/localeMiddleware');

router.use(localeMiddleware);
router.use(authMiddleware); // All profile routes require authentication

/**
 * @route GET /profile/:userId
 * @desc Get user profile
 * @access Private
 */
router.get('/:userId', profileController.getProfile);

/**
 * @route GET /profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/', profileController.getProfile);

/**
 * @route PATCH /profile/:userId
 * @desc Update entire profile
 * @access Private
 */
router.patch(
  '/:userId',
  [
    body('personalInfo').optional().isObject(),
    body('educationInfo').optional().isArray(),
    body('workExperience').optional().isArray(),
    body('languageSkills').optional().isArray(),
    body('immigrationInfo').optional().isObject()
  ],
  profileController.updateProfile
);

/**
 * @route PATCH /profile
 * @desc Update current user's profile
 * @access Private
 */
router.patch(
  '/',
  [
    body('personalInfo').optional().isObject(),
    body('educationInfo').optional().isArray(),
    body('workExperience').optional().isArray(),
    body('languageSkills').optional().isArray(),
    body('immigrationInfo').optional().isObject()
  ],
  profileController.updateProfile
);

/**
 * @route PATCH /profile/:userId/personal-info
 * @desc Update personal information
 * @access Private
 */
router.patch(
  '/:userId/personal-info',
  [
    body('firstName').optional().isString().trim(),
    body('lastName').optional().isString().trim(),
    body('dateOfBirth').optional().isISO8601(),
    body('nationality').optional().isString().trim(),
    body('countryOfResidence').optional().isString().trim(),
    body('address').optional().isObject(),
    body('phone').optional().isString().trim()
  ],
  profileController.updatePersonalInfo
);

/**
 * @route PATCH /profile/personal-info
 * @desc Update current user's personal information
 * @access Private
 */
router.patch(
  '/personal-info',
  [
    body('firstName').optional().isString().trim(),
    body('lastName').optional().isString().trim(),
    body('dateOfBirth').optional().isISO8601(),
    body('nationality').optional().isString().trim(),
    body('countryOfResidence').optional().isString().trim(),
    body('address').optional().isObject(),
    body('phone').optional().isString().trim()
  ],
  profileController.updatePersonalInfo
);

/**
 * @route PATCH /profile/:userId/education-info
 * @desc Update education information
 * @access Private
 */
router.patch(
  '/:userId/education-info',
  [
    body().isArray(),
    body('*.highestDegree').optional().isString().trim(),
    body('*.institution').optional().isString().trim(),
    body('*.graduationYear').optional().isInt(),
    body('*.fieldOfStudy').optional().isString().trim(),
    body('*.country').optional().isString().trim(),
    body('*.completed').optional().isBoolean()
  ],
  profileController.updateEducationInfo
);

/**
 * @route PATCH /profile/education-info
 * @desc Update current user's education information
 * @access Private
 */
router.patch(
  '/education-info',
  [
    body().isArray(),
    body('*.highestDegree').optional().isString().trim(),
    body('*.institution').optional().isString().trim(),
    body('*.graduationYear').optional().isInt(),
    body('*.fieldOfStudy').optional().isString().trim(),
    body('*.country').optional().isString().trim(),
    body('*.completed').optional().isBoolean()
  ],
  profileController.updateEducationInfo
);

/**
 * @route PATCH /profile/:userId/work-experience
 * @desc Update work experience
 * @access Private
 */
router.patch(
  '/:userId/work-experience',
  [
    body().isArray(),
    body('*.company').optional().isString().trim(),
    body('*.position').optional().isString().trim(),
    body('*.startDate').optional().isISO8601(),
    body('*.endDate').optional().isISO8601(),
    body('*.isCurrentJob').optional().isBoolean(),
    body('*.description').optional().isString().trim(),
    body('*.country').optional().isString().trim(),
    body('*.nocCode').optional().isString().trim()
  ],
  profileController.updateWorkExperience
);

/**
 * @route PATCH /profile/work-experience
 * @desc Update current user's work experience
 * @access Private
 */
router.patch(
  '/work-experience',
  [
    body().isArray(),
    body('*.company').optional().isString().trim(),
    body('*.position').optional().isString().trim(),
    body('*.startDate').optional().isISO8601(),
    body('*.endDate').optional().isISO8601(),
    body('*.isCurrentJob').optional().isBoolean(),
    body('*.description').optional().isString().trim(),
    body('*.country').optional().isString().trim(),
    body('*.nocCode').optional().isString().trim()
  ],
  profileController.updateWorkExperience
);

/**
 * @route PATCH /profile/:userId/language-skills
 * @desc Update language skills
 * @access Private
 */
router.patch(
  '/:userId/language-skills',
  [
    body().isArray(),
    body('*.language').optional().isString().trim(),
    body('*.proficiencyLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'native']),
    body('*.readingScore').optional().isInt({ min: 0, max: 12 }),
    body('*.writingScore').optional().isInt({ min: 0, max: 12 }),
    body('*.speakingScore').optional().isInt({ min: 0, max: 12 }),
    body('*.listeningScore').optional().isInt({ min: 0, max: 12 }),
    body('*.testType').optional().isIn(['ielts', 'celpip', 'tef', 'tcf', 'other']),
    body('*.testDate').optional().isISO8601()
  ],
  profileController.updateLanguageSkills
);

/**
 * @route PATCH /profile/language-skills
 * @desc Update current user's language skills
 * @access Private
 */
router.patch(
  '/language-skills',
  [
    body().isArray(),
    body('*.language').optional().isString().trim(),
    body('*.proficiencyLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'native']),
    body('*.readingScore').optional().isInt({ min: 0, max: 12 }),
    body('*.writingScore').optional().isInt({ min: 0, max: 12 }),
    body('*.speakingScore').optional().isInt({ min: 0, max: 12 }),
    body('*.listeningScore').optional().isInt({ min: 0, max: 12 }),
    body('*.testType').optional().isIn(['ielts', 'celpip', 'tef', 'tcf', 'other']),
    body('*.testDate').optional().isISO8601()
  ],
  profileController.updateLanguageSkills
);

/**
 * @route PATCH /profile/:userId/immigration-info
 * @desc Update immigration information
 * @access Private
 */
router.patch(
  '/:userId/immigration-info',
  [
    body('interestedPrograms').optional().isArray(),
    body('preferredDestination').optional().isString().trim(),
    body('immigrationStatus').optional().isIn(['citizen', 'permanent_resident', 'work_permit', 'study_permit', 'visitor', 'none']),
    body('previousApplications').optional().isArray()
  ],
  profileController.updateImmigrationInfo
);

/**
 * @route PATCH /profile/immigration-info
 * @desc Update current user's immigration information
 * @access Private
 */
router.patch(
  '/immigration-info',
  [
    body('interestedPrograms').optional().isArray(),
    body('preferredDestination').optional().isString().trim(),
    body('immigrationStatus').optional().isIn(['citizen', 'permanent_resident', 'work_permit', 'study_permit', 'visitor', 'none']),
    body('previousApplications').optional().isArray()
  ],
  profileController.updateImmigrationInfo
);

/**
 * @route GET /profile/:userId/completion
 * @desc Get profile completion status
 * @access Private
 */
router.get('/:userId/completion', profileController.getCompletionStatus);

/**
 * @route GET /profile/completion
 * @desc Get current user's profile completion status
 * @access Private
 */
router.get('/completion', profileController.getCompletionStatus);

module.exports = router;
