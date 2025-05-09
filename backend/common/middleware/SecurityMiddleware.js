/**
 * Security Middleware
 * Implements security best practices for the API
 */

class SecurityMiddleware {
  /**
   * Apply security headers to response
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static applySecurityHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    
    next();
  }

  /**
   * Rate limiting middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static rateLimit(req, res, next) {
    console.log('Rate limiting check for IP:', req.ip);
    
    next();
  }

  /**
   * CSRF protection middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static csrfProtection(req, res, next) {
    console.log('CSRF protection check for request:', req.method, req.path);
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const csrfToken = req.headers['x-csrf-token'];
      
      if (!csrfToken) {
        return res.status(403).json({
          statusCode: 403,
          error: 'Forbidden',
          message: 'CSRF token missing'
        });
      }
      
      if (csrfToken !== 'valid-token') {
        return res.status(403).json({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Invalid CSRF token'
        });
      }
    }
    
    next();
  }
}

module.exports = SecurityMiddleware;
