/**
 * Profile service for user profile management
 */
const Profile = require('../models/Profile');
const User = require('../models/User');
const { translateError } = require('../utils/errorHandler');

/**
 * Fetch user profile by userId
 * @param {string} userId - User ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - User profile
 */
exports.fetchProfile = async (userId, locale = 'en') => {
  try {
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return null;
    }
    
    return profile;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Create or update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.saveProfile = async (userId, profileData, locale = 'en') => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = new Profile({
        userId,
        ...profileData
      });
    } else {
      Object.keys(profileData).forEach(key => {
        profile[key] = profileData[key];
      });
    }
    
    await profile.save();
    
    return profile;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Update specific section of user profile
 * @param {string} userId - User ID
 * @param {string} section - Profile section to update
 * @param {Object} sectionData - Section data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.updateProfileSection = async (userId, section, sectionData, locale = 'en') => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      const profileData = {};
      profileData[section] = sectionData;
      
      profile = new Profile({
        userId,
        ...profileData
      });
    } else {
      profile[section] = sectionData;
    }
    
    await profile.save();
    
    return profile;
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};

/**
 * Update personal information
 * @param {string} userId - User ID
 * @param {Object} personalInfo - Personal information data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.updatePersonalInfo = async (userId, personalInfo, locale = 'en') => {
  let addressData = null;
  if (personalInfo.address) {
    addressData = personalInfo.address;
    delete personalInfo.address;
  }
  
  const profile = await exports.updateProfileSection(userId, 'personalInfo', personalInfo, locale);
  
  if (addressData) {
    await exports.updateProfileSection(userId, 'address', addressData, locale);
  }
  
  return profile;
};

/**
 * Update education information
 * @param {string} userId - User ID
 * @param {Object} educationInfo - Education information data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.updateEducationInfo = async (userId, educationInfo, locale = 'en') => {
  return await exports.updateProfileSection(userId, 'educationInfo', educationInfo, locale);
};

/**
 * Update work experience
 * @param {string} userId - User ID
 * @param {Object} workExperience - Work experience data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.updateWorkExperience = async (userId, workExperience, locale = 'en') => {
  return await exports.updateProfileSection(userId, 'workExperience', workExperience, locale);
};

/**
 * Update language skills
 * @param {string} userId - User ID
 * @param {Object} languageSkills - Language skills data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.updateLanguageSkills = async (userId, languageSkills, locale = 'en') => {
  return await exports.updateProfileSection(userId, 'languageSkills', languageSkills, locale);
};

/**
 * Update immigration information
 * @param {string} userId - User ID
 * @param {Object} immigrationInfo - Immigration information data
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Updated profile
 */
exports.updateImmigrationInfo = async (userId, immigrationInfo, locale = 'en') => {
  return await exports.updateProfileSection(userId, 'immigrationInfo', immigrationInfo, locale);
};

/**
 * Get profile completion status
 * @param {string} userId - User ID
 * @param {string} locale - User locale
 * @returns {Promise<Object>} - Completion status
 */
exports.getCompletionStatus = async (userId, locale = 'en') => {
  try {
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return {
        personalInfo: false,
        educationInfo: false,
        workExperience: false,
        languageSkills: false,
        immigrationInfo: false,
        overall: false
      };
    }
    
    profile.updateCompletionStatus();
    
    return {
      ...profile.completionStatus,
      overall: profile.isComplete()
    };
  } catch (error) {
    const translatedError = translateError(error, locale);
    throw translatedError;
  }
};
