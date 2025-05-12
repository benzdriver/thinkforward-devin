/**
 * 匹配结果模型
 * 存储顾问匹配结果和匹配原因
 */

const mongoose = require('mongoose');

const matchResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultant',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  matchReasons: [{
    factor: String,
    score: Number,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

matchResultSchema.index({ userId: 1, consultantId: 1 }, { unique: true });

/**
 * 按用户ID查找匹配结果
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 匹配结果列表
 */
matchResultSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ score: -1 });
};

/**
 * 按顾问ID查找匹配结果
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Array>} 匹配结果列表
 */
matchResultSchema.statics.findByConsultant = function(consultantId) {
  return this.find({ consultantId }).sort({ score: -1 });
};

/**
 * 按匹配分数查找匹配结果
 * @param {String} userId - 用户ID
 * @param {Number} minScore - 最低分数
 * @returns {Promise<Array>} 匹配结果列表
 */
matchResultSchema.statics.findByMinScore = function(userId, minScore) {
  return this.find({ 
    userId, 
    score: { $gte: minScore } 
  }).sort({ score: -1 });
};

/**
 * 获取用户的顶级匹配结果
 * @param {String} userId - 用户ID
 * @param {Number} limit - 限制数量
 * @returns {Promise<Array>} 匹配结果列表
 */
matchResultSchema.statics.getTopMatches = function(userId, limit = 5) {
  return this.find({ userId })
    .sort({ score: -1 })
    .limit(limit)
    .populate('consultantId');
};

/**
 * 更新匹配结果
 * @param {String} userId - 用户ID
 * @param {String} consultantId - 顾问ID
 * @param {Number} score - 匹配分数
 * @param {Array} matchReasons - 匹配原因
 * @returns {Promise<Object>} 更新后的匹配结果
 */
matchResultSchema.statics.updateMatchResult = async function(userId, consultantId, score, matchReasons) {
  const matchResult = await this.findOne({ userId, consultantId });
  
  if (matchResult) {
    matchResult.score = score;
    matchResult.matchReasons = matchReasons;
    return await matchResult.save();
  } else {
    return await this.create({
      userId,
      consultantId,
      score,
      matchReasons
    });
  }
};

const MatchResult = mongoose.model('MatchResult', matchResultSchema);

module.exports = MatchResult;
