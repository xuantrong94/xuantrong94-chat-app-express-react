class ApiResponse {
  constructor(success, message, data) {
    this.success = success
    this.message = message
    this.data = data
  }

  static successResponse(res, data, message = 'Success', code = 200) {
    return res.status(code).json({
      status: 'success',
      code,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  static errorResponse(res, message = 'Error', code = 500, errors = null) {
    return res.status(code).json({
      status: 'error',
      code,
      message,
      errors,
      timestamp: new Date().toISOString(),
    })
  }

  static paginatedResponse(res, data, page, limit, total) {
    return res.status(200).json({
      status: 'success',
      code: 200,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = ApiResponse
