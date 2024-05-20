const Place = require('../../models/placeModel')
const User = require('../../models/userModel')
const validator = require('./placeValidator')

const placeController = {
  createPlace: async (req, res) => {
    //destructuring the body of the request for handling properties separately
    let {
      name,
      address,
      photo,
      date,
      occupancy,
    } = req.body

    try {
      // const userId = req.user && req.user.id // Assuming req.user is populated by verifyToken middleware

      // //checking if user id is provided:
      // if (!userId) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "User ID is not provided."
      //   })
      // }

      const userId = "6646cb87c4c457756845cdf6"
      //searching a user with the provided id
      const user = await User.findById(userId)

      //checking that user's existence in db:
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user with the provided ID was found."
        })
      }

      //checking if the user has the necessary role for creating places
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can add places.',
        })
      }

      const result = await validator.validateAsync(req.body)

      //check if the place already exists
      const existingPlace = await Place.findOne({ name: result.name })
      if (existingPlace) {
        return res.status(409).json({
          success: false,
          message: 'Specified place name already exists.',
        })
      }


      //finally, creating a new place
      const newPlace = await new Place(result).save()
      res.status(201).json({
        success: true,
        message: 'New place added to the database!',
        place: newPlace
      })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false
      })
    }
  },
  getAllPlaces: async (req, res) => {
    try {
      const places = await Place.find()
        //replacing certain Event fields with specified properties of the referenced object of each referenced collection
        .populate('date', 'name date attendees')
      res.status(200).json({
        success: true,
        data: places
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching places.",
      })
    }
  },
}

module.exports = placeController