/**
 * Pathway controller for handling pathway-related requests
 */
const { validationResult } = require('express-validator');
const pathwayService = require('../../services/pathway/pathwayService');
const { translateError } = require('../../utils/errorHandler');

/**
 * Get all pathways
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllPathways = async (req, res) => {
  try {
    const filters = {
      country: req.query.country,
      category: req.query.category
    };
    
    const locale = req.locale || 'en';
    
    const pathways = await pathwayService.getAllPathways(filters, locale);
    
    res.status(200).json({
      success: true,
      data: pathways
    });
  } catch (error) {
    console.error('Get all pathways error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching pathways'
    });
  }
};

/**
 * Get pathway by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPathwayById = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = req.locale || 'en';
    
    const pathway = await pathwayService.getPathwayById(id, locale);
    
    res.status(200).json({
      success: true,
      data: pathway
    });
  } catch (error) {
    console.error('Get pathway by ID error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching pathway'
    });
  }
};

/**
 * Get pathway by code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPathwayByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const locale = req.locale || 'en';
    
    const pathway = await pathwayService.getPathwayByCode(code, locale);
    
    res.status(200).json({
      success: true,
      data: pathway
    });
  } catch (error) {
    console.error('Get pathway by code error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching pathway'
    });
  }
};

/**
 * Check pathway eligibility
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkEligibility = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const profileData = req.body.profileData;
    const locale = req.locale || 'en';
    
    const eligibilityResult = await pathwayService.checkEligibility(id, userId, profileData, locale);
    
    res.status(200).json({
      success: true,
      data: eligibilityResult
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while checking eligibility'
    });
  }
};

/**
 * Get recommended pathways
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRecommendedPathways = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body.profileData;
    const locale = req.locale || 'en';
    
    const recommendations = await pathwayService.getRecommendedPathways(userId, profileData, locale);
    
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommended pathways error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching recommendations'
    });
  }
};

/**
 * Get pathway categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPathwayCategories = async (req, res) => {
  try {
    const { country } = req.query;
    const locale = req.locale || 'en';
    
    const categories = await pathwayService.getPathwayCategories(country, locale);
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get pathway categories error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching categories'
    });
  }
};

/**
 * Get pathway countries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPathwayCountries = async (req, res) => {
  try {
    const locale = req.locale || 'en';
    
    const countries = await pathwayService.getPathwayCountries(locale);
    
    res.status(200).json({
      success: true,
      data: countries
    });
  } catch (error) {
    console.error('Get pathway countries error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching countries'
    });
  }
};

/**
 * Create a new pathway (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createPathway = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }
    
    const pathwayData = req.body;
    const locale = req.locale || 'en';
    
    const pathway = await pathwayService.createPathway(pathwayData, locale);
    
    res.status(201).json({
      success: true,
      data: pathway
    });
  } catch (error) {
    console.error('Create pathway error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while creating pathway'
    });
  }
};

/**
 * Update pathway (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updatePathway = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }
    
    const { id } = req.params;
    const pathwayData = req.body;
    const locale = req.locale || 'en';
    
    const pathway = await pathwayService.updatePathway(id, pathwayData, locale);
    
    res.status(200).json({
      success: true,
      data: pathway
    });
  } catch (error) {
    console.error('Update pathway error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while updating pathway'
    });
  }
};

/**
 * Delete pathway (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deletePathway = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }
    
    const { id } = req.params;
    const locale = req.locale || 'en';
    
    const result = await pathwayService.deletePathway(id, locale);
    
    res.status(200).json({
      success: true,
      message: 'Pathway deleted successfully'
    });
  } catch (error) {
    console.error('Delete pathway error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while deleting pathway'
    });
  }
};
