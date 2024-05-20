const express = require('express')
const router = express.Router()
const userRouter = require('./auth')
const eventRouter = require('./event')
const placeRouter = require('./place')

router.use('/users', userRouter)
router.use('/events', eventRouter)
router.use('/places', placeRouter)
module.exports = router