const Event = require('../../models/eventModel')
const User = require('../../models/userModel')
const Place = require('../../models/placeModel')
const validator = require('./eventValidator')

const eventController = {
  createEvent: async (req, res) => {

    //desctructuring the body of the request for handling properties separately
    let {
      place,
      date,
      name,
      photo,
      description,
      attendees,
      minimumAge,
      organizer
    } = req.body

    try {
      const userId = req.user && req.user.id // Assuming req.user is populated by verifyToken middleware

      //checking if user id is provided:
      if (!userId) {
        return res.status(400).json({
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
          message: "No user with the provided id was found."
        })
      }

      //checking if the user has the necessary role for creating events
      if (user.role !== 'organizer') {
        return res.status(403).json({
          success: false,
          message: 'Only users with organizer role can create events.',
        })
      }

      const result = await validator.validateAsync(req.body)

      //check if the place exists
      const place = await Place.findById(result.place)
      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Specified place does not exist.',
        })
      }

      //check if theres another event at the same date and place
      const conflictingEvent = await Event.findOne({
        place: result.place,
        date: result.date,
      })
      if (conflictingEvent) {
        return res.status(409).json({
          success: false,
          message: 'The specified date is not available at the selected place.',
        })
      }

      //finally, creating a new event
      const newEvent = await new Event(result).save()
      res.status(200).json({
        success: true,
        message: 'New event added to the database!',
      })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false
      })
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find()
        //replacing certain Event fields with specified properties of the referenced object of each referenced collection
        .populate('place', 'name')
        .populate('organizer', 'name email')
        .populate('attendees', 'name')
      res.status(200).json({
        success: true,
        data: events
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching events.",
      })
    }

  }
}

module.exports = eventController