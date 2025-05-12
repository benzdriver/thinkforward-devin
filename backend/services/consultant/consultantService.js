/**
 * 顾问服务
 * 提供顾问相关的业务逻辑
 */

const Consultant = require('../../models/consultant/Consultant');
const ConsultantReview = require('../../models/consultant/ConsultantReview');
const ConsultantAvailability = require('../../models/consultant/ConsultantAvailability');
const { translateMessage } = require('../../utils/localization');

/**
 * 获取顾问列表
 * @param {Object} filters - 筛选条件
 * @param {Number} page - 页码
 * @param {Number} limit - 每页数量
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 顾问列表和分页信息
 */
async function getConsultants(filters = {}, page = 1, limit = 10, locale = 'en') {
  try {
    const query = { isActive: true };
    
    if (filters.specialties && filters.specialties.length > 0) {
      query.specialties = { $in: filters.specialties };
    }
    
    if (filters.languages && filters.languages.length > 0) {
      query.languages = { $in: filters.languages };
    }
    
    if (filters.countries && filters.countries.length > 0) {
      query.countries = { $in: filters.countries };
    }
    
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }
    
    if (filters.minExperience) {
      query.experience = { $gte: parseInt(filters.minExperience) };
    }
    
    if (filters.maxPrice) {
      query['price.hourly'] = { $lte: parseFloat(filters.maxPrice) };
    }
    
    const skip = (page - 1) * limit;
    
    const consultants = await Consultant.find(query)
      .sort(filters.sortBy === 'price' ? { 'price.hourly': 1 } : { rating: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Consultant.countDocuments(query);
    
    return {
      consultants,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('获取顾问列表失败:', error);
    throw new Error(translateMessage('errors.consultantList', locale));
  }
}

/**
 * 获取顾问详情
 * @param {String} consultantId - 顾问ID
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 顾问详情
 */
async function getConsultantById(consultantId, locale = 'en') {
  try {
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    return consultant;
  } catch (error) {
    console.error('获取顾问详情失败:', error);
    throw new Error(translateMessage('errors.consultantDetails', locale));
  }
}

/**
 * 获取顾问可用性
 * @param {String} consultantId - 顾问ID
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @param {String} locale - 语言
 * @returns {Promise<Array>} 可用性列表
 */
async function getConsultantAvailability(consultantId, startDate, endDate, locale = 'en') {
  try {
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    const availability = await ConsultantAvailability.findByDateRange(
      consultantId,
      new Date(startDate),
      new Date(endDate)
    );
    
    return availability;
  } catch (error) {
    console.error('获取顾问可用性失败:', error);
    throw new Error(translateMessage('errors.consultantAvailability', locale));
  }
}

/**
 * 获取顾问评价
 * @param {String} consultantId - 顾问ID
 * @param {Number} page - 页码
 * @param {Number} limit - 每页数量
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 评价列表和分页信息
 */
async function getConsultantReviews(consultantId, page = 1, limit = 10, locale = 'en') {
  try {
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    const skip = (page - 1) * limit;
    
    const reviews = await ConsultantReview.find({ 
      consultantId,
      isActive: true
    })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await ConsultantReview.countDocuments({ 
      consultantId,
      isActive: true
    });
    
    const ratingStats = await ConsultantReview.calculateAverageRating(consultantId);
    
    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      stats: ratingStats
    };
  } catch (error) {
    console.error('获取顾问评价失败:', error);
    throw new Error(translateMessage('errors.consultantReviews', locale));
  }
}

/**
 * 更新顾问信息
 * @param {String} consultantId - 顾问ID
 * @param {Object} updates - 更新内容
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 更新后的顾问
 */
async function updateConsultant(consultantId, updates, locale = 'en') {
  try {
    const consultant = await Consultant.findById(consultantId);
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    delete updates._id;
    delete updates.email;
    delete updates.isVerified;
    delete updates.rating;
    delete updates.reviewCount;
    
    Object.keys(updates).forEach(key => {
      consultant[key] = updates[key];
    });
    
    await consultant.save();
    
    return consultant;
  } catch (error) {
    console.error('更新顾问信息失败:', error);
    throw new Error(translateMessage('errors.consultantUpdate', locale));
  }
}

/**
 * 添加顾问评价
 * @param {String} consultantId - 顾问ID
 * @param {Object} reviewData - 评价数据
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 添加的评价
 */
async function addConsultantReview(consultantId, reviewData, locale = 'en') {
  try {
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    const existingReview = await ConsultantReview.findOne({
      consultantId,
      userId: reviewData.userId
    });
    
    if (existingReview) {
      throw new Error(translateMessage('errors.reviewExists', locale));
    }
    
    const review = await consultant.addReview(reviewData);
    
    return review;
  } catch (error) {
    console.error('添加顾问评价失败:', error);
    throw new Error(translateMessage('errors.reviewAdd', locale));
  }
}

/**
 * 更新顾问可用性
 * @param {String} consultantId - 顾问ID
 * @param {Object} availabilityData - 可用性数据
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 更新后的可用性
 */
async function updateConsultantAvailability(consultantId, availabilityData, locale = 'en') {
  try {
    const consultant = await Consultant.findOne({ 
      _id: consultantId,
      isActive: true
    });
    
    if (!consultant) {
      throw new Error(translateMessage('errors.consultantNotFound', locale));
    }
    
    const availability = await consultant.updateAvailability(availabilityData);
    
    return availability;
  } catch (error) {
    console.error('更新顾问可用性失败:', error);
    throw new Error(translateMessage('errors.availabilityUpdate', locale));
  }
}

/**
 * 获取顾问筛选选项
 * @param {String} locale - 语言
 * @returns {Promise<Object>} 筛选选项
 */
async function getConsultantFilterOptions(locale = 'en') {
  try {
    const specialties = await Consultant.distinct('specialties');
    const languages = await Consultant.distinct('languages');
    const countries = await Consultant.distinct('countries');
    
    return {
      specialties,
      languages,
      countries
    };
  } catch (error) {
    console.error('获取顾问筛选选项失败:', error);
    throw new Error(translateMessage('errors.filterOptions', locale));
  }
}

module.exports = {
  getConsultants,
  getConsultantById,
  getConsultantAvailability,
  getConsultantReviews,
  updateConsultant,
  addConsultantReview,
  updateConsultantAvailability,
  getConsultantFilterOptions
};
