const express = require('express')
const router = express.Router()

const { createPlace, getAllPlaces } = require('../controllers/place/placeController')

router.post('/', createPlace)
router.get('/', getAllPlaces)

module.exports = router