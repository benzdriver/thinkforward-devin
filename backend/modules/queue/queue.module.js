/**
 * Queue Module
 * Configures and registers Bull queues for async task processing
 */

class QueueModule {
  constructor() {
    this.queues = {
      email: {
        name: 'email',
        options: {
          limiter: {
            max: 100,
            duration: 60000 // 1 minute
          }
        }
      },
      assessmentReport: {
        name: 'assessment-report',
        options: {
          limiter: {
            max: 10,
            duration: 60000 // 1 minute
          }
        }
      },
      dataSync: {
        name: 'data-sync',
        options: {
          limiter: {
            max: 5,
            duration: 60000 // 1 minute
          }
        }
      }
    };
  }

  /**
   * Get queue instance by name
   * @param {string} name - Queue name
   * @returns {Object} - Queue instance
   */
  getQueue(name) {
    return this.queues[name];
  }

  /**
   * Add job to queue
   * @param {string} queueName - Queue name
   * @param {Object} data - Job data
   * @param {Object} options - Job options
   * @returns {Promise<Object>} - Job instance
   */
  async addJob(queueName, data, options = {}) {
    console.log(`Adding job to ${queueName} queue:`, data);
    return { id: Math.random().toString(36).substring(7), data };
  }
}

module.exports = QueueModule;
