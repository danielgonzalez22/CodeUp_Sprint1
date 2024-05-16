const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    genre: { type: String, default: '' },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }],
    role: {
        type: String,
        enum: ['admin', 'user', 'organizer'],
        default: 'user'
    },
})

module.exports = mongoose.model(
    'user',
    userSchema
)