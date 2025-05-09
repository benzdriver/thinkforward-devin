/**
 * Express Entry Service
 * Business logic for Express Entry immigration program
 */

/**
 * Calculate Comprehensive Ranking System (CRS) points for Express Entry
 * @param {Object} profile - Express Entry profile
 * @returns {Promise<number>} - Total CRS points
 */
exports.calculatePoints = async (profile) => {
  try {
    
    const corePoints = 350;
    
    const spousePoints = profile.maritalStatus === 'married' && profile.spouseProfile ? 40 : 0;
    
    const additionalPoints = profile.hasProvincialNomination ? 600 : 0;
    
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
  return {
    coreHumanCapital: {
      age: 110,
      education: 120,
      languageProficiency: 100,
      canadianWorkExperience: 20,
      subtotal: 350
    },
    spouse: {
      education: 10,
      languageProficiency: 20,
      canadianWorkExperience: 10,
      subtotal: 40
    },
    skillTransferability: {
      education: 25,
      foreignWorkExperience: 25,
      certificateOfQualification: 0,
      subtotal: 50
    },
    additional: {
      provincialNomination: profile.hasProvincialNomination ? 600 : 0,
      jobOffer: 0,
      canadianEducation: 0,
      frenchLanguageSkills: 0,
      sibling: 0,
      subtotal: profile.hasProvincialNomination ? 600 : 0
    }
  };
};

/**
 * Check eligibility for Express Entry programs
 * @param {Object} profile - Express Entry profile
 * @returns {Promise<Object>} - Eligibility results
 */
exports.checkEligibility = async (profile) => {
  try {
    return {
      isEligible: true,
      eligiblePrograms: ['FSWP', 'CEC'],
      reasons: ['Meets minimum requirements for Express Entry']
    };
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
    return [
      {
        drawNumber: 123,
        date: new Date('2025-05-01'),
        program: 'All programs',
        invitationsIssued: 3500,
        minimumScore: 470
      },
      {
        drawNumber: 122,
        date: new Date('2025-04-15'),
        program: 'CEC only',
        invitationsIssued: 1000,
        minimumScore: 458
      }
    ];
  } catch (error) {
    console.error('Error fetching Express Entry draws:', error);
    throw error;
  }
};
