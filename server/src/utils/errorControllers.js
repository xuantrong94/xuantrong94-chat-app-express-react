const AppError = require('./appError')
const logger = require('./logger')

// CastError refers to an invalid ID in the URL
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

// ValidationError is returned when a required field is missing or the data is invalid

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.value} for field: ${Object.keys(err.keyValue)[0]}`
  return new AppError(message, 400)
}

const handleJWTError = () => {
  const message = 'Invalid JWT token. Please log in again.'
  return new AppError(message, 401)
}

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    name: err.name,
    error: err,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    // Send generic error message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.',
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(err, res)
  } else {
    let error = Object.create(err)
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error)
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error)
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError()
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError()
    }
    sendErrorProd(error, res)
  }
}
