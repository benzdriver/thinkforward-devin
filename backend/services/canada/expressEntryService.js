const ExpressEntryProfile = require('../../models/canada/ExpressEntryProfile');
const { fetchLatestDraws } = require('../../utils/canadaApiClient');
const { calculateCoreHumanCapitalPoints, calculateSpousePoints, calculateAdditionalPoints } = require('../../utils/pointsCalculator');

/**
 * Calculate Comprehensive Ranking System (CRS) points for Express Entry
 * @param {Object} profile - Express Entry profile
 * @returns {Promise<number>} - Total CRS points
 */
exports.calculatePoints = async (profile) => {
  try {
    const corePoints = calculateCoreHumanCapitalPoints(profile);
    
    const spousePoints = profile.maritalStatus === 'married' && profile.spouseProfile 
      ? calculateSpousePoints(profile.spouseProfile) 
      : 0;
    
    const additionalPoints = calculateAdditionalPoints(profile);
    
    const totalPoints = corePoints + spousePoints + additionalPoints;
    
    return Math.min(1200, totalPoints); // Maximum CRS score is 1200
  } catch (error) {
    console.error('Error calculating Express Entry points:', error);
    throw error;
  }
};

/**
 * Get detailed breakdown of points calculation
 * @param {Object} profile - Express Entry profile
 * @returns {Object} - Points breakdown by category
 */
exports.getPointsBreakdown = (profile) => {
  const breakdown = {
    coreHumanCapital: {
      age: calculateAgePoints(profile),
      education: calculateEducationPoints(profile),
      languageProficiency: calculateLanguagePoints(profile),
      canadianWorkExperience: calculateCanadianWorkExperiencePoints(profile),
      subtotal: 0
    },
    spouse: {
      education: 0,
      languageProficiency: 0,
      canadianWorkExperience: 0,
      subtotal: 0
    },
    skillTransferability: {
      education: calculateEducationTransferabilityPoints(profile),
      foreignWorkExperience: calculateForeignWorkExperiencePoints(profile),
      certificateOfQualification: calculateCertificatePoints(profile),
      subtotal: 0
    },
    additional: {
      provincialNomination: profile.hasProvincialNomination ? 600 : 0,
      jobOffer: calculateJobOfferPoints(profile),
      canadianEducation: calculateCanadianEducationPoints(profile),
      frenchLanguageSkills: calculateFrenchLanguagePoints(profile),
      sibling: profile.adaptabilityFactors?.relativesInCanada?.has ? 15 : 0,
      subtotal: 0
    }
  };
  
  breakdown.coreHumanCapital.subtotal = 
    breakdown.coreHumanCapital.age + 
    breakdown.coreHumanCapital.education + 
    breakdown.coreHumanCapital.languageProficiency + 
    breakdown.coreHumanCapital.canadianWorkExperience;
  
  if (profile.maritalStatus === 'married' && profile.spouseProfile) {
    breakdown.spouse.education = calculateSpouseEducationPoints(profile.spouseProfile);
    breakdown.spouse.languageProficiency = calculateSpouseLanguagePoints(profile.spouseProfile);
    breakdown.spouse.canadianWorkExperience = calculateSpouseWorkExperiencePoints(profile.spouseProfile);
    breakdown.spouse.subtotal = 
      breakdown.spouse.education + 
      breakdown.spouse.languageProficiency + 
      breakdown.spouse.canadianWorkExperience;
  }
  
  breakdown.skillTransferability.subtotal = 
    breakdown.skillTransferability.education + 
    breakdown.skillTransferability.foreignWorkExperience + 
    breakdown.skillTransferability.certificateOfQualification;
  
  breakdown.additional.subtotal = 
    breakdown.additional.provincialNomination + 
    breakdown.additional.jobOffer + 
    breakdown.additional.canadianEducation + 
    breakdown.additional.frenchLanguageSkills + 
    breakdown.additional.sibling;
  
  return breakdown;
};

/**
 * Check eligibility for Express Entry programs
 * @param {Object} profile - Express Entry profile
 * @returns {Promise<Object>} - Eligibility results
 */
exports.checkEligibility = async (profile) => {
  try {
    const eligibility = {
      isEligible: false,
      eligiblePrograms: [],
      reasons: []
    };
    
    const fswpEligibility = checkFSWPEligibility(profile);
    if (fswpEligibility.isEligible) {
      eligibility.eligiblePrograms.push('FSWP');
    } else {
      eligibility.reasons.push(...fswpEligibility.reasons);
    }
    
    const cecEligibility = checkCECEligibility(profile);
    if (cecEligibility.isEligible) {
      eligibility.eligiblePrograms.push('CEC');
    } else {
      eligibility.reasons.push(...cecEligibility.reasons);
    }
    
    const fstpEligibility = checkFSTPEligibility(profile);
    if (fstpEligibility.isEligible) {
      eligibility.eligiblePrograms.push('FSTP');
    } else {
      eligibility.reasons.push(...fstpEligibility.reasons);
    }
    
    eligibility.isEligible = eligibility.eligiblePrograms.length > 0;
    
    return eligibility;
  } catch (error) {
    console.error('Error checking Express Entry eligibility:', error);
    throw error;
  }
};

/**
 * Get latest Express Entry draw information
 * @returns {Promise<Array>} - Latest Express Entry draws
 */
exports.getLatestDraws = async () => {
  try {
    const draws = await fetchLatestDraws();
    return draws;
  } catch (error) {
    console.error('Error fetching Express Entry draws:', error);
    throw error;
  }
};

/**
 * Save or update Express Entry profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to save
 * @returns {Promise<Object>} - Saved profile
 */
exports.saveProfile = async (userId, profileData) => {
  try {
    let profile = await ExpressEntryProfile.findOne({ userId });
    
    if (profile) {
      Object.assign(profile, profileData);
    } else {
      profile = new ExpressEntryProfile({
        userId,
        ...profileData
      });
    }
    
    await profile.save();
    return profile;
  } catch (error) {
    console.error('Error saving Express Entry profile:', error);
    throw error;
  }
};

/**
 * Get user's Express Entry profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User's profile
 */
exports.getProfile = async (userId) => {
  try {
    const profile = await ExpressEntryProfile.findOne({ userId });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  } catch (error) {
    console.error('Error fetching Express Entry profile:', error);
    throw error;
  }
};

/**
 * Get quick estimate of CRS score based on basic information
 * @param {Object} basicInfo - Basic profile information
 * @returns {Promise<number>} - Estimated CRS score
 */
exports.getQuickEstimate = async (basicInfo) => {
  try {
    const simplifiedProfile = {
      age: getAgeFromRange(basicInfo.age),
      maritalStatus: 'single', // Assume single for quick estimate
      languageProficiency: [
        {
          language: 'english',
          test: 'IELTS',
          speaking: getCLBEquivalentScore('speaking', basicInfo.languageProficiency),
          listening: getCLBEquivalentScore('listening', basicInfo.languageProficiency),
          reading: getCLBEquivalentScore('reading', basicInfo.languageProficiency),
          writing: getCLBEquivalentScore('writing', basicInfo.languageProficiency)
        }
      ],
      education: [
        {
          level: basicInfo.education,
          field: 'General',
          country: 'Unknown'
        }
      ],
      workExperience: []
    };
    
    if (basicInfo.canadianWorkExperience && basicInfo.canadianWorkExperience !== 'none') {
      const years = getYearsFromRange(basicInfo.canadianWorkExperience);
      simplifiedProfile.workExperience.push({
        occupation: {
          title: 'General'
        },
        employer: 'Unknown',
        country: 'Canada',
        isCanadianExperience: true,
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - years)),
        endDate: new Date(),
        hoursPerWeek: 40
      });
    }
    
    const score = await exports.calculatePoints(simplifiedProfile);
    
    return score;
  } catch (error) {
    console.error('Error calculating quick estimate:', error);
    throw error;
  }
};

function calculateAgePoints(profile) {
  const age = profile.age;
  
  if (profile.maritalStatus === 'single' || !profile.spouseProfile) {
    if (age <= 17) return 0;
    if (age === 18) return 99;
    if (age === 19) return 105;
    if (age >= 20 && age <= 29) return 110;
    if (age === 30) return 105;
    if (age === 31) return 99;
    if (age === 32) return 94;
    if (age === 33) return 88;
    if (age === 34) return 83;
    if (age === 35) return 77;
    if (age === 36) return 72;
    if (age === 37) return 66;
    if (age === 38) return 61;
    if (age === 39) return 55;
    if (age === 40) return 50;
    if (age === 41) return 39;
    if (age === 42) return 28;
    if (age === 43) return 17;
    if (age === 44) return 6;
    if (age >= 45) return 0;
  } else {
    if (age <= 17) return 0;
    if (age === 18) return 90;
    if (age === 19) return 95;
    if (age >= 20 && age <= 29) return 100;
    if (age === 30) return 95;
    if (age === 31) return 90;
    if (age === 32) return 85;
    if (age === 33) return 80;
    if (age === 34) return 75;
    if (age === 35) return 70;
    if (age === 36) return 65;
    if (age === 37) return 60;
    if (age === 38) return 55;
    if (age === 39) return 50;
    if (age === 40) return 45;
    if (age === 41) return 35;
    if (age === 42) return 25;
    if (age === 43) return 15;
    if (age === 44) return 5;
    if (age >= 45) return 0;
  }
}

function calculateEducationPoints(profile) {
  if (!profile.education || profile.education.length === 0) return 0;
  
  const educationLevels = {
    'highSchool': profile.maritalStatus === 'single' ? 30 : 28,
    'oneYearDiploma': profile.maritalStatus === 'single' ? 90 : 84,
    'twoYearDiploma': profile.maritalStatus === 'single' ? 98 : 91,
    'bachelors': profile.maritalStatus === 'single' ? 120 : 112,
    'twoOrMoreDegrees': profile.maritalStatus === 'single' ? 128 : 119,
    'masters': profile.maritalStatus === 'single' ? 135 : 126,
    'phd': profile.maritalStatus === 'single' ? 150 : 140
  };
  
  let highestPoints = 0;
  
  profile.education.forEach(edu => {
    const points = educationLevels[edu.level] || 0;
    if (points > highestPoints) {
      highestPoints = points;
    }
  });
  
  return highestPoints;
}

function calculateLanguagePoints(profile) {
  if (!profile.languageProficiency || profile.languageProficiency.length === 0) return 0;
  
  let firstLanguagePoints = 0;
  let secondLanguagePoints = 0;
  
  profile.languageProficiency.forEach(lang => {
    if (!lang.clbEquivalent) return;
    
    const clb = Math.min(
      lang.clbEquivalent.speaking,
      lang.clbEquivalent.listening,
      lang.clbEquivalent.reading,
      lang.clbEquivalent.writing
    );
    
    const points = calculateLanguagePointsForCLB(clb, profile.maritalStatus === 'single');
    
    if (points > firstLanguagePoints) {
      firstLanguagePoints = points;
      
      if (firstLanguagePoints > 0 && lang.language !== profile.languageProficiency[0].language) {
        secondLanguagePoints = calculateSecondLanguagePoints(lang.clbEquivalent);
      }
    }
  });
  
  return firstLanguagePoints + secondLanguagePoints;
}

function calculateLanguagePointsForCLB(clb, isSingle) {
  if (clb < 4) return 0;
  if (clb === 4) return isSingle ? 6 : 6;
  if (clb === 5) return isSingle ? 6 : 6;
  if (clb === 6) return isSingle ? 9 : 8;
  if (clb === 7) return isSingle ? 17 : 16;
  if (clb === 8) return isSingle ? 23 : 22;
  if (clb === 9) return isSingle ? 31 : 29;
  if (clb >= 10) return isSingle ? 34 : 32;
  return 0;
}

function calculateSecondLanguagePoints(clbEquivalent) {
  const minCLB = Math.min(
    clbEquivalent.speaking,
    clbEquivalent.listening,
    clbEquivalent.reading,
    clbEquivalent.writing
  );
  
  if (minCLB < 4) return 0;
  if (minCLB === 4) return 0;
  if (minCLB === 5) return 1;
  if (minCLB === 6) return 1;
  if (minCLB === 7) return 3;
  if (minCLB === 8) return 3;
  if (minCLB >= 9) return 6;
  return 0;
}

function calculateCanadianWorkExperiencePoints(profile) {
  if (!profile.workExperience || profile.workExperience.length === 0) return 0;
  
  let totalMonths = 0;
  
  profile.workExperience.forEach(exp => {
    if (exp.isCanadianExperience && exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      if (exp.hoursPerWeek >= 30) {
        totalMonths += months;
      } else if (exp.hoursPerWeek >= 15) {
        totalMonths += months / 2;
      }
    }
  });
  
  const years = Math.floor(totalMonths / 12);
  
  if (profile.maritalStatus === 'single' || !profile.spouseProfile) {
    if (years === 0) return 0;
    if (years === 1) return 40;
    if (years === 2) return 53;
    if (years === 3) return 64;
    if (years === 4) return 72;
    if (years >= 5) return 80;
  } else {
    if (years === 0) return 0;
    if (years === 1) return 35;
    if (years === 2) return 46;
    if (years === 3) return 56;
    if (years === 4) return 63;
    if (years >= 5) return 70;
  }
  
  return 0;
}

function calculateEducationTransferabilityPoints(profile) {
  if (!profile.education || profile.education.length === 0 || !profile.languageProficiency || profile.languageProficiency.length === 0) return 0;
  
  const educationLevels = {
    'highSchool': 0,
    'oneYearDiploma': 0,
    'twoYearDiploma': 0,
    'bachelors': 1,
    'twoOrMoreDegrees': 1,
    'masters': 1,
    'phd': 1
  };
  
  let hasDegree = false;
  
  profile.education.forEach(edu => {
    if (educationLevels[edu.level] === 1) {
      hasDegree = true;
    }
  });
  
  if (!hasDegree) return 0;
  
  let highestCLB = 0;
  
  profile.languageProficiency.forEach(lang => {
    if (!lang.clbEquivalent) return;
    
    const clb = Math.min(
      lang.clbEquivalent.speaking,
      lang.clbEquivalent.listening,
      lang.clbEquivalent.reading,
      lang.clbEquivalent.writing
    );
    
    if (clb > highestCLB) {
      highestCLB = clb;
    }
  });
  
  if (highestCLB >= 9) {
    return 50;
  } else if (highestCLB >= 7) {
    return 25;
  }
  
  return 0;
}

function calculateForeignWorkExperiencePoints(profile) {
  if (!profile.workExperience || profile.workExperience.length === 0 || !profile.languageProficiency || profile.languageProficiency.length === 0) return 0;
  
  let totalMonths = 0;
  
  profile.workExperience.forEach(exp => {
    if (!exp.isCanadianExperience && exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      if (exp.hoursPerWeek >= 30) {
        totalMonths += months;
      } else if (exp.hoursPerWeek >= 15) {
        totalMonths += months / 2;
      }
    }
  });
  
  const years = Math.floor(totalMonths / 12);
  
  if (years < 1) return 0;
  
  let highestCLB = 0;
  
  profile.languageProficiency.forEach(lang => {
    if (!lang.clbEquivalent) return;
    
    const clb = Math.min(
      lang.clbEquivalent.speaking,
      lang.clbEquivalent.listening,
      lang.clbEquivalent.reading,
      lang.clbEquivalent.writing
    );
    
    if (clb > highestCLB) {
      highestCLB = clb;
    }
  });
  
  if (years >= 3) {
    if (highestCLB >= 9) {
      return 50;
    } else if (highestCLB >= 7) {
      return 25;
    }
  } else if (years >= 1) {
    if (highestCLB >= 9) {
      return 25;
    } else if (highestCLB >= 7) {
      return 13;
    }
  }
  
  return 0;
}

function calculateCertificatePoints(profile) {
  if (profile.education && profile.education.some(edu => edu.level === 'certificate')) {
    let highestCLB = 0;
    
    if (profile.languageProficiency) {
      profile.languageProficiency.forEach(lang => {
        if (!lang.clbEquivalent) return;
        
        const clb = Math.min(
          lang.clbEquivalent.speaking,
          lang.clbEquivalent.listening,
          lang.clbEquivalent.reading,
          lang.clbEquivalent.writing
        );
        
        if (clb > highestCLB) {
          highestCLB = clb;
        }
      });
    }
    
    if (highestCLB >= 9) {
      return 50;
    } else if (highestCLB >= 7) {
      return 25;
    } else if (highestCLB >= 5) {
      return 0;
    }
  }
  
  return 0;
}

function calculateJobOfferPoints(profile) {
  if (!profile.hasJobOffer) return 0;
  
  if (profile.jobOfferDetails && profile.jobOfferDetails.lmiaExempt) {
    return 0; // No points for LMIA-exempt job offers
  }
  
  if (profile.jobOfferDetails && profile.jobOfferDetails.noc && profile.jobOfferDetails.noc.startsWith('00')) {
    return 200;
  }
  
  if (profile.jobOfferDetails && profile.jobOfferDetails.noc) {
    const firstChar = profile.jobOfferDetails.noc.charAt(0);
    if (firstChar === '0' || firstChar === '1' || firstChar === '2' || firstChar === '3') {
      return 50;
    }
  }
  
  return 0;
}

function calculateCanadianEducationPoints(profile) {
  if (!profile.education || profile.education.length === 0) return 0;
  
  const canadianEducation = profile.education.filter(edu => edu.country === 'Canada');
  
  if (canadianEducation.length === 0) return 0;
  
  const educationLevels = {
    'highSchool': 0,
    'oneYearDiploma': 15,
    'twoYearDiploma': 30,
    'bachelors': 30,
    'twoOrMoreDegrees': 30,
    'masters': 30,
    'phd': 30
  };
  
  let highestPoints = 0;
  
  canadianEducation.forEach(edu => {
    const points = educationLevels[edu.level] || 0;
    if (points > highestPoints) {
      highestPoints = points;
    }
  });
  
  return highestPoints;
}

function calculateFrenchLanguagePoints(profile) {
  if (!profile.languageProficiency || profile.languageProficiency.length === 0) return 0;
  
  const frenchProficiency = profile.languageProficiency.find(lang => lang.language === 'french');
  
  if (!frenchProficiency || !frenchProficiency.clbEquivalent) return 0;
  
  const frenchCLB = Math.min(
    frenchProficiency.clbEquivalent.speaking,
    frenchProficiency.clbEquivalent.listening,
    frenchProficiency.clbEquivalent.reading,
    frenchProficiency.clbEquivalent.writing
  );
  
  const englishProficiency = profile.languageProficiency.find(lang => lang.language === 'english');
  
  let englishCLB = 0;
  
  if (englishProficiency && englishProficiency.clbEquivalent) {
    englishCLB = Math.min(
      englishProficiency.clbEquivalent.speaking,
      englishProficiency.clbEquivalent.listening,
      englishProficiency.clbEquivalent.reading,
      englishProficiency.clbEquivalent.writing
    );
  }
  
  if (frenchCLB >= 7 && englishCLB >= 5) {
    return 50;
  } else if (frenchCLB >= 7 && englishCLB < 5) {
    return 25;
  }
  
  return 0;
}

function calculateSpouseEducationPoints(spouseProfile) {
  if (!spouseProfile.education) return 0;
  
  const educationLevels = {
    'highSchool': 2,
    'oneYearDiploma': 6,
    'twoYearDiploma': 7,
    'bachelors': 8,
    'twoOrMoreDegrees': 9,
    'masters': 10,
    'phd': 10
  };
  
  return educationLevels[spouseProfile.education.level] || 0;
}

function calculateSpouseLanguagePoints(spouseProfile) {
  if (!spouseProfile.languageProficiency || spouseProfile.languageProficiency.length === 0) return 0;
  
  let totalPoints = 0;
  
  spouseProfile.languageProficiency.forEach(lang => {
    if (!lang.clbEquivalent) return;
    
    if (lang.clbEquivalent.speaking >= 9) totalPoints += 5;
    else if (lang.clbEquivalent.speaking >= 7) totalPoints += 3;
    else if (lang.clbEquivalent.speaking >= 5) totalPoints += 1;
    
    if (lang.clbEquivalent.listening >= 9) totalPoints += 5;
    else if (lang.clbEquivalent.listening >= 7) totalPoints += 3;
    else if (lang.clbEquivalent.listening >= 5) totalPoints += 1;
    
    if (lang.clbEquivalent.reading >= 9) totalPoints += 5;
    else if (lang.clbEquivalent.reading >= 7) totalPoints += 3;
    else if (lang.clbEquivalent.reading >= 5) totalPoints += 1;
    
    if (lang.clbEquivalent.writing >= 9) totalPoints += 5;
    else if (lang.clbEquivalent.writing >= 7) totalPoints += 3;
    else if (lang.clbEquivalent.writing >= 5) totalPoints += 1;
  });
  
  return Math.min(20, totalPoints); // Maximum 20 points
}

function calculateSpouseWorkExperiencePoints(spouseProfile) {
  if (!spouseProfile.canadianWorkExperience || spouseProfile.canadianWorkExperience.length === 0) return 0;
  
  let totalMonths = 0;
  
  spouseProfile.canadianWorkExperience.forEach(exp => {
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      if (exp.hoursPerWeek >= 30) {
        totalMonths += months;
      } else if (exp.hoursPerWeek >= 15) {
        totalMonths += months / 2;
      }
    }
  });
  
  const years = Math.floor(totalMonths / 12);
  
  if (years >= 5) return 10;
  if (years >= 3) return 8;
  if (years >= 2) return 5;
  if (years >= 1) return 3;
  
  return 0;
}

function checkFSWPEligibility(profile) {
  const result = {
    isEligible: false,
    reasons: []
  };
  
  let hasEnoughWorkExperience = false;
  let totalMonths = 0;
  
  if (profile.workExperience && profile.workExperience.length > 0) {
    profile.workExperience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        if (exp.occupation && exp.occupation.noc) {
          const firstChar = exp.occupation.noc.charAt(0);
          if (firstChar === '0' || firstChar === '1' || firstChar === '2' || firstChar === '3') {
            const start = new Date(exp.startDate);
            const end = new Date(exp.endDate);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            
            if (exp.hoursPerWeek >= 30) {
              totalMonths += months;
            } else if (exp.hoursPerWeek >= 15) {
              totalMonths += months / 2;
            }
          }
        }
      }
    });
  }
  
  hasEnoughWorkExperience = totalMonths >= 12;
  
  if (!hasEnoughWorkExperience) {
    result.reasons.push('Insufficient skilled work experience (need at least 1 year)');
  }
  
  let hasLanguageProficiency = false;
  
  if (profile.languageProficiency && profile.languageProficiency.length > 0) {
    profile.languageProficiency.forEach(lang => {
      if (lang.clbEquivalent) {
        if (lang.clbEquivalent.speaking >= 7 &&
            lang.clbEquivalent.listening >= 7 &&
            lang.clbEquivalent.reading >= 7 &&
            lang.clbEquivalent.writing >= 7) {
          hasLanguageProficiency = true;
        }
      }
    });
  }
  
  if (!hasLanguageProficiency) {
    result.reasons.push('Insufficient language proficiency (need at least CLB 7 in all abilities)');
  }
  
  let hasEducation = false;
  
  if (profile.education && profile.education.length > 0) {
    hasEducation = true;
  }
  
  if (!hasEducation) {
    result.reasons.push('Insufficient education (need at least secondary education)');
  }
  
  
  result.isEligible = hasEnoughWorkExperience && hasLanguageProficiency && hasEducation;
  
  return result;
}

function checkCECEligibility(profile) {
  const result = {
    isEligible: false,
    reasons: []
  };
  
  let hasEnoughCanadianWorkExperience = false;
  let totalMonths = 0;
  
  if (profile.workExperience && profile.workExperience.length > 0) {
    profile.workExperience.forEach(exp => {
      if (exp.isCanadianExperience && exp.startDate && exp.endDate) {
        if (exp.occupation && exp.occupation.noc) {
          const firstChar = exp.occupation.noc.charAt(0);
          if (firstChar === '0' || firstChar === '1' || firstChar === '2' || firstChar === '3') {
            const start = new Date(exp.startDate);
            const end = new Date(exp.endDate);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            
            if (exp.hoursPerWeek >= 30) {
              totalMonths += months;
            } else if (exp.hoursPerWeek >= 15) {
              totalMonths += months / 2;
            }
          }
        }
      }
    });
  }
  
  hasEnoughCanadianWorkExperience = totalMonths >= 12;
  
  if (!hasEnoughCanadianWorkExperience) {
    result.reasons.push('Insufficient Canadian work experience (need at least 1 year)');
  }
  
  let hasLanguageProficiency = false;
  
  if (profile.languageProficiency && profile.languageProficiency.length > 0) {
    profile.languageProficiency.forEach(lang => {
      if (lang.clbEquivalent) {
        let requiredCLB = 7;
        
        if (profile.workExperience && profile.workExperience.length > 0) {
          profile.workExperience.forEach(exp => {
            if (exp.isCanadianExperience && exp.occupation && exp.occupation.noc) {
              const firstChar = exp.occupation.noc.charAt(0);
              if (firstChar === '3') {
                requiredCLB = 5;
              }
            }
          });
        }
        
        if (lang.clbEquivalent.speaking >= requiredCLB &&
            lang.clbEquivalent.listening >= requiredCLB &&
            lang.clbEquivalent.reading >= requiredCLB &&
            lang.clbEquivalent.writing >= requiredCLB) {
          hasLanguageProficiency = true;
        }
      }
    });
  }
  
  if (!hasLanguageProficiency) {
    result.reasons.push('Insufficient language proficiency (need at least CLB 7 for NOC 0/A jobs or CLB 5 for NOC B jobs)');
  }
  
  result.isEligible = hasEnoughCanadianWorkExperience && hasLanguageProficiency;
  
  return result;
}

function checkFSTPEligibility(profile) {
  const result = {
    isEligible: false,
    reasons: []
  };
  
  let hasEnoughTradesExperience = false;
  let totalMonths = 0;
  
  if (profile.workExperience && profile.workExperience.length > 0) {
    profile.workExperience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        if (exp.occupation && exp.occupation.noc) {
          const firstChar = exp.occupation.noc.charAt(0);
          if (firstChar === '3') { // Assuming NOC B includes skilled trades
            const start = new Date(exp.startDate);
            const end = new Date(exp.endDate);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            
            if (exp.hoursPerWeek >= 30) {
              totalMonths += months;
            } else if (exp.hoursPerWeek >= 15) {
              totalMonths += months / 2;
            }
          }
        }
      }
    });
  }
  
  hasEnoughTradesExperience = totalMonths >= 24;
  
  if (!hasEnoughTradesExperience) {
    result.reasons.push('Insufficient skilled trades experience (need at least 2 years)');
  }
  
  let hasLanguageProficiency = false;
  
  if (profile.languageProficiency && profile.languageProficiency.length > 0) {
    profile.languageProficiency.forEach(lang => {
      if (lang.clbEquivalent) {
        if (lang.clbEquivalent.speaking >= 5 &&
            lang.clbEquivalent.listening >= 5 &&
            lang.clbEquivalent.reading >= 4 &&
            lang.clbEquivalent.writing >= 4) {
          hasLanguageProficiency = true;
        }
      }
    });
  }
  
  if (!hasLanguageProficiency) {
    result.reasons.push('Insufficient language proficiency (need at least CLB 5 for speaking/listening and CLB 4 for reading/writing)');
  }
  
  let hasJobOfferOrCertificate = false;
  
  if (profile.hasJobOffer) {
    hasJobOfferOrCertificate = true;
  } else if (profile.education && profile.education.some(edu => edu.level === 'certificate')) {
    hasJobOfferOrCertificate = true;
  }
  
  if (!hasJobOfferOrCertificate) {
    result.reasons.push('No job offer or certificate of qualification');
  }
  
  result.isEligible = hasEnoughTradesExperience && hasLanguageProficiency && hasJobOfferOrCertificate;
  
  return result;
}

function getAgeFromRange(ageRange) {
  switch (ageRange) {
    case '18-19': return 19;
    case '20-29': return 25;
    case '30-39': return 35;
    case '40-44': return 42;
    case '45+': return 45;
    default: return 30;
  }
}

function getCLBEquivalentScore(skill, clbLevel) {
  switch (clbLevel) {
    case 'clb4':
      return skill === 'speaking' || skill === 'writing' ? 4.0 : 3.5;
    case 'clb5':
      return skill === 'speaking' || skill === 'writing' ? 5.0 : 4.0;
    case 'clb6':
      return skill === 'speaking' || skill === 'writing' ? 5.5 : 5.0;
    case 'clb7':
      return skill === 'speaking' || skill === 'writing' ? 6.0 : 6.0;
    case 'clb8':
      return skill === 'speaking' || skill === 'writing' ? 6.5 : 6.5;
    case 'clb9':
      return skill === 'speaking' || skill === 'writing' ? 7.0 : 7.5;
    case 'clb10+':
      return skill === 'speaking' || skill === 'writing' ? 8.0 : 8.5;
    default:
      return 0;
  }
}

function getYearsFromRange(experienceRange) {
  switch (experienceRange) {
    case 'none': return 0;
    case '1-year': return 1;
    case '2-years': return 2;
    case '3-years': return 3;
    case '4-years': return 4;
    case '5-years+': return 5;
    default: return 0;
  }
}
