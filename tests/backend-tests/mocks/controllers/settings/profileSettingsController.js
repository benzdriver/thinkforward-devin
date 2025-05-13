/**
 * Mock profileSettingsController for testing
 */
const profileSettingsService = require('../../../mocks/services/settings/profileSettingsService');
const { validationResult } = require('express-validator');

/**
 * Get all settings for a user
 */
exports.getAllSettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access these settings'
      });
    }
    
    const settings = await profileSettingsService.getAllSettings(userId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get account settings for a user
 */
exports.getAccountSettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access these settings'
      });
    }
    
    const settings = await profileSettingsService.getAccountSettings(userId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update account settings for a user
 */
exports.updateAccountSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update these settings'
      });
    }
    
    const settings = await profileSettingsService.updateAccountSettings(userId, req.body, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get notification settings for a user
 */
exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access these settings'
      });
    }
    
    const settings = await profileSettingsService.getNotificationSettings(userId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update notification settings for a user
 */
exports.updateNotificationSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update these settings'
      });
    }
    
    const settings = await profileSettingsService.updateNotificationSettings(userId, req.body, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get privacy settings for a user
 */
exports.getPrivacySettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access these settings'
      });
    }
    
    const settings = await profileSettingsService.getPrivacySettings(userId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update privacy settings for a user
 */
exports.updatePrivacySettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update these settings'
      });
    }
    
    const settings = await profileSettingsService.updatePrivacySettings(userId, req.body, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get security settings for a user
 */
exports.getSecuritySettings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access these settings'
      });
    }
    
    const settings = await profileSettingsService.getSecuritySettings(userId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update security settings for a user
 */
exports.updateSecuritySettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update these settings'
      });
    }
    
    const settings = await profileSettingsService.updateSecuritySettings(userId, req.body, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Remove a session for a user
 */
exports.removeSession = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { sessionId } = req.params;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to manage these sessions'
      });
    }
    
    const settings = await profileSettingsService.removeSession(userId, sessionId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Remove all other sessions for a user
 */
exports.removeAllOtherSessions = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    if (req.params.userId && req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to manage these sessions'
      });
    }
    
    const settings = await profileSettingsService.removeAllOtherSessions(userId, req.locale);
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};
