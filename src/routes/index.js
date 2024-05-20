const express = require('express')
const router = express.Router()
const userRouter = require('./auth')
const eventRouter = require('./event')

router.use('/users', userRouter)
router.use('/events', eventRouter)
module.exports = router