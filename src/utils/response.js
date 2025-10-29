class ApiResponse {
    static success(data, message = 'Success', statusCode = 200) {
        return {
            success: true,
            statusCode,
            message,
            data
        }
    }

    static error(message = 'Error', statusCode = 500, errors = null) {
        return {
            success: false,
            statusCode,
            message,
            ...(errors && { errors })
        }
    }

    static created(data, message = 'Success', statusCode = 201) {
        return {
            success: true,
            statusCode,
            message,
            data
        }
    }

    static notFound(message = 'Resource not found') {
    return this.error(message, 404);
  }

  static badRequest(message = 'Bad request', errors = null) {
    return this.error(message, 400, errors);
  }

  static paginated(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statusCode: 200
    };
  }
}

module.exports = ApiResponse;