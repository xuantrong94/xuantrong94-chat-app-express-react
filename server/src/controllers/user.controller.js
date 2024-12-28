const catchAsync = require('../utils/catchAsync')
const {
  token: { key, expire },
  cookie: { expires: cookieExpires },
} = require('../configs/env.config.js')
const User = require('../models/user.model')
const ApiResponse = require('../utils/apiResponse.js')
const handleFactory = require('./handleFactory')
const cloudinary = require('../utils/cloudinary.js')
const Message = require('../models/message.model.js')

exports.updateUser = catchAsync(async (req, res, next) => {
  // Find the user and ensure password is selected
  const user = await User.findById(req.user.id).select('+password')

  // Check if user exists
  if (!user) {
    return ApiResponse.errorResponse(res, 'User not found', 404)
  }

  // Prevent email updates
  if (req.body.email) {
    return ApiResponse.errorResponse(res, 'Email cannot be updated', 400)
  }

  // Handle password update
  if (req.body.password) {
    // Fix: Change condition to check if password is INCORRECT
    if (!user.correctPassword(req.body.password, user.password)) {
      return ApiResponse.errorResponse(
        res,
        'Current password is incorrect',
        401,
      )
    }

    // Update password
    user.password = req.body.newPassword
    await user.save()
  }

  // Prepare update object
  const updateData = {
    name: {
      firstName: req.body.firstName || user.name.firstName,
      lastName: req.body.lastName || user.name.lastName,
    },
    phone: req.body.phone || user.phone,
  }

  // Handle avatar upload
  if (req.body.avatar) {
    const newAvatarResponse = await cloudinary.uploader.upload(req.body.avatar)
    updateData.avatar = newAvatarResponse.secure_url
  }

  // Update user with new data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  })

  return ApiResponse.successResponse(
    res,
    updatedUser,
    'User updated successfully',
  )
})

exports.getUser = handleFactory.getOne(User)
exports.getUsers = handleFactory.getAll(User)

exports.getUsersForSideBar = catchAsync(async (req, res, next) => {
  const loggedInUserId = req.user._id
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select('fullName avatar')
  return ApiResponse.successResponse(
    res,
    filteredUsers,
    'Users retrieved successfully',
  )
})

exports.getMessages = catchAsync(async (req, res, next) => {
  const senderId = req.user._id
  const messages = await Message.find({
    $or: [
      { sender: senderId, receiver: req.params.id },
      { sender: req.params.id, receiver: senderId },
    ],
  })
  ApiResponse.successResponse(res, messages, 'Messages retrieved successfully')
})
