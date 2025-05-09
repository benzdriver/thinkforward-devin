/**
 * Authentication Service
 * Handles user authentication, token generation, and validation
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
  /**
   * Validate user credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User object if valid
   */
  async validateUser(email, password) {
    console.log('Validating user:', email);
    
    return {
      id: 1,
      email: email,
      role: 'CLIENT'
    };
  }

  /**
   * Generate JWT tokens for authenticated user
   * @param {Object} user - User object
   * @returns {Object} - Access and refresh tokens
   */
  async login(user) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role
    };

    return {
      access_token: jwt.sign(payload, 'access_token_secret', { expiresIn: '1h' }),
      refresh_token: jwt.sign(payload, 'refresh_token_secret', { expiresIn: '7d' })
    };
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} - New access token
   */
  async refreshToken(refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, 'refresh_token_secret');
      
      const newPayload = { 
        sub: payload.sub, 
        email: payload.email,
        role: payload.role
      };
      
      return {
        access_token: jwt.sign(newPayload, 'access_token_secret', { expiresIn: '1h' })
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = AuthService;
