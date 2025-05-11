/**
 * Global error handling middleware
 */
const { translateError } = require('../utils/errorHandler');

/**
 * Handle errors globally
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function handleErrors(err, req, res, next) {
  const locale = req.locale || 'en';
  
  console.error('Error:', err);
  
  const translatedError = translateError(err, locale);
  
  const statusCode = translatedError.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: translatedError.code || 'INTERNAL_SERVER_ERROR',
      message: translatedError.message || 'An unexpected error occurred',
      details: translatedError.details || null
    }
  });
}

/**
 * Handle 404 errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function handle404(req, res) {
  const locale = req.locale || 'en';
  
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: translateError({ message: 'Resource not found' }, locale).message,
      details: { path: req.originalUrl }
    }
  });
}

/**
 * Handle validation errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function handleValidationErrors(err, req, res, next) {
  if (err.name === 'ValidationError') {
    const locale = req.locale || 'en';
    const errors = {};
    
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        errors[key] = translateError({ message: err.errors[key].message }, locale).message;
      });
    }
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: translateError({ message: 'Validation failed' }, locale).message,
        details: errors
      }
    });
  }
  
  next(err);
}

/**
 * Handle rate limiting errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function handleRateLimitExceeded(req, res) {
  const locale = req.locale || 'en';
  
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: translateError({ message: 'Too many requests' }, locale).message,
      details: {
        retryAfter: res.getHeader('Retry-After') || 60
      }
    }
  });
}

module.exports = {
  handleErrors,
  handle404,
  handleValidationErrors,
  handleRateLimitExceeded
};
