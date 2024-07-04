const Place = require('../../models/placeModel')
const User = require('../../models/userModel')
const validator = require('./placeValidator')

const placeController = {
  createPlace: async (req, res) => {
    try {
      const userId = req.user && req.user.id // Assuming req.user is populated by verifyToken middleware

      //checking if user id is provided:
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID is not provided."
        })
      }

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

      const validatedPlace = await validator.validateAsync(req.body)

      //check if the place already exists
      const existingPlace = await Place.findOne({ name: validatedPlace.name })
      if (existingPlace) {
        return res.status(409).json({
          success: false,
          message: 'Specified place name already exists.',
        })
      }

      //finally, creating a new place
      const newPlace = await new Place(validatedPlace).save()
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
        .populate('events', 'name date attendees')
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
  getPlaceById: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Place ID is not provided."
      })
    }

    try {
      const place = await Place.findById(id).populate('events', 'name date attendees')

      if (!place) {
        return res.status(404).json({
          success: false,
          message: "No place with the provided ID was found."
        })
      }
      res.status(200).json({
        success: true,
        data: place
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the place by ID.",
      })
    }
  }
}

module.exports = placeController