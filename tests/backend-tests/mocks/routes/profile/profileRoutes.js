/**
 * Mock profileRoutes for testing
 */
const express = require('express');
const router = express.Router();
const profileController = require('../../../mocks/controllers/profileController');
const { verifyToken } = require('../../../mocks/middleware/authMiddleware');

router.get('/', verifyToken, profileController.getProfile);
router.get('/:userId', verifyToken, profileController.getProfile);
router.put('/', verifyToken, profileController.updateProfile);
router.put('/:userId', verifyToken, profileController.updateProfile);

router.get('/completion', verifyToken, profileController.getCompletionStatus);
router.get('/:userId/completion', verifyToken, profileController.getCompletionStatus);

router.put('/personal-info', verifyToken, profileController.updatePersonalInfo);
router.put('/:userId/personal-info', verifyToken, profileController.updatePersonalInfo);
router.put('/education', verifyToken, profileController.updateEducation);
router.put('/:userId/education', verifyToken, profileController.updateEducation);
router.put('/work-experience', verifyToken, profileController.updateWorkExperience);
router.put('/:userId/work-experience', verifyToken, profileController.updateWorkExperience);
router.put('/language-skills', verifyToken, profileController.updateLanguageSkills);
router.put('/:userId/language-skills', verifyToken, profileController.updateLanguageSkills);
router.put('/immigration-info', verifyToken, profileController.updateImmigrationInfo);
router.put('/:userId/immigration-info', verifyToken, profileController.updateImmigrationInfo);

module.exports = router;
