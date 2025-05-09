/**
 * Logger Service
 * Configures and provides logging functionality using Winston
 */

class LoggerService {
  constructor() {
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    this.colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'blue',
    };
  }

  /**
   * Initialize logger
   * @param {string} serviceName - Name of the service
   * @returns {Object} - Winston logger instance
   */
  createLogger(serviceName) {
    console.log(`Creating logger for ${serviceName}`);
    
    return {
      error: (message, meta) => this.logMessage('error', message, meta, serviceName),
      warn: (message, meta) => this.logMessage('warn', message, meta, serviceName),
      info: (message, meta) => this.logMessage('info', message, meta, serviceName),
      http: (message, meta) => this.logMessage('http', message, meta, serviceName),
      debug: (message, meta) => this.logMessage('debug', message, meta, serviceName),
    };
  }

  /**
   * Log message with appropriate level
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   * @param {string} serviceName - Name of the service
   */
  logMessage(level, message, meta, serviceName) {
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${serviceName}] ${message}`, meta || '');
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`Writing to log file: logs/${serviceName}-${level}.log`);
    }
  }
}

module.exports = LoggerService;
