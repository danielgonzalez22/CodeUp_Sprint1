const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const placeValidator = Joi.object({
    name: Joi.string().required().pattern(/^[a-zA-Zñ ]+$/).min(3).max(20).error(new Error('Place name must have only letters, between 3 and 20.')),
    address: Joi.string().required().pattern(/^[a-zA-Zñ ]+$/).min(3).max(30).error(new Error('Place address must have only letters, between 3 and 30.')),
    photo: Joi.string().uri().allow('').optional().error(new Error('Invalid place photo URL.')),
    date: Joi.array().items(Joi.string().pattern(objectIdPattern).error(new Error('Invalid place date ObjectId.'))).optional().error(new Error('Invalid place dates array.')),
    occupancy: Joi.number().integer().min(1).required().error(new Error('Place occupancy is required and must be a non-negative integer.')),
})

module.exports = placeValidator