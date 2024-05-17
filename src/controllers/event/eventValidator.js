const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const eventValidator = Joi.object({
  place: Joi.string().pattern(objectIdPattern).required().error(new Error('Invalid event place ObjectId.')),
  date: Joi.date().required().error(new Error('Invalid or missing event date.')),
  name: Joi.string().required().error(new Error('Event name is required and must be a string.')),
  photo: Joi.string().uri().allow('').optional().error(new Error('Invalid event photo URL.')),
  description: Joi.string().required().error(new Error('Event description is required and must be a string.')),
  attendees: Joi.array().items(Joi.string().pattern(objectIdPattern).error(new Error('Invalid attendee ObjectId.'))).error(new Error('Invalid event attendees array.')),
  minimumAge: Joi.number().integer().min(0).max(21).required().error(new Error('Event minimum age is required and must be a non-negative integer.')),
  organizer: Joi.string().pattern(objectIdPattern).required().error(new Error('Invalid event organizer ObjectId.')),
});

module.exports = eventValidator;