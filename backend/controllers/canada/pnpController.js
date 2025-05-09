/**
 * Provincial Nominee Program (PNP) Controller
 * Handles requests related to PNP programs and eligibility
 */

const pnpService = require('../../services/canada/pnpService');
const { validationResult } = require('express-validator');
const logger = require('../../common/logger/LoggerService');

/**
 * Check eligibility for Provincial Nominee Programs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkEligibility = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { province, profile } = req.body;
    
    if (!province) {
      return res.status(400).json({ message: 'Province is required' });
    }

    logger.info(`Checking PNP eligibility for province: ${province}`);
    
    const eligibilityResult = await pnpService.checkEligibility(province, profile);
    
    return res.status(200).json(eligibilityResult);
  } catch (error) {
    logger.error(`Error checking PNP eligibility: ${error.message}`);
    return res.status(500).json({ message: 'Error checking eligibility', error: error.message });
  }
};

/**
 * Find PNP programs matching the profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.findPrograms = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { province, profile } = req.body;
    
    if (!province) {
      return res.status(400).json({ message: 'Province is required' });
    }

    logger.info(`Finding PNP programs for province: ${province}`);
    
    const programs = await pnpService.findPrograms(province, profile);
    
    return res.status(200).json(programs);
  } catch (error) {
    logger.error(`Error finding PNP programs: ${error.message}`);
    return res.status(500).json({ message: 'Error finding programs', error: error.message });
  }
};

/**
 * Get PNP program details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProgramDetails = async (req, res) => {
  try {
    const { province, streamName } = req.params;
    
    if (!province || !streamName) {
      return res.status(400).json({ message: 'Province and stream name are required' });
    }

    logger.info(`Getting PNP program details for province: ${province}, stream: ${streamName}`);
    
    const programDetails = await pnpService.getProgramDetails(province, streamName);
    
    if (!programDetails) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    return res.status(200).json(programDetails);
  } catch (error) {
    logger.error(`Error getting PNP program details: ${error.message}`);
    return res.status(500).json({ message: 'Error getting program details', error: error.message });
  }
};

/**
 * Get latest PNP draws for a province
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLatestDraws = async (req, res) => {
  try {
    const { province } = req.params;
    const { limit = 5 } = req.query;
    
    logger.info(`Getting latest PNP draws for province: ${province}, limit: ${limit}`);
    
    const draws = await pnpService.getLatestDraws(province, parseInt(limit, 10));
    
    return res.status(200).json(draws);
  } catch (error) {
    logger.error(`Error getting latest PNP draws: ${error.message}`);
    return res.status(500).json({ message: 'Error getting latest draws', error: error.message });
  }
};

/**
 * Save PNP application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.saveApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { province, stream, profile } = req.body;
    const userId = req.user.id;
    
    if (!province || !stream) {
      return res.status(400).json({ message: 'Province and stream are required' });
    }

    logger.info(`Saving PNP application for user: ${userId}, province: ${province}, stream: ${stream}`);
    
    const application = await pnpService.saveApplication(userId, province, stream, profile);
    
    return res.status(201).json(application);
  } catch (error) {
    logger.error(`Error saving PNP application: ${error.message}`);
    return res.status(500).json({ message: 'Error saving application', error: error.message });
  }
};

/**
 * Get user's PNP applications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info(`Getting PNP applications for user: ${userId}`);
    
    const applications = await pnpService.getUserApplications(userId);
    
    return res.status(200).json(applications);
  } catch (error) {
    logger.error(`Error getting user PNP applications: ${error.message}`);
    return res.status(500).json({ message: 'Error getting applications', error: error.message });
  }
};
