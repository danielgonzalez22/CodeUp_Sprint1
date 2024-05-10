const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    description: { type: String, required: true },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    minimumAge: { type: Number, required: true },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
})

module.exports = mongoose.model(
    'event',
    eventSchema
)