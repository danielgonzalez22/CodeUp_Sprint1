const express = require('express')
const router = express.Router()
const authMiddleware = require('../services/middleware/authMiddleware')

const { createEvent, getAllEvents, getEventById, enrollEvent, updateEvent, getEventsByUser } = require('../controllers/event/eventController')

router.post('/', authMiddleware('organizer'), createEvent) //working. No need of user _id from the frontend (automatically assigned in backend). Needs further improvements: no repeated event name (unless the other one already happened).

router.get('/', getAllEvents) //working. Modify the populated "place" field, to adjust as necessary.
router.get('/:id', getEventById) //working.
router.get('/user/:userId', getEventsByUser)
router.put('/', authMiddleware('user'), enrollEvent)
router.put('/update', authMiddleware('organizer'), updateEvent)
module.exports = router