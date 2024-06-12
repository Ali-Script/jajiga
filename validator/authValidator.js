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
            .pattern(new RegExp('^[a-zA-Z0-9]{8,999}$'))
            .required(),

    confirmPassword:
        Joi.any().valid(Joi.ref('password')).required(),

    phone:
        Joi.string()
            .min(11)
            .max(11)
            .when("SignUpMethod", { is: "phone", then: Joi.required() }),
});

module.exports = schema;