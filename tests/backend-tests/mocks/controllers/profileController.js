/**
 * Mock profileController for testing
 */
const Profile = require('../models/Profile');

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this profile'
      });
    }
    
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    let profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      profile = await Profile.create({
        userId,
        ...req.body
      });
    } else {
      Object.keys(req.body).forEach(key => {
        profile[key] = req.body[key];
      });
      
      await profile.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get profile completion status
 */
exports.getCompletionStatus = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this profile'
      });
    }
    
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    const completionStatus = profile.calculateCompletionStatus();
    
    res.status(200).json({
      success: true,
      data: {
        completionStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update personal info
 */
exports.updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    let profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      profile = await Profile.create({
        userId,
        personalInfo: req.body
      });
    } else {
      profile.personalInfo = {
        ...profile.personalInfo,
        ...req.body
      };
      
      await profile.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        personalInfo: profile.personalInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update education
 */
exports.updateEducation = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    let profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      profile = await Profile.create({
        userId,
        education: req.body
      });
    } else {
      profile.education = req.body;
      await profile.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        education: profile.education
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update work experience
 */
exports.updateWorkExperience = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    let profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      profile = await Profile.create({
        userId,
        workExperience: req.body
      });
    } else {
      profile.workExperience = req.body;
      await profile.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        workExperience: profile.workExperience
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update language skills
 */
exports.updateLanguageSkills = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    let profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      profile = await Profile.create({
        userId,
        languageSkills: req.body
      });
    } else {
      profile.languageSkills = req.body;
      await profile.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        languageSkills: profile.languageSkills
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update immigration info
 */
exports.updateImmigrationInfo = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    let profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      profile = await Profile.create({
        userId,
        immigrationInfo: req.body
      });
    } else {
      profile.immigrationInfo = {
        ...profile.immigrationInfo,
        ...req.body
      };
      
      await profile.save();
    }
    
    res.status(200).json({
      success: true,
      data: {
        immigrationInfo: profile.immigrationInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
