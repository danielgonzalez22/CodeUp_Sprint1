const express = require('express')
const router = express.Router()
const authMiddleware = require('../services/middleware/authMiddleware')

const { createEvent, getAllEvents, getEventById } = require('../controllers/event/eventController')

//router.post('/', authMiddleware(['organizer']), createEvent)
router.post('/', createEvent)
router.get('/', getAllEvents)
router.get('/:id', getEventById)

module.exports = router