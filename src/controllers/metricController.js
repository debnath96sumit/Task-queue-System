const ApiResponse = require('../utils/response');
const Logger = require('../utils/logger');

class MetricsController {
  constructor(taskQueue, rateLimiter, taskProcessor) {
    this.taskQueue = taskQueue;
    this.rateLimiter = rateLimiter;
    this.taskProcessor = taskProcessor;
  }

  getMetrics = (req, res) => {
    try {
      const taskMetrics = this.taskQueue.getMetrics();
      const rateLimits = this.rateLimiter.getAllRateLimits();
      
      const metrics = {
        tasks: {
          totalProcessed: taskMetrics.totalProcessed,
          completed: taskMetrics.completed,
          failed: taskMetrics.failed,
          pending: taskMetrics.pending
        },
        queue: {
          highPriority: taskMetrics.queueSizes.high,
          mediumPriority: taskMetrics.queueSizes.medium,
          lowPriority: taskMetrics.queueSizes.low,
          total: taskMetrics.queueSizes.high + 
                 taskMetrics.queueSizes.medium + 
                 taskMetrics.queueSizes.low
        },
        rateLimits: {
          sms: rateLimits.sms,
          email: rateLimits.email,
          webhook: rateLimits.webhook
        },
        processing: {
          activeTasks: this.taskProcessor.getActiveTaskCount(),
          maxConcurrent: 5
        }
      };

      const response = ApiResponse.success(metrics, 'Metrics retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      Logger.error('Error getting metrics:', error);
      const response = ApiResponse.error('Failed to retrieve metrics');
      res.status(response.statusCode).json(response);
    }
  };
}

module.exports = MetricsController;