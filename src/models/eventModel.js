const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const eventSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'place',
        required: true
    },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    description: { type: String, required: true },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    minimumAge: { type: Number, required: true },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }]
})

module.exports = mongoose.model(
    'event',
    eventSchema
)