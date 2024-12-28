const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const {
  token: { key, expire },
} = require('../configs/env.config')
// Middleware xác thực người dùng
exports.authenticate = (req, res, next) => {
  // Lấy token từ headers
  const authHeader = req.headers.authorization
  console.log('::: ~ authHeader:', authHeader)

  if (!authHeader?.startsWith('Bearer ')) {
    return next(
      new AppError('You are not logged in! Please log in to access.', 401),
    )
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return next(new AppError('Token is missing!', 401))
  }

  // Xác thực token
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return next(new AppError('Invalid token or token expired!', 401))
    }

    req.user = decoded // Đính kèm thông tin user từ token vào request
    next()
  })
}
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      )
    }
    next()
  }
}
