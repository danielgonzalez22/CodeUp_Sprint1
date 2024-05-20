const express = require('express')
const router = express.Router()

const { createEvent, getAllEvents } = require('../controllers/event/eventController')

router.post('/', createEvent)
router.get('/', getAllEvents)

module.exports = router