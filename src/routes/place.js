const express = require('express')
const router = express.Router()
const authMiddleware = require('../services/middleware/authMiddleware')


const { createPlace, getAllPlaces, getPlaceById } = require('../controllers/place/placeController')

//router.post('/', authMiddleware(['admin']), createPlace)
router.post('/', createPlace)
router.get('/', getAllPlaces)
router.get('/:id', getPlaceById)

module.exports = router