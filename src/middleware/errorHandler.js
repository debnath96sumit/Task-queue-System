const ApiResponse = require('../utils/response');
const Logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    Logger.error(err.message, err);
    const statusCode = err.statusCode || 500;
    const response = ApiResponse.error(err.message, statusCode, err.errors);
    return res.status(response.statusCode).json(response);
};

module.exports = errorHandler;
