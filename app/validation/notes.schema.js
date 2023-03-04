const Joi = require("Joi");

module.exports = Joi.object({
    title : Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": "title is reqiured",
        "string.base": "title most a be text" 
    }),
    context : Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": "context cannot be empty",
        "string.base": "context most a be text" 
    }),
});