/**
 * Error handling utilities for the backend
 */

/**
 * Translate error messages based on locale
 * @param {Error} error - Error object
 * @param {string} locale - Locale code (e.g., 'en', 'fr')
 * @returns {Object} - Translated error
 */
exports.translateError = (error, locale = 'en') => {
  let translatedError = {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR'
  };
  
  if (error.name === 'ValidationError' && error.errors) {
    translatedError.code = 'VALIDATION_ERROR';
    translatedError.validationErrors = [];
    
    Object.keys(error.errors).forEach(field => {
      const fieldError = error.errors[field];
      translatedError.validationErrors.push({
        field,
        message: translateValidationMessage(fieldError.message, locale)
      });
    });
  }
  
  if (error.code === 11000) {
    translatedError.code = 'DUPLICATE_KEY_ERROR';
    translatedError.message = translateDuplicateKeyMessage(error, locale);
  }
  
  if (error.message === 'Profile not found') {
    translatedError.code = 'NOT_FOUND_ERROR';
    translatedError.message = translateMessage('Profile not found', locale);
  }
  
  if (error.name === 'UnauthorizedError' || error.message === 'Unauthorized') {
    translatedError.code = 'UNAUTHORIZED_ERROR';
    translatedError.message = translateMessage('Authentication required', locale);
  }
  
  return translatedError;
};

/**
 * Translate validation error messages
 * @param {string} message - Error message
 * @param {string} locale - Locale code
 * @returns {string} - Translated message
 */
function translateValidationMessage(message, locale) {
  if (locale === 'fr') {
    if (message.includes('required')) {
      return 'Ce champ est obligatoire';
    }
    if (message.includes('min')) {
      return 'La valeur est inférieure à la valeur minimale autorisée';
    }
    if (message.includes('max')) {
      return 'La valeur dépasse la valeur maximale autorisée';
    }
  }
  
  return message;
}

/**
 * Translate duplicate key error messages
 * @param {Error} error - Error object
 * @param {string} locale - Locale code
 * @returns {string} - Translated message
 */
function translateDuplicateKeyMessage(error, locale) {
  let field = '';
  
  if (error.message.includes('index:')) {
    const start = error.message.indexOf('index:') + 7;
    const end = error.message.indexOf('_1', start);
    if (end > start) {
      field = error.message.substring(start, end);
    }
  }
  
  if (locale === 'fr') {
    return `Un enregistrement avec ce ${field || 'champ'} existe déjà`;
  }
  
  return `A record with this ${field || 'field'} already exists`;
}

/**
 * Translate general error messages
 * @param {string} message - Error message
 * @param {string} locale - Locale code
 * @returns {string} - Translated message
 */
function translateMessage(message, locale) {
  if (locale === 'fr') {
    const translations = {
      'Profile not found': 'Profil non trouvé',
      'Authentication required': 'Authentification requise',
      'An unexpected error occurred': 'Une erreur inattendue s\'est produite'
    };
    
    return translations[message] || message;
  }
  
  return message;
}
