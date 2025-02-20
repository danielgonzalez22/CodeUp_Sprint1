const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel')
const validator = require('./userValidator')

const userController = {
  signUp: async (req, res) => {
    let { email } = req.body

    try {
      const result = await validator.validateAsync(req.body)
      let user = await User.findOne({ email })
      if (!user) {
        user = await new User(result).save()
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

  logIn: async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "User email and/or password not provided"
      })
    }
    try {
      const user = await User.findOne({ email })
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Email address not found. Please check and try again."
        })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password. Please try again."
        })
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      res.json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          photo: user.photo,
          email: user.email,
          age: user.age,
          genre: user.genre,
          role: user.role,
        }
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  },

  updateProfile: async (req, res) => {
    const userId = req.user && req.user.id

    try {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is not provided."
        })
      }

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user with the provided ID was found."
        })
      }

      const result = await validator.validateAsync(req.body)
      user.name = result.name
      user.lastName = result.lastName
      user.photo = result.photo
      user.age = result.age
      user.genre = result.genre

      await user.save()
      res.status(200).json({
        success: true,
        message: "User account data updated successfully.",
        user
      })
    }
    catch (error) {
      res.status(500).json({
        message: error.message,
        success: false
      })
    }
  },

  changePassword: async (req, res) => {
    const userId = req.user && req.user.id
    const { oldPassword, newPassword } = req.body

    try {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is not provided."
        })
      }

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user with the provided ID was found."
        })
      }

      // Check if old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect."
        })
      }

      // Update the password
      user.password = newPassword
      await user.save()

      res.status(200).json({
        success: true,
        message: "Password updated successfully."
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false
      })
    }
  }
}
module.exports = userController