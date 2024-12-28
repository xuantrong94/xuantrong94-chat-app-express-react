const express = require('express')
const multer = require('multer')
const router = express.Router()
const authRoutes = require('./auth.route.js')
const userRoutes = require('./user.route.js')
const messageRoutes = require('./message.route.js')

// Configure multer for handling form data
const upload = multer()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/messages', messageRoutes)

// Default route
router.post('/', upload.single('image'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the API!' })
})

module.exports = router
