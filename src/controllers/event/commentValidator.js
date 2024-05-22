const Joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const commentValidator = Joi.object({
    user: Joi.string().pattern(objectIdPattern).required().error(new Error('Invalid user ID.')),
    comment: Joi.string().required().pattern(/^[a-zA-Zñ0-9,. ]+$/).min(1).max(500).error(new Error('Comment must be a string (a-z A-Z ñ 0-9 ,.), between 1 and 500 characters long.')),
    rating: Joi.number().required().min(0.5).max(10).custom((value) => {
        if (value % 0.5 !== 0) {
            return error('Rating must be a number between 0.5 and 10, with 0.5 increments.')
        }
        return value
    }).error(new Error('Rating must be a number between 0.5 and 10, with 0.5 increments.')),
    date: Joi.date().required().error(new Error('Invalid or missing comment date.')),
})

module.exports = commentValidator