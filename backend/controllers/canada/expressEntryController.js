/**
 * Express Entry Controller
 * Handles API requests related to Express Entry immigration program
 */

const expressEntryService = require('../../services/canada/expressEntryService');

/**
 * Calculate Express Entry points based on profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.calculatePoints = async (req, res) => {
  try {
    const profile = req.body;
    const score = await expressEntryService.calculatePoints(profile);
    
    return res.status(200).json({
      success: true,
      score,
      breakdown: expressEntryService.getPointsBreakdown(profile)
    });
  } catch (error) {
    console.error('Error calculating Express Entry points:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
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
    return res.status(500).json({ 
      success: false, 
      message: error.message 
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
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
