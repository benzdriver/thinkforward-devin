/**
 * Redis Cache Configuration
 * Configures Redis connection and cache options
 */

module.exports = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    keyPrefix: 'thinkforward:',
  },
  
  ttl: {
    user: 30 * 60,
    
    consultantAvailability: 15 * 60,
    
    dictionary: 24 * 60 * 60,
    
    programs: 12 * 60 * 60,
    
    expressEntryDraws: 6 * 60 * 60
  },
  
  keys: {
    user: (userId) => `user:${userId}`,
    consultant: (consultantId) => `consultant:${consultantId}`,
    consultantClients: (consultantId) => `consultant:${consultantId}:clients`,
    dictionary: (type) => `dictionary:${type}`,
    expressEntryDraws: 'express-entry:draws',
    pnpPrograms: (province) => `pnp:${province}:programs`
  }
};
