const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const {
  token: { key, expire },
  cookie: { expires: cookieExpires },
} = require('../configs/env.config.js')
const User = require('../models/user.model')
const ApiResponse = require('../utils/apiResponse.js')
function signToken(id) {
  return jwt.sign({ id }, key, {
    expiresIn: expire,
  })
}

function sendToken(user, statusCode, res) {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'pro',
  }
  res.cookie('jwt-token', token, cookieOptions)
  user.password = undefined

  const data = { user, token }

  return ApiResponse.successResponse(res, data, 'success', statusCode)
}

exports.register = catchAsync(async (req, res, next) => {
  const { password, email, firstName, lastName, phone } = req.body

  if (!password || !email || !firstName || !lastName || !phone) {
    return ApiResponse.errorResponse(
      res,
      'Please provide all required fields',
      400,
    )
  }

  // check if the user already exists
  const user = await User.findOne({ email })
  if (user) {
    return ApiResponse.errorResponse(res, 'User already exists', 400)
  }

  const newUser = await User.create({
    password,
    email,
    name: { firstName, lastName },
    phone,
  })

  sendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return ApiResponse.errorResponse(
      res,
      'Please provide email and password',
      400,
    )
  }
  const user = await User.findOne({ email })
  if (!user || !(await user.correctPassword(password, user.password))) {
    return ApiResponse.errorResponse(res, 'Invalid email or password', 401)
  }
  sendToken(user, 200, res)
})

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt-token', { path: '/' })
  return ApiResponse.successResponse(res, null, 'Logged out', 200)
}) 