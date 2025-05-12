/**
 * 顾问控制器
 * 处理顾问相关的HTTP请求
 */

const consultantService = require('../../services/consultant/consultantService');
const consultantMatchingService = require('../../services/consultant/consultantMatchingService');
const { translateMessage } = require('../../utils/localization');

/**
 * 获取顾问列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getConsultants(req, res, next) {
  try {
    const { 
      specialties, 
      languages, 
      countries, 
      minRating, 
      minExperience, 
      maxPrice, 
      sortBy,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filters = {
      specialties: specialties ? specialties.split(',') : undefined,
      languages: languages ? languages.split(',') : undefined,
      countries: countries ? countries.split(',') : undefined,
      minRating,
      minExperience,
      maxPrice,
      sortBy
    };
    
    const result = await consultantService.getConsultants(
      filters,
      parseInt(page),
      parseInt(limit),
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: result.consultants,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取顾问详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getConsultantById(req, res, next) {
  try {
    const { consultantId } = req.params;
    
    const consultant = await consultantService.getConsultantById(consultantId, req.locale);
    
    res.status(200).json({
      success: true,
      data: consultant
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取顾问可用性
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getConsultantAvailability(req, res, next) {
  try {
    const { consultantId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingDateRange', req.locale)
        }
      });
    }
    
    const availability = await consultantService.getConsultantAvailability(
      consultantId,
      startDate,
      endDate,
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取顾问评价
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getConsultantReviews(req, res, next) {
  try {
    const { consultantId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await consultantService.getConsultantReviews(
      consultantId,
      parseInt(page),
      parseInt(limit),
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
      stats: result.stats
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 添加顾问评价
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function addConsultantReview(req, res, next) {
  try {
    const { consultantId } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: translateMessage('errors.missingRating', req.locale)
        }
      });
    }
    
    const reviewData = {
      userId: req.user.id,
      userName: req.user.name,
      rating: parseInt(rating),
      comment
    };
    
    const review = await consultantService.addConsultantReview(
      consultantId,
      reviewData,
      req.locale
    );
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 匹配顾问
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function matchConsultants(req, res, next) {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const matchCriteria = req.body;
    
    const matchResults = await consultantMatchingService.matchConsultantsToUser(
      userId,
      matchCriteria,
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: matchResults
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户匹配结果
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getUserMatchResults(req, res, next) {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const matchResults = await consultantMatchingService.getUserMatchResults(
      userId,
      parseInt(limit),
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: matchResults
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取顾问筛选选项
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function getConsultantFilterOptions(req, res, next) {
  try {
    const filterOptions = await consultantService.getConsultantFilterOptions(req.locale);
    
    res.status(200).json({
      success: true,
      data: filterOptions
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新顾问可用性
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
async function updateConsultantAvailability(req, res, next) {
  try {
    const { consultantId } = req.params;
    
    if (req.user.id !== consultantId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: translateMessage('errors.forbidden', req.locale)
        }
      });
    }
    
    const availabilityData = req.body;
    
    const availability = await consultantService.updateConsultantAvailability(
      consultantId,
      availabilityData,
      req.locale
    );
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConsultants,
  getConsultantById,
  getConsultantAvailability,
  getConsultantReviews,
  addConsultantReview,
  matchConsultants,
  getUserMatchResults,
  getConsultantFilterOptions,
  updateConsultantAvailability
};
