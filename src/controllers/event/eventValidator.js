const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const eventValidator = Joi.object({
  place: Joi.string().pattern(objectIdPattern).required().error(new Error('Invalid event place ObjectId.')),
  date: Joi.date().required().error(new Error('Invalid or missing event date.')),
  name: Joi.string().required().pattern(/^[a-zA-Zñ0-9.,- ]+$/).min(3).max(50).error(new Error('Event name must be a string (a-z A-Z ñ 0-9 .,-), between 3 and 50 characters long.')),
  photo: Joi.string().uri().allow('').optional().error(new Error('Invalid event photo URL.')),
  description: Joi.string().required().pattern(/^[a-zA-Zñ0-9.,- ]+$/).min(3).max(200).error(new Error('Event description must be a string (a-z A-Z ñ 0-9 .,-), between 3 and 200 characters long.')),
  attendees: Joi.array().items(Joi.string().pattern(objectIdPattern).error(new Error('Invalid attendee ObjectId.'))).error(new Error('Invalid event attendees array.')),
  minimumAge: Joi.number().integer().min(0).max(40).required().error(new Error('Event minimum age is required and must be a non-negative integer, between 0 and 40.')),
  organizer: Joi.string().pattern(objectIdPattern).required().error(new Error('Invalid event organizer ObjectId.')),
})

module.exports = eventValidator