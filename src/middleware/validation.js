const { TASK_TYPES, PRIORITIES } = require('../config/constants');
const ApiResponse = require('../utils/response');

class ValidationMiddleware {
  static validateAddTask(req, res, next) {
    const { type, priority, payload } = req.body;
    const errors = [];

    // Validate type
    if (!type) {
      errors.push('Type is required');
    } else if (!Object.values(TASK_TYPES).includes(type)) {
      errors.push(`Type must be one of: ${Object.values(TASK_TYPES).join(', ')}`);
    }

    // Validate priority
    if (!priority) {
      errors.push('Priority is required');
    } else if (!Object.values(PRIORITIES).includes(priority)) {
      errors.push(`Priority must be one of: ${Object.values(PRIORITIES).join(', ')}`);
    }

    // Validate payload
    if (!payload || typeof payload !== 'object') {
      errors.push('Payload must be a valid object');
    }

    if (errors.length > 0) {
      const response = ApiResponse.badRequest('Validation failed', errors);
      return res.status(response.statusCode).json(response);
    }

    next();
  }

  static validatePagination(req, res, next) {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      const response = ApiResponse.badRequest('Page must be a positive integer');
      return res.status(response.statusCode).json(response);
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      const response = ApiResponse.badRequest('Limit must be between 1 and 100');
      return res.status(response.statusCode).json(response);
    }

    req.pagination = { page: pageNum, limit: limitNum };
    next();
  }

  static validateTaskFilters(req, res, next) {
    const { type, status, priority } = req.query;
    const errors = [];

    if (type && !Object.values(TASK_TYPES).includes(type)) {
      errors.push(`Invalid type filter. Must be one of: ${Object.values(TASK_TYPES).join(', ')}`);
    }

    if (status && !['pending', 'completed', 'failed'].includes(status)) {
      errors.push('Invalid status filter. Must be: pending, completed, or failed');
    }

    if (priority && !Object.values(PRIORITIES).includes(priority)) {
      errors.push(`Invalid priority filter. Must be one of: ${Object.values(PRIORITIES).join(', ')}`);
    }

    if (errors.length > 0) {
      const response = ApiResponse.badRequest('Invalid filters', errors);
      return res.status(response.statusCode).json(response);
    }

    next();
  }
}

module.exports = ValidationMiddleware;