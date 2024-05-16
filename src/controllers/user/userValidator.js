const Joi = require('joi')

const userValidator = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Zñ ]+$/).min(3).max(15).error(new Error('Name must have only letters, between 3 and 15.')),
    lastName: Joi.string().pattern(/^[a-zA-Zñ ]+$/).min(3).max(15).error(new Error('Lastname must have only letters, between 3 and 15.')),
    photo: Joi.string().uri().allow('').optional().error(new Error("Invalid photo URL.")),
    email: Joi.alternatives().try(Joi.string().lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ar", "org"] } }),)
        .error(new Error("Invalid email address.")),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).min(6).max(12).error(new Error("Password must be 6-12 characters long, only letters and/or numbers.")),
    age: Joi.number().integer().min(16).max(120).error(new Error("Age must be a number between 16 and 120.")),
    genre: Joi.string().pattern(/^[a-zA-Zñ ]+$/).min(3).max(15).allow('').optional().error(new Error("Genre must have only letters, between 3 and 50.")),
    events: Joi.array().items(Joi.string()).optional(),
    role: Joi.string().valid('admin', 'user', 'organizer').default('user')
})

module.exports = userValidator