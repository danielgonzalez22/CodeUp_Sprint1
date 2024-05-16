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
            // let user = await User.findOne({ email })
            // if (!user) {
            //     user = await new User({ name, lastName, photo, email, password, age, genre, events, role }).save()
            //     res.status(201).json({
            //         message: "User signed up succesfully, please log in.",
            //         success: true
            //     })
            // } else {
            //     res.status(409).json({
            //         message: "The provided email already exists",
            //         success: false
            //     })
            // }
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    }
}
module.exports = userController