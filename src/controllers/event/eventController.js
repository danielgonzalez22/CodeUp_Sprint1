const Event = require('../../models/eventModel')
const User = require('../../models/userModel')
const Place = require('../../models/placeModel')
const validator = require('./eventValidator')

const eventController = {
  createEvent: async (req, res) => {
    //destructuring the body of the request for handling properties separately
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
          message: "No user with the provided ID was found."
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
        event: newEvent
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
        .populate('place', 'name occupancy')
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

  },

  getEventById: async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Event ID is not provided."
      })
    }

    try {
      const event = await Event.findById(id)
        .populate('place', 'name occupancy')
        .populate('organizer', 'name email')
        .populate('attendees', 'name')
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "No event with the provided ID was found."
        })
      }
      res.status(200).json({
        success: true,
        data: event
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the event by ID.",
      })
    }
  },

  enrollEvent: async (req, res) => {
    const userId = req.user && req.user.id
    const { eventId } = req.body // Assuming the event ID and place occupancy is sent in the request body

    try {
      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Event ID is not provided."
        })
      }

      const event = await Event.findById(eventId).populate('place', 'occupancy')
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found."
        })
      }

      const place = event.place
      if (!place) {
        return res.status(404).json({
          success: false,
          message: "No place found for that event."
        })
      }

      const placeOccupancy = place.occupancy

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

      if (user.age < event.minimumAge) {
        return res.status(403).json({
          success: false,
          message: "You do not meet the minimum age requirement for this event."
        })
      }

      // Check if the user is already enrolled in the event
      if (event.attendees.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this event."
        })
      }

      // Checking the available occupancy for the event
      const availableOccupancy = placeOccupancy - event.attendees.length
      if (availableOccupancy < 1) {
        return res.status(403).json({
          success: false,
          message: "This event is fully booked."
        })
      }

      // Enroll the user
      event.attendees.push(userId)
      await event.save()

      res.status(200).json({
        success: true,
        message: "Successfully enrolled in the event.",
        event
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "An error occurred during the enrollment process."
      })
    }
  }
}

module.exports = eventController