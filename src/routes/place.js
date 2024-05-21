const express = require('express')
const router = express.Router()

const { createPlace, getAllPlaces, getPlaceById } = require('../controllers/place/placeController')

router.post('/', createPlace)
router.get('/', getAllPlaces)
router.get('/:id', getPlaceById)

module.exports = router