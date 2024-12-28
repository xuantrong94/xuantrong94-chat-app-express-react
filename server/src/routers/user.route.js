const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')
const { authenticate } = require('../middlewares/auth.middleware')

router.get('/getUsersForSideBar', userController.getUsersForSideBar)
router.get('/:id/messages', authenticate, userController.getMessages)

router
  .route('/:id')
  .patch(authenticate, userController.updateUser)
  .get(authenticate, userController.getUser)
router.route('/').get(authenticate, userController.getUsers)

module.exports = router
