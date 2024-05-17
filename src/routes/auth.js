const express = require('express')
const router = express.Router()
const authMiddleware = require('../services/middleware/authMiddleware')

const { signUp, logIn } = require('../controllers/user/userController')

router.post('/signup', signUp)
router.post('/login', logIn)

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ success: true, message: 'This is a protected route.', user: req.user })
})

module.exports = router