const cloudinary = require('cloudinary').v2
const { cloudinaryKey } = require('../configs/env.config.js')

cloudinary.config({
  cloud_name: cloudinaryKey.cloudName,
  api_key: cloudinaryKey.apiKey,
  api_secret: cloudinaryKey.apiSecret,
})

module.exports = cloudinary