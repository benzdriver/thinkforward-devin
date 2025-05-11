/**
 * Assessment controller for handling assessment-related requests
 */
const { validationResult } = require('express-validator');
const assessmentService = require('../../services/assessment/assessmentService');
const { translateError } = require('../../utils/errorHandler');

/**
 * Get assessment types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAssessmentTypes = async (req, res) => {
  try {
    const locale = req.locale || 'en';
    
    const assessmentTypes = await assessmentService.getAssessmentTypes(locale);
    
    res.status(200).json({
      success: true,
      data: assessmentTypes
    });
  } catch (error) {
    console.error('Get assessment types error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching assessment types'
    });
  }
};

/**
 * Start a new assessment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.startAssessment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { type, metadata } = req.body;
    const userId = req.user.id;
    const locale = req.locale || 'en';
    
    const assessment = await assessmentService.createAssessment(userId, type, metadata, locale);
    
    res.status(201).json({
      success: true,
      data: {
        assessmentId: assessment._id,
        type: assessment.type,
        totalSteps: assessment.totalSteps
      }
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while starting assessment'
    });
  }
};

/**
 * Get assessment question
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getQuestion = async (req, res) => {
  try {
    const { id, step } = req.params;
    const locale = req.locale || 'en';
    
    const questionData = await assessmentService.fetchQuestions(id, parseInt(step, 10), locale);
    
    res.status(200).json({
      success: true,
      data: questionData
    });
  } catch (error) {
    console.error('Get question error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching question'
    });
  }
};

/**
 * Submit response to assessment question
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitResponse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { questionId, response } = req.body;
    const locale = req.locale || 'en';
    
    const assessment = await assessmentService.processResponse(id, questionId, response, locale);
    
    res.status(200).json({
      success: true,
      data: {
        currentStep: assessment.currentStep,
        totalSteps: assessment.totalSteps,
        progress: assessment.progress,
        isComplete: assessment.isComplete()
      }
    });
  } catch (error) {
    console.error('Submit response error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while submitting response'
    });
  }
};

/**
 * Get assessment progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = req.locale || 'en';
    
    const progressData = await assessmentService.calculateProgress(id, locale);
    
    res.status(200).json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Get progress error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching progress'
    });
  }
};

/**
 * Get assessment result
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getResult = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = req.locale || 'en';
    
    const result = await assessmentService.getResult(id, locale);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get result error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching result'
    });
  }
};

/**
 * List user's assessments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.listUserAssessments = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const locale = req.locale || 'en';
    
    if (req.params.userId && req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: translateError(new Error('Not authorized to access this data'), locale).message
      });
    }
    
    const assessments = await assessmentService.listUserAssessments(userId, locale);
    
    res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('List user assessments error:', error);
    
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred while fetching user assessments'
    });
  }
};
