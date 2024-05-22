const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }
    catch (error) {
        next(error)
    }
})

module.exports = mongoose.model(
    'user',
    userSchema
)