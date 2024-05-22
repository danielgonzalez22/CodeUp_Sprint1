const express = require('express')
const router = express.Router()
const authMiddleware = require('../services/middleware/authMiddleware')

const { signUp, logIn, updateProfile, changePassword } = require('../controllers/user/userController')

router.post('/signup', signUp)
router.post('/login', logIn)
router.put('/profile', authMiddleware, updateProfile)
router.put('/profile/passwd', authMiddleware, changePassword)


module.exports = router