/**
 * 顾问评价模型
 * 存储用户对顾问的评价
 */

const mongoose = require('mongoose');

const consultantReviewSchema = new mongoose.Schema({
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

/**
 * 验证评价
 * @returns {Promise<Object>} 更新后的评价
 */
consultantReviewSchema.methods.verifyReview = function() {
  this.isVerified = true;
  return this.save();
};

/**
 * 按顾问ID查找评价
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Array>} 评价列表
 */
consultantReviewSchema.statics.findByConsultant = function(consultantId) {
  return this.find({ 
    consultantId, 
    isActive: true 
  }).sort({ date: -1 });
};

/**
 * 按用户ID查找评价
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 评价列表
 */
consultantReviewSchema.statics.findByUser = function(userId) {
  return this.find({ 
    userId, 
    isActive: true 
  }).sort({ date: -1 });
};

/**
 * 按评分查找评价
 * @param {String} consultantId - 顾问ID
 * @param {Number} minRating - 最低评分
 * @param {Number} maxRating - 最高评分
 * @returns {Promise<Array>} 评价列表
 */
consultantReviewSchema.statics.findByRating = function(consultantId, minRating, maxRating) {
  return this.find({ 
    consultantId, 
    rating: { $gte: minRating, $lte: maxRating },
    isActive: true 
  }).sort({ date: -1 });
};

/**
 * 计算顾问平均评分
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 评分统计
 */
consultantReviewSchema.statics.calculateAverageRating = async function(consultantId) {
  const reviews = await this.find({ 
    consultantId, 
    isActive: true 
  });
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
  const ratingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  reviews.forEach(review => {
    ratingDistribution[review.rating]++;
  });
  
  return {
    averageRating,
    totalReviews: reviews.length,
    distribution: ratingDistribution
  };
};

const ConsultantReview = mongoose.model('ConsultantReview', consultantReviewSchema);

module.exports = ConsultantReview;
