/**
 * Middleware for handling internationalization
 */

/**
 * Middleware to set locale based on request headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
module.exports = (req, res, next) => {
  const acceptLanguage = req.headers['accept-language'] || '';
  
  const primaryLanguage = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase() || 'en';
  
  req.locale = supportedLocales.includes(primaryLanguage) ? primaryLanguage : 'en';
  
  res.setHeader('Content-Language', req.locale);
  
  next();
};

const supportedLocales = ['en', 'fr'];
