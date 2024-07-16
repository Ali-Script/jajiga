const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(50)
        .required(),
    href: Joi.string()
        .required()
});

module.exports = schema;