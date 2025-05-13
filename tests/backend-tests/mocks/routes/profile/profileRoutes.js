/**
 * Mock profileRoutes for testing
 * Matches the actual backend implementation
 */
const express = require('express');
const router = express.Router();
const profileController = require('../../../mocks/controllers/profileController');
const authMiddleware = require('../../../mocks/middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.get('/', profileController.getProfile);
router.get('/:userId', profileController.getProfile);

router.patch('/', profileController.updateProfile);
router.patch('/:userId', profileController.updateProfile);

router.get('/completion', profileController.getCompletionStatus);
router.get('/:userId/completion', profileController.getCompletionStatus);

router.patch('/personal-info', profileController.updatePersonalInfo);
router.patch('/:userId/personal-info', profileController.updatePersonalInfo);

router.patch('/education-info', profileController.updateEducation);
router.patch('/:userId/education-info', profileController.updateEducation);

router.patch('/work-experience', profileController.updateWorkExperience);
router.patch('/:userId/work-experience', profileController.updateWorkExperience);

router.patch('/language-skills', profileController.updateLanguageSkills);
router.patch('/:userId/language-skills', profileController.updateLanguageSkills);

router.patch('/immigration-info', profileController.updateImmigrationInfo);
router.patch('/:userId/immigration-info', profileController.updateImmigrationInfo);

module.exports = router;
