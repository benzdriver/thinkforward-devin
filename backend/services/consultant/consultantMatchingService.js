/**
 * 顾问匹配服务
 * 提供顾问匹配算法和匹配结果管理
 */

const Consultant = require('../../models/consultant/Consultant');
const MatchResult = require('../../models/consultant/MatchResult');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { translateMessage } = require('../../utils/localization');

/**
 * 匹配顾问
 * @param {String} userId - 用户ID
 * @param {Object} matchCriteria - 匹配条件
 * @param {String} locale - 语言
 * @returns {Promise<Array>} 匹配结果列表
 */
async function matchConsultantsToUser(userId, matchCriteria = {}, locale = 'en') {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error(translateMessage('errors.userNotFound', locale));
    }
    
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      throw new Error(translateMessage('errors.profileNotFound', locale));
    }
    
    const consultantQuery = { isActive: true };
    
    if (matchCriteria.specialties && matchCriteria.specialties.length > 0) {
      consultantQuery.specialties = { $in: matchCriteria.specialties };
    }
    
    if (matchCriteria.languages && matchCriteria.languages.length > 0) {
      consultantQuery.languages = { $in: matchCriteria.languages };
    }
    
    if (matchCriteria.countries && matchCriteria.countries.length > 0) {
      consultantQuery.countries = { $in: matchCriteria.countries };
    }
    
    if (matchCriteria.minRating) {
      consultantQuery.rating = { $gte: parseFloat(matchCriteria.minRating) };
    }
    
    if (matchCriteria.maxPrice) {
      consultantQuery['price.hourly'] = { $lte: parseFloat(matchCriteria.maxPrice) };
    }
    
    const consultants = await Consultant.find(consultantQuery);
    
    if (consultants.length === 0) {
      return [];
    }
    
    const matchResults = [];
    
    for (const consultant of consultants) {
      const { score, matchReasons } = calculateMatchScore(consultant, profile, matchCriteria);
      
      await MatchResult.updateMatchResult(userId, consultant._id, score, matchReasons);
      
      matchResults.push({
        consultant,
        score,
        matchReasons
      });
    }
    
    matchResults.sort((a, b) => b.score - a.score);
    
    return matchResults;
  } catch (error) {
    console.error('匹配顾问失败:', error);
    throw new Error(translateMessage('errors.consultantMatch', locale));
  }
}

/**
 * 计算匹配分数
 * @param {Object} consultant - 顾问
 * @param {Object} profile - 用户档案
 * @param {Object} matchCriteria - 匹配条件
 * @returns {Object} 匹配分数和匹配原因
 */
function calculateMatchScore(consultant, profile, matchCriteria) {
  const matchReasons = [];
  let totalScore = 0;
  
  const specialtyScore = calculateSpecialtyMatch(consultant, profile, matchCriteria);
  totalScore += specialtyScore.score;
  matchReasons.push(specialtyScore.reason);
  
  const languageScore = calculateLanguageMatch(consultant, profile);
  totalScore += languageScore.score;
  matchReasons.push(languageScore.reason);
  
  const countryScore = calculateCountryMatch(consultant, profile);
  totalScore += countryScore.score;
  matchReasons.push(countryScore.reason);
  
  const experienceScore = calculateExperienceMatch(consultant);
  totalScore += experienceScore.score;
  matchReasons.push(experienceScore.reason);
  
  const ratingScore = calculateRatingMatch(consultant);
  totalScore += ratingScore.score;
  matchReasons.push(ratingScore.reason);
  
  const priceScore = calculatePriceMatch(consultant, matchCriteria);
  totalScore += priceScore.score;
  matchReasons.push(priceScore.reason);
  
  const normalizedScore = Math.min(Math.round(totalScore * 10), 100);
  
  return {
    score: normalizedScore,
    matchReasons
  };
}

/**
 * 计算专业领域匹配分数
 * @param {Object} consultant - 顾问
 * @param {Object} profile - 用户档案
 * @param {Object} matchCriteria - 匹配条件
 * @returns {Object} 匹配分数和匹配原因
 */
function calculateSpecialtyMatch(consultant, profile, matchCriteria) {
  let score = 0;
  let description = '';
  
  if (matchCriteria.specialties && matchCriteria.specialties.length > 0) {
    const matchedSpecialties = consultant.specialties.filter(specialty => 
      matchCriteria.specialties.includes(specialty)
    );
    
    if (matchedSpecialties.length > 0) {
      score = (matchedSpecialties.length / matchCriteria.specialties.length) * 3;
      description = `专业领域匹配: ${matchedSpecialties.join(', ')}`;
    } else {
      description = '专业领域不匹配';
    }
  } 
  else if (profile.immigrationInfo && profile.immigrationInfo.interests) {
    const userInterests = profile.immigrationInfo.interests;
    const matchedSpecialties = consultant.specialties.filter(specialty => 
      userInterests.some(interest => interest.toLowerCase().includes(specialty.toLowerCase()))
    );
    
    if (matchedSpecialties.length > 0) {
      score = (matchedSpecialties.length / consultant.specialties.length) * 2;
      description = `专业领域与您的兴趣匹配: ${matchedSpecialties.join(', ')}`;
    } else {
      description = '专业领域与您的兴趣不匹配';
    }
  } else {
    score = 1; // 默认分数
    description = '专业领域: ' + consultant.specialties.join(', ');
  }
  
  return {
    factor: 'specialty',
    score,
    reason: {
      factor: 'specialty',
      score,
      description
    }
  };
}

/**
 * 计算语言匹配分数
 * @param {Object} consultant - 顾问
 * @param {Object} profile - 用户档案
 * @returns {Object} 匹配分数和匹配原因
 */
function calculateLanguageMatch(consultant, profile) {
  let score = 0;
  let description = '';
  
  if (profile.languageSkills && profile.languageSkills.length > 0) {
    const userLanguages = profile.languageSkills.map(lang => lang.language.toLowerCase());
    const matchedLanguages = consultant.languages.filter(lang => 
      userLanguages.includes(lang.toLowerCase())
    );
    
    if (matchedLanguages.length > 0) {
      score = (matchedLanguages.length / userLanguages.length) * 2;
      description = `语言匹配: ${matchedLanguages.join(', ')}`;
    } else {
      description = '语言不匹配';
    }
  } else {
    score = 1; // 默认分数
    description = '语言: ' + consultant.languages.join(', ');
  }
  
  return {
    factor: 'language',
    score,
    reason: {
      factor: 'language',
      score,
      description
    }
  };
}

/**
 * 计算国家匹配分数
 * @param {Object} consultant - 顾问
 * @param {Object} profile - 用户档案
 * @returns {Object} 匹配分数和匹配原因
 */
function calculateCountryMatch(consultant, profile) {
  let score = 0;
  let description = '';
  
  if (profile.immigrationInfo && profile.immigrationInfo.targetCountries) {
    const userCountries = profile.immigrationInfo.targetCountries.map(country => 
      country.toLowerCase()
    );
    
    const matchedCountries = consultant.countries.filter(country => 
      userCountries.includes(country.toLowerCase())
    );
    
    if (matchedCountries.length > 0) {
      score = (matchedCountries.length / userCountries.length) * 2;
      description = `目标国家匹配: ${matchedCountries.join(', ')}`;
    } else {
      description = '目标国家不匹配';
    }
  } else {
    score = 1; // 默认分数
    description = '专长国家: ' + consultant.countries.join(', ');
  }
  
  return {
    factor: 'country',
    score,
    reason: {
      factor: 'country',
      score,
      description
    }
  };
}

/**
 * 计算经验匹配分数
 * @param {Object} consultant - 顾问
 * @returns {Object} 匹配分数和匹配原因
 */
function calculateExperienceMatch(consultant) {
  let score = 0;
  let description = '';
  
  if (consultant.experience >= 10) {
    score = 2;
    description = '资深顾问: 10年以上经验';
  } else if (consultant.experience >= 5) {
    score = 1.5;
    description = '经验丰富: 5-10年经验';
  } else if (consultant.experience >= 2) {
    score = 1;
    description = '有经验: 2-5年经验';
  } else {
    score = 0.5;
    description = '新手顾问: 不到2年经验';
  }
  
  return {
    factor: 'experience',
    score,
    reason: {
      factor: 'experience',
      score,
      description
    }
  };
}

/**
 * 计算评分匹配分数
 * @param {Object} consultant - 顾问
 * @returns {Object} 匹配分数和匹配原因
 */
function calculateRatingMatch(consultant) {
  let score = 0;
  let description = '';
  
  if (consultant.rating >= 4.5) {
    score = 2;
    description = '优秀评价: 4.5星以上';
  } else if (consultant.rating >= 4) {
    score = 1.5;
    description = '很好评价: 4-4.5星';
  } else if (consultant.rating >= 3.5) {
    score = 1;
    description = '良好评价: 3.5-4星';
  } else if (consultant.rating >= 3) {
    score = 0.5;
    description = '一般评价: 3-3.5星';
  } else {
    score = 0;
    description = '评价不足或较低';
  }
  
  return {
    factor: 'rating',
    score,
    reason: {
      factor: 'rating',
      score,
      description
    }
  };
}

/**
 * 计算价格匹配分数
 * @param {Object} consultant - 顾问
 * @param {Object} matchCriteria - 匹配条件
 * @returns {Object} 匹配分数和匹配原因
 */
function calculatePriceMatch(consultant, matchCriteria) {
  let score = 0;
  let description = '';
  
  const hourlyPrice = consultant.price.hourly;
  
  if (matchCriteria.maxPrice) {
    const maxPrice = parseFloat(matchCriteria.maxPrice);
    
    if (hourlyPrice <= maxPrice * 0.7) {
      score = 2;
      description = '价格优惠: 低于您预算的70%';
    } else if (hourlyPrice <= maxPrice * 0.9) {
      score = 1.5;
      description = '价格合理: 低于您预算的90%';
    } else if (hourlyPrice <= maxPrice) {
      score = 1;
      description = '价格符合预算';
    } else {
      score = 0;
      description = '价格超出预算';
    }
  } else {
    if (hourlyPrice <= 50) {
      score = 2;
      description = '价格经济: 每小时$50以下';
    } else if (hourlyPrice <= 100) {
      score = 1.5;
      description = '价格中等: 每小时$50-$100';
    } else if (hourlyPrice <= 150) {
      score = 1;
      description = '价格较高: 每小时$100-$150';
    } else {
      score = 0.5;
      description = '价格高端: 每小时$150以上';
    }
  }
  
  return {
    factor: 'price',
    score,
    reason: {
      factor: 'price',
      score,
      description
    }
  };
}

/**
 * 获取用户的匹配结果
 * @param {String} userId - 用户ID
 * @param {Number} limit - 限制数量
 * @param {String} locale - 语言
 * @returns {Promise<Array>} 匹配结果列表
 */
async function getUserMatchResults(userId, limit = 10, locale = 'en') {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error(translateMessage('errors.userNotFound', locale));
    }
    
    const matchResults = await MatchResult.getTopMatches(userId, limit);
    
    return matchResults;
  } catch (error) {
    console.error('获取用户匹配结果失败:', error);
    throw new Error(translateMessage('errors.matchResults', locale));
  }
}

/**
 * 生成匹配原因
 * @param {Array} matchReasons - 匹配原因
 * @param {String} locale - 语言
 * @returns {Array} 格式化的匹配原因
 */
function generateMatchReasons(matchReasons, locale = 'en') {
  return matchReasons.map(reason => ({
    factor: reason.factor,
    description: translateMessage(`match.reasons.${reason.factor}`, locale, { 
      description: reason.description 
    })
  }));
}

module.exports = {
  matchConsultantsToUser,
  getUserMatchResults,
  generateMatchReasons
};
