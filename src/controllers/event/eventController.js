const Event = require('../../models/eventModel')
const User = require('../../models/userModel')
const Place = require('../../models/placeModel')
const eventValidator = require('./eventValidator')
const commentValidator = require('./commentValidator')

const eventController = {
  createEvent: async (req, res) => {
    const userId = req.user && req.user.id // Assuming req.user is populated by verifyToken middleware

    try {
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

      //checking if the user has the necessary role for creating events
      if (user.role !== 'organizer') {
        return res.status(403).json({
          success: false,
          message: 'Only users with organizer role can create events.',
        })
      }
      req.body = { ...req.body, organizer: userId }
      const result = await eventValidator.validateAsync(req.body)

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

  getEventsByUser: async (req, res) => {
    const userId = req.user && req.user.id
    try {
      if (!userId) {
        return res.status(401).json({
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
    } catch (error) {
      
    }

  },
  enrollEvent: async (req, res) => {
    const userId = req.user && req.user.id
    const { eventId } = req.body

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
          message: "No place found for that event, please contact the organizer."
        })
      }

      const placeOccupancy = place.occupancy

      if (!userId) {
        return res.status(401).json({
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

      //check if the event has already happened
      if (event.date < Date.now()) {
        return res.status(403).json({
          success: false,
          message: "This event has already happened."
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
  },

  updateEvent: async (req, res) => {
    const userId = req.user && req.user.id
    const { eventId, ...updatedData } = req.body

    try {
      if (!userId) {
        return res.status(401).json({
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
      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Event ID is not provided."
        })
      }
      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "No event with the provided ID was found."
        })
      }

      const validatedData = await eventValidator.validateAsync(updatedData)

      //check user role for modifying the event
      if (event.organizer.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only the organizer of the event can modify it."
        })
      }

      //check if the attendees exist in the database
      const checkAttendees = await Promise.all(
        validatedData.attendees.map(async attendeeId => {
          const attendee = await User.findById(attendeeId)
          if (!attendee) {
            return res.status(404).json({
              success: false,
              message: "At least one of the provided attendees does not exist."
            })
          }
          if (attendee.role !== 'user') {
            return res.status(404).json({
              success: false,
              message: "At least one of the provided attendees doesn't have 'user' role."
            })
          }
        }))

      //check if the place of the event of the request exists in the database
      const place = await Place.findById(validatedData.place)
      if (!place) {
        return res.status(404).json({
          success: false,
          message: "Specified place does not exist."
        })
      }

      event.place = validatedData.place
      event.date = validatedData.date
      event.name = validatedData.name
      event.description = validatedData.description
      event.minimumAge = validatedData.minimumAge

      if (event.date > Date.now()) {
        event.attendees = validatedData.attendees
      } else if (event.attendees.toString() !== validatedData.attendees.toString()) {
        return res.status(403).json({
          success: false,
          message: "Can't modify the attendees of an event that has already happened."
        })
      }

      await event.save()
      res.status(200).json({
        success: true,
        message: "Event data updated successfully.",
        event
      })
    }
    catch (error) {
      res.status(500).json({
        message: error.message,
        success: false
      })
    }
  },

  deleteEvent: async (req, res) => {
    const userId = req.user && req.user.id
    const { eventId } = req.body
    try {

      if (!userId) {
        return res.status(401).json({
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

      //checking if the user has the necessary role for deleting events
      if (user.role !== 'organizer') {
        return res.status(403).json({
          success: false,
          message: 'Only users with organizer role can delete events.',
        })
      }

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Event ID is not provided."
        })
      }

      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "No event with the provided ID was found."
        })
      }

      if (event.organizer.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only the organizer of the event can delete it."
        })
      }

      const deletedEvent = await event.deleteOne()
      //when calling the deleteOne method, a pre-delete middleware (defined in event model) will trigger. It will handle the deletion of all references to the event in other collections.
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully.',
        deletedEvent
      })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false
      })
    }
  },

  addComment: async (req, res) => {
    const userId = req.user && req.user.id
    const { eventId, comment } = req.body
    try {
      if (!userId) {
        return res.status(401).json({
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

      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "No event with the provided ID was found."
        })
      }

      if (event.date > new Date()) {
        return res.status(403).json({
          success: false,
          message: "You can only comment on events that have already happened."
        })
      }

      if (!event.attendees.some(att => att._id.toString() === userId.toString())) {
        return res.status(403).json({
          success: false,
          message: "You can only comment on events you attended."
        })
      }

      const newComment = await commentValidator.validateAsync(comment)
      event.comments.push({
        user: userId,
        newComment
      })

      await event.save()

      res.status(200).json({
        success: true,
        message: "Comment added to an event successfully.",
        event
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = eventController