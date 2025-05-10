/**
 * Utility functions for calculating Express Entry points
 */

/**
 * Calculate core/human capital points
 * @param {Object} profile - Express Entry profile
 * @returns {number} - Core/human capital points
 */
exports.calculateCoreHumanCapitalPoints = (profile) => {
  let points = 0;
  
  points += calculateAgePoints(profile);
  
  points += calculateEducationPoints(profile);
  
  points += calculateLanguagePoints(profile);
  
  points += calculateCanadianWorkExperiencePoints(profile);
  
  return points;
};

/**
 * Calculate spouse points
 * @param {Object} spouseProfile - Spouse profile
 * @returns {number} - Spouse points
 */
exports.calculateSpousePoints = (spouseProfile) => {
  let points = 0;
  
  points += calculateSpouseEducationPoints(spouseProfile);
  
  points += calculateSpouseLanguagePoints(spouseProfile);
  
  points += calculateSpouseWorkExperiencePoints(spouseProfile);
  
  return points;
};

/**
 * Calculate additional points
 * @param {Object} profile - Express Entry profile
 * @returns {number} - Additional points
 */
exports.calculateAdditionalPoints = (profile) => {
  let points = 0;
  
  points += calculateSkillTransferabilityPoints(profile);
  
  if (profile.hasProvincialNomination) {
    points += 600;
  }
  
  points += calculateJobOfferPoints(profile);
  
  points += calculateCanadianEducationPoints(profile);
  
  points += calculateFrenchLanguagePoints(profile);
  
  if (profile.adaptabilityFactors && profile.adaptabilityFactors.relativesInCanada && profile.adaptabilityFactors.relativesInCanada.has) {
    points += 15;
  }
  
  return points;
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

function calculateSkillTransferabilityPoints(profile) {
  let points = 0;
  
  points += calculateEducationLanguagePoints(profile);
  
  points += calculateEducationWorkExperiencePoints(profile);
  
  points += calculateForeignWorkExperienceLanguagePoints(profile);
  
  points += calculateForeignCanadianWorkExperiencePoints(profile);
  
  points += calculateCertificatePoints(profile);
  
  return Math.min(100, points); // Maximum 100 points for skill transferability
}

function calculateEducationLanguagePoints(profile) {
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

function calculateEducationWorkExperiencePoints(profile) {
  if (!profile.education || profile.education.length === 0 || !profile.workExperience || profile.workExperience.length === 0) return 0;
  
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
  
  if (years >= 2) {
    return 50;
  } else if (years >= 1) {
    return 25;
  }
  
  return 0;
}

function calculateForeignWorkExperienceLanguagePoints(profile) {
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

function calculateForeignCanadianWorkExperiencePoints(profile) {
  if (!profile.workExperience || profile.workExperience.length === 0) return 0;
  
  let foreignMonths = 0;
  
  profile.workExperience.forEach(exp => {
    if (!exp.isCanadianExperience && exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      if (exp.hoursPerWeek >= 30) {
        foreignMonths += months;
      } else if (exp.hoursPerWeek >= 15) {
        foreignMonths += months / 2;
      }
    }
  });
  
  const foreignYears = Math.floor(foreignMonths / 12);
  
  if (foreignYears < 1) return 0;
  
  let canadianMonths = 0;
  
  profile.workExperience.forEach(exp => {
    if (exp.isCanadianExperience && exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      if (exp.hoursPerWeek >= 30) {
        canadianMonths += months;
      } else if (exp.hoursPerWeek >= 15) {
        canadianMonths += months / 2;
      }
    }
  });
  
  const canadianYears = Math.floor(canadianMonths / 12);
  
  if (foreignYears >= 3) {
    if (canadianYears >= 2) {
      return 50;
    } else if (canadianYears >= 1) {
      return 25;
    }
  } else if (foreignYears >= 1) {
    if (canadianYears >= 2) {
      return 25;
    } else if (canadianYears >= 1) {
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
