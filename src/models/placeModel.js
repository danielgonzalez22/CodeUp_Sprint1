const mongoose = require('mongoose')
const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    photo: { type: String, default: '' },
    dates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }],
    occupancy: { type: Number, required: true },
})

module.exports = mongoose.model(
    'place',
    placeSchema
)