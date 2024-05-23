const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const placeValidator = Joi.object({
    name: Joi.string().required().pattern(/^[a-zA-Zñ0-9., ]+$/).min(3).max(30).error(new Error('Place address must be a string with only letters and numbers, between 3 and 30 characters long.')),
    address: Joi.string().required().pattern(/^[a-zA-Zñ0-9,. ]+$/).min(3).max(50).error(new Error('Place address must be a string with only letters and numbers, between 3 and 50 characters long.')),
    photo: Joi.string().uri().allow('').optional().error(new Error('Invalid place photo URL.')),
    date: Joi.array().items(Joi.string().pattern(objectIdPattern).error(new Error('Invalid place date ObjectId.'))).optional().error(new Error('Invalid place dates array.')),
    occupancy: Joi.number().integer().min(1).required().error(new Error('Place occupancy is required and must be a non-negative integer.')),
})

module.exports = placeValidator