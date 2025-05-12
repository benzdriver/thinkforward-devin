/**
 * Assessment service for managing user assessments
 */
const Assessment = require('../../models/assessment/Assessment');
const AssessmentQuestion = require('../../models/assessment/AssessmentQuestion');
const AssessmentResult = require('../../models/assessment/AssessmentResult');
const { translateError } = require('../../utils/errorHandler');

/**
 * Create a new assessment
 * @param {string} userId - User ID
 * @param {string} type - Assessment type
 * @param {Object} metadata - Assessment metadata
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Created assessment
 */
exports.createAssessment = async (userId, type, metadata = {}, locale = 'en') => {
  try {
    const questions = await AssessmentQuestion.find({
      $or: [
        { assessmentType: type },
        { assessmentType: 'all' }
      ],
      active: true
    }).sort({ order: 1 });
    
    const totalSteps = questions.length;
    
    const assessment = new Assessment({
      userId,
      type,
      totalSteps,
      metadata
    });
    
    await assessment.save();
    
    return assessment;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Fetch questions for an assessment
 * @param {string} assessmentId - Assessment ID
 * @param {number} step - Current step
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Question data
 */
exports.fetchQuestions = async (assessmentId, step = 1, locale = 'en') => {
  try {
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      const error = new Error('Assessment not found');
      error.statusCode = 404;
      throw error;
    }
    
    const questions = await AssessmentQuestion.find({
      $or: [
        { assessmentType: assessment.type },
        { assessmentType: 'all' }
      ],
      active: true
    }).sort({ order: 1 });
    
    if (questions.length === 0) {
      const error = new Error('No questions found for this assessment type');
      error.statusCode = 404;
      throw error;
    }
    
    const currentIndex = step - 1;
    if (currentIndex < 0 || currentIndex >= questions.length) {
      const error = new Error('Invalid step number');
      error.statusCode = 400;
      throw error;
    }
    
    const currentQuestion = questions[currentIndex];
    
    if (currentQuestion.dependsOn && currentQuestion.dependsOn.questionId) {
      const dependentResponse = assessment.getResponse(currentQuestion.dependsOn.questionId);
      
      if (!dependentResponse || dependentResponse.response !== currentQuestion.dependsOn.value) {
        return await exports.fetchQuestions(assessmentId, step + 1, locale);
      }
    }
    
    const translation = currentQuestion.getTranslation(locale);
    
    return {
      question: {
        id: currentQuestion._id,
        text: translation.questionText,
        type: currentQuestion.type,
        options: translation.options,
        category: currentQuestion.category,
        required: currentQuestion.required,
        metadata: currentQuestion.metadata
      },
      step,
      totalSteps: assessment.totalSteps,
      progress: assessment.progress
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Process user response to a question
 * @param {string} assessmentId - Assessment ID
 * @param {string} questionId - Question ID
 * @param {*} response - User response
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated assessment
 */
exports.processResponse = async (assessmentId, questionId, response, locale = 'en') => {
  try {
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      const error = new Error('Assessment not found');
      error.statusCode = 404;
      throw error;
    }
    
    const question = await AssessmentQuestion.findById(questionId);
    
    if (!question) {
      const error = new Error('Question not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (!question.validateResponse(response)) {
      const error = new Error('Invalid response format');
      error.statusCode = 400;
      throw error;
    }
    
    const score = question.calculateScore(response);
    
    const responseData = {
      questionId,
      response,
      score,
      answeredAt: new Date()
    };
    
    assessment.addResponse(responseData);
    
    await assessment.save();
    
    if (assessment.isComplete()) {
      await exports.generateResults(assessmentId, locale);
    }
    
    return assessment;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Calculate assessment progress
 * @param {string} assessmentId - Assessment ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Progress data
 */
exports.calculateProgress = async (assessmentId, locale = 'en') => {
  try {
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      const error = new Error('Assessment not found');
      error.statusCode = 404;
      throw error;
    }
    
    const progress = assessment.calculateProgress();
    
    return {
      assessmentId,
      currentStep: assessment.currentStep,
      totalSteps: assessment.totalSteps,
      progress,
      status: assessment.status,
      isComplete: assessment.isComplete()
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Generate assessment results
 * @param {string} assessmentId - Assessment ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Assessment results
 */
exports.generateResults = async (assessmentId, locale = 'en') => {
  try {
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      const error = new Error('Assessment not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (!assessment.isComplete()) {
      const error = new Error('Assessment is not complete');
      error.statusCode = 400;
      throw error;
    }
    
    let result = await AssessmentResult.findOne({ assessmentId });
    
    if (result) {
      return result;
    }
    
    const categoryScores = new Map();
    const questions = await AssessmentQuestion.find({
      _id: { $in: assessment.responses.map(r => r.questionId) }
    });
    
    assessment.responses.forEach(response => {
      const question = questions.find(q => q._id.toString() === response.questionId.toString());
      
      if (question) {
        const category = question.category;
        const currentScore = categoryScores.get(category) || 0;
        categoryScores.set(category, currentScore + response.score);
      }
    });
    
    const categoryValues = Array.from(categoryScores.values());
    const overallScore = categoryValues.length > 0 
      ? categoryValues.reduce((sum, score) => sum + score, 0) / categoryValues.length
      : 0;
    
    const mockPathways = [
      {
        name: 'Express Entry',
        category: 'Federal',
        score: calculatePathwayScore(assessment, categoryScores, 'Express Entry'),
        matchPercentage: 85,
        eligibility: 'eligible',
        reasons: ['Strong language skills', 'Relevant work experience']
      },
      {
        name: 'Provincial Nominee Program',
        category: 'Provincial',
        score: calculatePathwayScore(assessment, categoryScores, 'Provincial Nominee Program'),
        matchPercentage: 75,
        eligibility: 'potentially_eligible',
        reasons: ['In-demand occupation', 'Education matches provincial needs']
      },
      {
        name: 'Atlantic Immigration Program',
        category: 'Regional',
        score: calculatePathwayScore(assessment, categoryScores, 'Atlantic Immigration Program'),
        matchPercentage: 60,
        eligibility: 'potentially_eligible',
        reasons: ['Job offer may be required', 'Settlement plan needed']
      },
      {
        name: 'Start-up Visa Program',
        category: 'Business',
        score: calculatePathwayScore(assessment, categoryScores, 'Start-up Visa Program'),
        matchPercentage: 40,
        eligibility: 'not_eligible',
        reasons: ['Business experience required', 'Support from designated organization needed']
      }
    ];
    
    result = new AssessmentResult({
      assessmentId,
      userId: assessment.userId,
      scores: {
        overall: overallScore,
        categories: categoryScores
      },
      recommendations: mockPathways.map(pathway => ({
        name: pathway.name,
        description: `${pathway.name} immigration pathway`,
        score: pathway.score,
        matchPercentage: pathway.matchPercentage,
        eligibility: pathway.eligibility,
        reasons: pathway.reasons
      })),
      pathways: mockPathways.map(pathway => ({
        name: pathway.name,
        category: pathway.category,
        score: pathway.score,
        matchPercentage: pathway.matchPercentage
      })),
      summary: generateSummary(assessment, categoryScores, overallScore),
      strengths: generateStrengths(assessment, categoryScores),
      weaknesses: generateWeaknesses(assessment, categoryScores),
      nextSteps: generateNextSteps(assessment, mockPathways)
    });
    
    await result.save();
    
    assessment.resultId = result._id;
    await assessment.save();
    
    return result;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get assessment result
 * @param {string} assessmentId - Assessment ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Assessment result
 */
exports.getResult = async (assessmentId, locale = 'en') => {
  try {
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      const error = new Error('Assessment not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (!assessment.isComplete()) {
      const error = new Error('Assessment is not complete');
      error.statusCode = 400;
      throw error;
    }
    
    let result = await AssessmentResult.findOne({ assessmentId });
    
    if (!result) {
      result = await exports.generateResults(assessmentId, locale);
    }
    
    return result;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * List user's assessments
 * @param {string} userId - User ID
 * @param {string} locale - User locale
 * @returns {Promise<Array>} - User's assessments
 */
exports.listUserAssessments = async (userId, locale = 'en') => {
  try {
    const assessments = await Assessment.find({ userId })
      .sort({ startedAt: -1 });
    
    return assessments.map(assessment => ({
      id: assessment._id,
      type: assessment.type,
      status: assessment.status,
      progress: assessment.progress,
      startedAt: assessment.startedAt,
      completedAt: assessment.completedAt,
      isComplete: assessment.isComplete()
    }));
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get assessment types
 * @param {string} locale - User locale
 * @returns {Promise<Array>} - Assessment types
 */
exports.getAssessmentTypes = async (locale = 'en') => {
  try {
    return [
      {
        id: 'comprehensive',
        name: 'Comprehensive Assessment',
        description: 'A detailed assessment covering all aspects of your immigration profile',
        estimatedTime: '15-20 minutes',
        questions: 25
      },
      {
        id: 'express',
        name: 'Express Assessment',
        description: 'A quick assessment focusing on key eligibility factors',
        estimatedTime: '5-10 minutes',
        questions: 10
      },
      {
        id: 'targeted',
        name: 'Targeted Assessment',
        description: 'An assessment focused on specific immigration programs',
        estimatedTime: '10-15 minutes',
        questions: 15
      }
    ];
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Calculate pathway score based on assessment responses
 * @param {Object} assessment - Assessment object
 * @param {Map} categoryScores - Category scores
 * @param {string} pathwayName - Pathway name
 * @returns {number} - Pathway score
 */
function calculatePathwayScore(assessment, categoryScores, pathwayName) {
  
  const weights = {
    'Express Entry': {
      education: 0.25,
      language: 0.25,
      work: 0.25,
      personal: 0.1,
      immigration: 0.1,
      preferences: 0.05
    },
    'Provincial Nominee Program': {
      education: 0.2,
      language: 0.2,
      work: 0.3,
      personal: 0.1,
      immigration: 0.1,
      preferences: 0.1
    },
    'Atlantic Immigration Program': {
      education: 0.2,
      language: 0.15,
      work: 0.25,
      personal: 0.1,
      immigration: 0.2,
      preferences: 0.1
    },
    'Start-up Visa Program': {
      education: 0.15,
      language: 0.15,
      work: 0.4,
      personal: 0.05,
      immigration: 0.15,
      preferences: 0.1
    }
  };
  
  const pathwayWeights = weights[pathwayName] || {
    education: 0.2,
    language: 0.2,
    work: 0.2,
    personal: 0.1,
    immigration: 0.2,
    preferences: 0.1
  };
  
  let weightedScore = 0;
  let totalWeight = 0;
  
  for (const [category, weight] of Object.entries(pathwayWeights)) {
    if (categoryScores.has(category)) {
      weightedScore += categoryScores.get(category) * weight;
      totalWeight += weight;
    }
  }
  
  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

/**
 * Generate assessment summary
 * @param {Object} assessment - Assessment object
 * @param {Map} categoryScores - Category scores
 * @param {number} overallScore - Overall score
 * @returns {string} - Assessment summary
 */
function generateSummary(assessment, categoryScores, overallScore) {
  
  const summaries = [
    'Based on your assessment, you have several potential immigration pathways available.',
    'Your profile shows strengths in education and language skills.',
    'Consider exploring Express Entry and Provincial Nominee Programs as primary options.',
    'With some improvements to your profile, you could increase your eligibility for additional programs.'
  ];
  
  return summaries.join(' ');
}

/**
 * Generate strengths based on assessment
 * @param {Object} assessment - Assessment object
 * @param {Map} categoryScores - Category scores
 * @returns {Array} - Strengths
 */
function generateStrengths(assessment, categoryScores) {
  
  const strengths = [];
  
  if (categoryScores.get('education') > 7) {
    strengths.push('Strong educational background');
  }
  
  if (categoryScores.get('language') > 7) {
    strengths.push('Excellent language proficiency');
  }
  
  if (categoryScores.get('work') > 7) {
    strengths.push('Valuable work experience');
  }
  
  if (strengths.length === 0) {
    strengths.push('Determination to immigrate');
  }
  
  return strengths;
}

/**
 * Generate weaknesses based on assessment
 * @param {Object} assessment - Assessment object
 * @param {Map} categoryScores - Category scores
 * @returns {Array} - Weaknesses
 */
function generateWeaknesses(assessment, categoryScores) {
  
  const weaknesses = [];
  
  if (categoryScores.get('education') < 5) {
    weaknesses.push('Limited educational credentials');
  }
  
  if (categoryScores.get('language') < 5) {
    weaknesses.push('Language proficiency needs improvement');
  }
  
  if (categoryScores.get('work') < 5) {
    weaknesses.push('Limited relevant work experience');
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push('Limited knowledge of Canadian immigration system');
  }
  
  return weaknesses;
}

/**
 * Generate next steps based on assessment
 * @param {Object} assessment - Assessment object
 * @param {Array} pathways - Recommended pathways
 * @returns {Array} - Next steps
 */
function generateNextSteps(assessment, pathways) {
  
  const eligiblePathways = pathways.filter(p => p.eligibility === 'eligible');
  const potentialPathways = pathways.filter(p => p.eligibility === 'potentially_eligible');
  
  const nextSteps = [];
  
  if (eligiblePathways.length > 0) {
    nextSteps.push(`Apply for ${eligiblePathways[0].name} as your primary option`);
  }
  
  if (potentialPathways.length > 0) {
    nextSteps.push(`Improve your profile to increase eligibility for ${potentialPathways[0].name}`);
  }
  
  nextSteps.push('Complete your profile on ThinkForward AI');
  nextSteps.push('Consult with an immigration professional for personalized advice');
  
  return nextSteps;
}
