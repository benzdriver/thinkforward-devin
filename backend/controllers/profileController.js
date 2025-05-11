/**
 * Profile controller for handling profile-related requests
 */
const { validationResult } = require('express-validator');
const profileService = require('../services/profileService');
const { translateError } = require('../utils/errorHandler');

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access this profile'), locale).message
      });
    }
    
    const profile = await profileService.fetchProfile(userId, locale);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: translateError(new Error('Profile not found'), locale).message
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching profile'
    });
  }
};

/**
 * Update entire profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update this profile'), locale).message
      });
    }
    
    const profileData = req.body;
    
    const updatedProfile = await profileService.saveProfile(userId, profileData, locale);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating profile'
    });
  }
};

/**
 * Update personal information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updatePersonalInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update this profile'), locale).message
      });
    }
    
    const personalInfo = req.body;
    
    const updatedProfile = await profileService.updatePersonalInfo(userId, personalInfo, locale);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update personal info error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating personal information'
    });
  }
};

/**
 * Update education information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateEducationInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update this profile'), locale).message
      });
    }
    
    const educationInfo = req.body;
    
    const updatedProfile = await profileService.updateEducationInfo(userId, educationInfo, locale);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update education info error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating education information'
    });
  }
};

/**
 * Update work experience
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateWorkExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update this profile'), locale).message
      });
    }
    
    const workExperience = req.body;
    
    const updatedProfile = await profileService.updateWorkExperience(userId, workExperience, locale);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update work experience error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating work experience'
    });
  }
};

/**
 * Update language skills
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateLanguageSkills = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update this profile'), locale).message
      });
    }
    
    const languageSkills = req.body;
    
    const updatedProfile = await profileService.updateLanguageSkills(userId, languageSkills, locale);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update language skills error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating language skills'
    });
  }
};

/**
 * Update immigration information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateImmigrationInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to update this profile'), locale).message
      });
    }
    
    const immigrationInfo = req.body;
    
    const updatedProfile = await profileService.updateImmigrationInfo(userId, immigrationInfo, locale);
    
    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update immigration info error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating immigration information'
    });
  }
};

/**
 * Get profile completion status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCompletionStatus = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access this profile'), locale).message
      });
    }
    
    const completionStatus = await profileService.getCompletionStatus(userId, locale);
    
    res.status(200).json({
      success: true,
      data: completionStatus
    });
  } catch (error) {
    console.error('Get completion status error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching completion status'
    });
  }
};
