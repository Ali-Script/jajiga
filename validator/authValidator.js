const Joi = require('joi');

const schema = Joi.object({
    firstName:
        Joi.string()
            .min(3)
            .max(30)
            .required(),
    lastName:
        Joi.string()
            .min(3)
            .max(30)
            .required(),

    password:
        Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9.@$\-_#]{8,}$'))
            .required(),

    confirmPassword:
        Joi.any().valid(Joi.ref('password')).required(),

    phone:
        Joi.string()
            .min(11)
            .max(11)
});

module.exports = schema;