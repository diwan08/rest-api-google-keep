const Joi = require("joi");

module.exports = Joi.object({
    username: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "username cannot be empty",
            "string.base": "username must be a text",
            "string.empty": "username cannot be empty"
            
        }),
    password: Joi.string()
        .min(8)
        .max(20)
        .required()
        .trim()
        .messages({
            "any.required": "password cannot be empty",
            "string.base": "password must be a text",
            "string.min": "length password minimal 8 character",
            "string.max": "length password maximum 20 character",
            "string.empty": "password cannot be empty"
        }),
    name: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "name cannot be empty",
            "string.base": "name must be a text"
        }),
    role: Joi.string()
        .required()
        .valid("admin", "member")
        .trim()
        .messages({
            "any.required": "role cannot be empty",
            "string.base": "role must be a text",
            "any.only": "role must be one of member or admin"
        }),
});