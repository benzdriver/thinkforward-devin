/**
 * Pathway service for managing immigration pathways
 */
const Pathway = require('../../models/pathway/Pathway');
const { translateError } = require('../../utils/errorHandler');

/**
 * Get all pathways
 * @param {Object} filters - Filter criteria
 * @param {string} locale - User locale
 * @returns {Promise<Array>} - List of pathways
 */
exports.getAllPathways = async (filters = {}, locale = 'en') => {
  try {
    const query = { isActive: true };
    
    if (filters.country) {
      query.country = filters.country;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    const pathways = await Pathway.find(query).sort({ popularity: -1 });
    
    return pathways.map(pathway => {
      const translation = pathway.getTranslation(locale);
      
      return {
        id: pathway._id,
        code: pathway.code,
        name: translation.name,
        country: pathway.country,
        category: pathway.category,
        description: translation.description,
        processingTime: pathway.processingTime,
        applicationFee: pathway.applicationFee,
        popularity: pathway.popularity,
        successRate: pathway.successRate,
        officialLink: pathway.officialLink
      };
    });
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get pathway by ID
 * @param {string} pathwayId - Pathway ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Pathway details
 */
exports.getPathwayById = async (pathwayId, locale = 'en') => {
  try {
    const pathway = await Pathway.findById(pathwayId);
    
    if (!pathway) {
      const error = new Error('Pathway not found');
      error.statusCode = 404;
      throw error;
    }
    
    const translation = pathway.getTranslation(locale);
    
    return {
      id: pathway._id,
      code: pathway.code,
      name: translation.name,
      country: pathway.country,
      category: pathway.category,
      description: translation.description,
      eligibilityCriteria: translation.eligibilityCriteria,
      processingTime: pathway.processingTime,
      applicationFee: pathway.applicationFee,
      requiredDocuments: translation.requiredDocuments,
      steps: translation.steps,
      popularity: pathway.popularity,
      successRate: pathway.successRate,
      officialLink: pathway.officialLink
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get pathway by code
 * @param {string} code - Pathway code
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Pathway details
 */
exports.getPathwayByCode = async (code, locale = 'en') => {
  try {
    const pathway = await Pathway.findOne({ code });
    
    if (!pathway) {
      const error = new Error('Pathway not found');
      error.statusCode = 404;
      throw error;
    }
    
    const translation = pathway.getTranslation(locale);
    
    return {
      id: pathway._id,
      code: pathway.code,
      name: translation.name,
      country: pathway.country,
      category: pathway.category,
      description: translation.description,
      eligibilityCriteria: translation.eligibilityCriteria,
      processingTime: pathway.processingTime,
      applicationFee: pathway.applicationFee,
      requiredDocuments: translation.requiredDocuments,
      steps: translation.steps,
      popularity: pathway.popularity,
      successRate: pathway.successRate,
      officialLink: pathway.officialLink
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Check pathway eligibility for a user
 * @param {string} pathwayId - Pathway ID
 * @param {string} userId - User ID
 * @param {Object} profileData - User profile data (optional)
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Eligibility result
 */
exports.checkEligibility = async (pathwayId, userId, profileData = null, locale = 'en') => {
  try {
    const pathway = await Pathway.findById(pathwayId);
    
    if (!pathway) {
      const error = new Error('Pathway not found');
      error.statusCode = 404;
      throw error;
    }
    
    let userProfile = profileData;
    
    if (!userProfile) {
      userProfile = {
        personalInfo: {
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: new Date('1990-01-01'),
          nationality: 'India',
          countryOfResidence: 'India'
        },
        educationInfo: [
          {
            highestDegree: 'Bachelor',
            institution: 'Test University',
            graduationYear: 2015,
            fieldOfStudy: 'Computer Science',
            country: 'India',
            completed: true
          }
        ],
        workExperience: [
          {
            company: 'Test Company',
            position: 'Software Developer',
            startDate: new Date('2015-06-01'),
            endDate: new Date('2020-06-01'),
            isCurrentJob: false,
            description: 'Developed web applications',
            country: 'India',
            nocCode: '2174'
          }
        ],
        languageSkills: [
          {
            language: 'English',
            proficiencyLevel: 'advanced',
            readingScore: 8,
            writingScore: 7,
            speakingScore: 7,
            listeningScore: 8,
            testType: 'ielts',
            testDate: new Date('2020-01-01')
          }
        ],
        immigrationInfo: {
          interestedPrograms: ['Express Entry', 'Provincial Nominee Program'],
          preferredDestination: 'Canada',
          immigrationStatus: 'none',
          previousApplications: []
        }
      };
    }
    
    const eligibilityResult = pathway.checkEligibility(userProfile);
    
    const translation = pathway.getTranslation(locale);
    
    const translateCriteriaName = (result, criteria) => {
      const translatedCriteria = translation.eligibilityCriteria.find(
        c => c.name === criteria.name
      );
      
      if (translatedCriteria) {
        result.name = translatedCriteria.name;
      }
      
      return result;
    };
    
    if (translation.eligibilityCriteria) {
      eligibilityResult.results.required = eligibilityResult.results.required.map((result, index) => {
        const criteria = pathway.eligibilityCriteria.filter(c => c.type === 'required')[index];
        return translateCriteriaName(result, criteria);
      });
      
      eligibilityResult.results.optional = eligibilityResult.results.optional.map((result, index) => {
        const criteria = pathway.eligibilityCriteria.filter(c => c.type === 'optional')[index];
        return translateCriteriaName(result, criteria);
      });
      
      eligibilityResult.results.bonus = eligibilityResult.results.bonus.map((result, index) => {
        const criteria = pathway.eligibilityCriteria.filter(c => c.type === 'bonus')[index];
        return translateCriteriaName(result, criteria);
      });
    }
    
    return {
      pathwayId,
      pathwayName: translation.name,
      userId,
      ...eligibilityResult
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get recommended pathways for a user
 * @param {string} userId - User ID
 * @param {Object} profileData - User profile data (optional)
 * @param {string} locale - User locale
 * @returns {Promise<Array>} - Recommended pathways
 */
exports.getRecommendedPathways = async (userId, profileData = null, locale = 'en') => {
  try {
    const pathways = await Pathway.find({ isActive: true });
    
    let userProfile = profileData;
    
    if (!userProfile) {
      userProfile = {
        personalInfo: {
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: new Date('1990-01-01'),
          nationality: 'India',
          countryOfResidence: 'India'
        },
        educationInfo: [
          {
            highestDegree: 'Bachelor',
            institution: 'Test University',
            graduationYear: 2015,
            fieldOfStudy: 'Computer Science',
            country: 'India',
            completed: true
          }
        ],
        workExperience: [
          {
            company: 'Test Company',
            position: 'Software Developer',
            startDate: new Date('2015-06-01'),
            endDate: new Date('2020-06-01'),
            isCurrentJob: false,
            description: 'Developed web applications',
            country: 'India',
            nocCode: '2174'
          }
        ],
        languageSkills: [
          {
            language: 'English',
            proficiencyLevel: 'advanced',
            readingScore: 8,
            writingScore: 7,
            speakingScore: 7,
            listeningScore: 8,
            testType: 'ielts',
            testDate: new Date('2020-01-01')
          }
        ],
        immigrationInfo: {
          interestedPrograms: ['Express Entry', 'Provincial Nominee Program'],
          preferredDestination: 'Canada',
          immigrationStatus: 'none',
          previousApplications: []
        }
      };
    }
    
    const recommendations = await Promise.all(
      pathways.map(async (pathway) => {
        const eligibilityResult = pathway.checkEligibility(userProfile);
        const translation = pathway.getTranslation(locale);
        
        return {
          id: pathway._id,
          code: pathway.code,
          name: translation.name,
          country: pathway.country,
          category: pathway.category,
          description: translation.description,
          eligibility: eligibilityResult.status,
          points: eligibilityResult.points,
          maxPoints: eligibilityResult.maxPoints,
          matchPercentage: Math.round((eligibilityResult.points / eligibilityResult.maxPoints) * 100) || 0,
          processingTime: pathway.processingTime,
          applicationFee: pathway.applicationFee,
          popularity: pathway.popularity,
          successRate: pathway.successRate
        };
      })
    );
    
    return recommendations.sort((a, b) => {
      const statusOrder = { eligible: 0, potentially_eligible: 1, not_eligible: 2 };
      const statusDiff = statusOrder[a.eligibility] - statusOrder[b.eligibility];
      
      if (statusDiff !== 0) {
        return statusDiff;
      }
      
      return b.matchPercentage - a.matchPercentage;
    });
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get pathway categories
 * @param {string} country - Country code
 * @param {string} locale - User locale
 * @returns {Promise<Array>} - Pathway categories
 */
exports.getPathwayCategories = async (country = null, locale = 'en') => {
  try {
    const query = { isActive: true };
    
    if (country) {
      query.country = country;
    }
    
    const pathways = await Pathway.find(query);
    const categories = [...new Set(pathways.map(p => p.category))];
    
    return categories.map(category => {
      const categoryInfo = {
        id: category,
        name: getCategoryName(category, locale),
        description: getCategoryDescription(category, locale),
        count: pathways.filter(p => p.category === category).length
      };
      
      return categoryInfo;
    });
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get pathway countries
 * @param {string} locale - User locale
 * @returns {Promise<Array>} - Pathway countries
 */
exports.getPathwayCountries = async (locale = 'en') => {
  try {
    const pathways = await Pathway.find({ isActive: true });
    const countries = [...new Set(pathways.map(p => p.country))];
    
    return countries.map(country => {
      const countryInfo = {
        code: country,
        name: getCountryName(country, locale),
        count: pathways.filter(p => p.country === country).length
      };
      
      return countryInfo;
    });
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Create a new pathway (admin only)
 * @param {Object} pathwayData - Pathway data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Created pathway
 */
exports.createPathway = async (pathwayData, locale = 'en') => {
  try {
    const existingPathway = await Pathway.findOne({ code: pathwayData.code });
    
    if (existingPathway) {
      const error = new Error('Pathway with this code already exists');
      error.statusCode = 400;
      throw error;
    }
    
    const pathway = new Pathway(pathwayData);
    await pathway.save();
    
    return pathway;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Update pathway (admin only)
 * @param {string} pathwayId - Pathway ID
 * @param {Object} pathwayData - Updated pathway data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated pathway
 */
exports.updatePathway = async (pathwayId, pathwayData, locale = 'en') => {
  try {
    const pathway = await Pathway.findById(pathwayId);
    
    if (!pathway) {
      const error = new Error('Pathway not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (pathwayData.code && pathwayData.code !== pathway.code) {
      const existingPathway = await Pathway.findOne({ code: pathwayData.code });
      
      if (existingPathway) {
        const error = new Error('Pathway with this code already exists');
        error.statusCode = 400;
        throw error;
      }
    }
    
    Object.keys(pathwayData).forEach(key => {
      pathway[key] = pathwayData[key];
    });
    
    await pathway.save();
    
    return pathway;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Delete pathway (admin only)
 * @param {string} pathwayId - Pathway ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Deletion result
 */
exports.deletePathway = async (pathwayId, locale = 'en') => {
  try {
    const result = await Pathway.findByIdAndDelete(pathwayId);
    
    if (!result) {
      const error = new Error('Pathway not found');
      error.statusCode = 404;
      throw error;
    }
    
    return { success: true, message: 'Pathway deleted successfully' };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Get category name
 * @param {string} category - Category ID
 * @param {string} locale - User locale
 * @returns {string} - Category name
 */
function getCategoryName(category, locale = 'en') {
  const categoryNames = {
    federal: {
      en: 'Federal Programs',
      fr: 'Programmes fédéraux'
    },
    provincial: {
      en: 'Provincial Programs',
      fr: 'Programmes provinciaux'
    },
    regional: {
      en: 'Regional Programs',
      fr: 'Programmes régionaux'
    },
    business: {
      en: 'Business Immigration',
      fr: 'Immigration d\'affaires'
    },
    family: {
      en: 'Family Sponsorship',
      fr: 'Parrainage familial'
    },
    humanitarian: {
      en: 'Humanitarian Programs',
      fr: 'Programmes humanitaires'
    },
    other: {
      en: 'Other Programs',
      fr: 'Autres programmes'
    }
  };
  
  return categoryNames[category]?.[locale] || categoryNames[category]?.['en'] || category;
}

/**
 * Get category description
 * @param {string} category - Category ID
 * @param {string} locale - User locale
 * @returns {string} - Category description
 */
function getCategoryDescription(category, locale = 'en') {
  const categoryDescriptions = {
    federal: {
      en: 'Immigration programs managed by the federal government',
      fr: 'Programmes d\'immigration gérés par le gouvernement fédéral'
    },
    provincial: {
      en: 'Immigration programs managed by provincial governments',
      fr: 'Programmes d\'immigration gérés par les gouvernements provinciaux'
    },
    regional: {
      en: 'Immigration programs targeting specific regions',
      fr: 'Programmes d\'immigration ciblant des régions spécifiques'
    },
    business: {
      en: 'Programs for entrepreneurs, investors, and self-employed individuals',
      fr: 'Programmes pour entrepreneurs, investisseurs et travailleurs autonomes'
    },
    family: {
      en: 'Programs for sponsoring family members',
      fr: 'Programmes de parrainage des membres de la famille'
    },
    humanitarian: {
      en: 'Programs for refugees and humanitarian cases',
      fr: 'Programmes pour les réfugiés et les cas humanitaires'
    },
    other: {
      en: 'Other immigration programs',
      fr: 'Autres programmes d\'immigration'
    }
  };
  
  return categoryDescriptions[category]?.[locale] || categoryDescriptions[category]?.['en'] || '';
}

/**
 * Get country name
 * @param {string} countryCode - Country code
 * @param {string} locale - User locale
 * @returns {string} - Country name
 */
function getCountryName(countryCode, locale = 'en') {
  const countryNames = {
    CA: {
      en: 'Canada',
      fr: 'Canada'
    },
    US: {
      en: 'United States',
      fr: 'États-Unis'
    },
    AU: {
      en: 'Australia',
      fr: 'Australie'
    },
    NZ: {
      en: 'New Zealand',
      fr: 'Nouvelle-Zélande'
    },
    UK: {
      en: 'United Kingdom',
      fr: 'Royaume-Uni'
    }
  };
  
  return countryNames[countryCode]?.[locale] || countryNames[countryCode]?.['en'] || countryCode;
}
