const Joi = require("Joi");

module.exports = Joi.object({
    username : Joi.string()
        .required()
        .trim()
        .messages({
            "any.required":  "username canot be empty",
            "string.base": "username must be a text"
        }),
    password : Joi.string()
    .min(8)
    .max(20)
    .required()
    .trim()
    .messages({
        "any.required": "password cannot be empty",
        "string.base": "password most a be text",
        "srting.min":"length password minimal 8 chararcter",
        "string.max": "length password maximum 20 cahracter"
    }),
});