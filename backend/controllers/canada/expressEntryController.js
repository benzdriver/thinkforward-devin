const expressEntryService = require('../../services/canada/expressEntryService');
const { validationResult } = require('express-validator');
const { translateError } = require('../../utils/errorHandler');

/**
 * Calculate Express Entry points based on profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.calculatePoints = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const profile = req.body;
    const score = await expressEntryService.calculatePoints(profile);
    
    return res.status(200).json({
      success: true,
      score,
      breakdown: expressEntryService.getPointsBreakdown(profile)
    });
  } catch (error) {
    console.error('Error calculating Express Entry points:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Check eligibility for Express Entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkEligibility = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const profile = req.body;
    const eligibility = await expressEntryService.checkEligibility(profile);
    
    return res.status(200).json({
      success: true,
      isEligible: eligibility.isEligible,
      programs: eligibility.eligiblePrograms,
      reasons: eligibility.reasons
    });
  } catch (error) {
    console.error('Error checking Express Entry eligibility:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Get current Express Entry draw information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLatestDraws = async (req, res) => {
  try {
    const draws = await expressEntryService.getLatestDraws();
    
    return res.status(200).json({
      success: true,
      draws
    });
  } catch (error) {
    console.error('Error fetching Express Entry draws:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Create or update Express Entry profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.saveProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const userId = req.user.id;
    const profileData = req.body;
    
    const profile = await expressEntryService.saveProfile(userId, profileData);
    
    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error saving Express Entry profile:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Get user's Express Entry profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await expressEntryService.getProfile(userId);
    
    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching Express Entry profile:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};

/**
 * Get quick estimate of CRS score based on basic information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getQuickEstimate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const basicInfo = req.body;
    const score = await expressEntryService.getQuickEstimate(basicInfo);
    
    return res.status(200).json({
      success: true,
      score
    });
  } catch (error) {
    console.error('Error calculating quick estimate:', error);
    const translatedError = translateError(error, req.locale || 'en');
    return res.status(500).json({ 
      success: false, 
      message: translatedError.message 
    });
  }
};
