const User = require('../../models/userModel')
const validator = require('./userValidator')

const userController = {
    signUp: async (req, res) => {
        let {
            name,
            lastName,
            photo,
            email,
            password,
            age,
            genre,
            events,
            role
        } = req.body

        try {
            const result = await validator.validateAsync(req.body)
            let user = await User.findOne({ email })
            if (!user) {
                user = await new User({ name, lastName, photo, email, password, age, genre, events, role }).save()
                res.status(201).json({
                    message: "Signup successful! Please login.",
                    success: true
                })
            } else {
                res.status(409).json({
                    message: "Email address already in use.",
                    success: false
                })
            }
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    },

    LogIn: async (req, res) => {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "Email address not found. Please check and try again."
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                message: "An error occurred during the login process."
            })
        }
    }
}
module.exports = userController