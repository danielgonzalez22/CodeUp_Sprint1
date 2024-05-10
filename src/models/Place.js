const mongoose = require('mongoose')
const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    photo: { type: String, default: '' },
    date: [{
        type: Schema.Types.ObjectId,
        ref: 'event'
    }],
    occupancy: { type: Number, required: true },
})

module.exports = mongoose.model(
    'place',
    placeSchema
)