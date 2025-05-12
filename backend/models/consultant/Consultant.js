/**
 * 顾问模型
 * 存储顾问信息和专业领域
 */

const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: String,
  profileImage: String,
  avatar: String,
  title: String,
  company: String,
  
  specialization: [String],
  specialties: [String],
  countries: [String],
  languages: [String],
  experience: {
    type: Number,
    default: 0
  },
  credentials: [String],
  certifications: [String],
  education: [{
    institution: String,
    degree: String,
    year: Number
  }],
  
  rating: { 
    type: Number, 
    default: 0 
  },
  reviewCount: { 
    type: Number, 
    default: 0 
  },
  successRate: { 
    type: Number, 
    default: 0 
  },
  
  price: {
    hourly: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: 'CAD' 
    }
  },
  
  bio: String,
  website: String,
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  location: {
    country: String,
    city: String,
    address: String
  },
  
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

/**
 * 获取顾问可用性
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {Promise<Array>} 可用性列表
 */
consultantSchema.methods.getAvailability = async function(startDate, endDate) {
  const ConsultantAvailability = mongoose.model('ConsultantAvailability');
  return await ConsultantAvailability.find({
    consultantId: this._id,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

/**
 * 获取顾问评价
 * @param {Number} limit - 限制数量
 * @param {Number} skip - 跳过数量
 * @returns {Promise<Array>} 评价列表
 */
consultantSchema.methods.getReviews = async function(limit = 10, skip = 0) {
  const ConsultantReview = mongoose.model('ConsultantReview');
  return await ConsultantReview.find({ 
    consultantId: this._id,
    isActive: true
  })
  .sort({ date: -1 })
  .limit(limit)
  .skip(skip);
};

/**
 * 更新顾问可用性
 * @param {Object} availabilityData - 可用性数据
 * @returns {Promise<Object>} 更新后的可用性
 */
consultantSchema.methods.updateAvailability = async function(availabilityData) {
  const ConsultantAvailability = mongoose.model('ConsultantAvailability');
  
  const { date, slots, isRecurring, recurringPattern } = availabilityData;
  
  let availability = await ConsultantAvailability.findOne({
    consultantId: this._id,
    date: new Date(date)
  });
  
  if (!availability) {
    availability = new ConsultantAvailability({
      consultantId: this._id,
      date: new Date(date),
      slots: slots || [],
      isRecurring: isRecurring || false,
      recurringPattern: recurringPattern || null
    });
  } else {
    availability.slots = slots || availability.slots;
    availability.isRecurring = isRecurring !== undefined ? isRecurring : availability.isRecurring;
    availability.recurringPattern = recurringPattern || availability.recurringPattern;
  }
  
  await availability.save();
  return availability;
};

/**
 * 添加顾问评价
 * @param {Object} reviewData - 评价数据
 * @returns {Promise<Object>} 添加的评价
 */
consultantSchema.methods.addReview = async function(reviewData) {
  const ConsultantReview = mongoose.model('ConsultantReview');
  
  const review = new ConsultantReview({
    consultantId: this._id,
    userId: reviewData.userId,
    userName: reviewData.userName,
    rating: reviewData.rating,
    comment: reviewData.comment,
    date: new Date()
  });
  
  await review.save();
  
  const reviews = await ConsultantReview.find({ 
    consultantId: this._id,
    isActive: true
  });
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = reviews.length > 0 ? totalRating / reviews.length : 0;
  this.reviewCount = reviews.length;
  
  await this.save();
  
  return review;
};

/**
 * 按专业领域查找顾问
 * @param {Array} specialties - 专业领域
 * @returns {Promise<Array>} 顾问列表
 */
consultantSchema.statics.findBySpecialties = function(specialties) {
  return this.find({ 
    specialties: { $in: specialties }, 
    isActive: true 
  });
};

/**
 * 按语言查找顾问
 * @param {Array} languages - 语言
 * @returns {Promise<Array>} 顾问列表
 */
consultantSchema.statics.findByLanguages = function(languages) {
  return this.find({ 
    languages: { $in: languages }, 
    isActive: true 
  });
};

/**
 * 按位置查找顾问
 * @param {String} country - 国家
 * @param {String} city - 城市
 * @returns {Promise<Array>} 顾问列表
 */
consultantSchema.statics.findByLocation = function(country, city) {
  const query = { isActive: true };
  
  if (country) {
    query['location.country'] = country;
  }
  
  if (city) {
    query['location.city'] = city;
  }
  
  return this.find(query);
};

/**
 * 使用筛选条件查找顾问
 * @param {Object} filters - 筛选条件
 * @returns {Promise<Array>} 顾问列表
 */
consultantSchema.statics.findWithFilters = function(filters) {
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
    query.rating = { $gte: filters.minRating };
  }
  
  if (filters.minExperience) {
    query.experience = { $gte: filters.minExperience };
  }
  
  if (filters.maxPrice) {
    query['price.hourly'] = { $lte: filters.maxPrice };
  }
  
  return this.find(query);
};

const Consultant = mongoose.model('Consultant', consultantSchema);

module.exports = Consultant;
