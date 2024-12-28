const Message = require('../models/message.model')

const catchAsync = require('../utils/catchAsync')
const cloudinary = require('../utils/cloudinary')
const ApiResponse = require('../utils/apiResponse')
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, image } = req.body
  const senderId = req.user._id
  const receiverId = req.params.id

  let imageUrl
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image)
    imageUrl = uploadResponse.secure_url
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
    image: imageUrl,
  })

  // todo: realtime functionality goes here => socket.io

  return ApiResponse.successResponse(
    res,
    message,
    'Message sent successfully',
    201,
  )
})
