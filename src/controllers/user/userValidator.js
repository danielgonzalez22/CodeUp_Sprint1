const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const userValidator = Joi.object({
    name: Joi.string().required().pattern(/^[a-zA-Zñ ]+$/).min(3).max(15).error(new Error('User name must have only letters, between 3 and 15.')),
    lastName: Joi.string().required().pattern(/^[a-zA-Zñ ]+$/).min(3).max(15).error(new Error('User lastname must have only letters, between 3 and 15.')),
    photo: Joi.string().uri().allow('').optional().error(new Error("Invalid user photo URL.")),
    email: Joi.alternatives().required().try(Joi.string().lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ar", "org"] } }),)
        .error(new Error("Invalid user email address.")),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).min(6).max(12).error(new Error("User password must be 6-12 characters long, only letters and/or numbers.")),
    age: Joi.number().required().integer().min(16).max(120).error(new Error("User age must be a number between 16 and 120.")),
    genre: Joi.string().pattern(/^[a-zA-Zñ ]+$/).min(3).max(15).allow('').optional().error(new Error("User genre must have only letters, between 3 and 50.")),
    events: Joi.array().items(Joi.string().pattern(objectIdPattern).error(new Error('Invalid user event ObjectId.'))).optional().error(new Error('Invalid user events array.')),
    role: Joi.string().valid('admin', 'user', 'organizer').default('user')
})

module.exports = userValidator