const express = require('express')
const router = express.Router()
const userRouter = require('./auth')

router.use('/users', userRouter)
module.exports = router