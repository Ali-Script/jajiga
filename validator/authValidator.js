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

    Password:
        Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,999}$'))
            .required(),

    ConfirmPassword:
        Joi.any().valid(Joi.ref('Password')).required(),

    // SignUpMethod:
    //     Joi.string().required().valid("email", 'phone'),

    // Email:
    //     Joi.string()
    //         .email({ tlds: { allow: false } })
    //         .when("SignUpMethod", { is: "email", then: Joi.required() }),

    Phone:
        Joi.string()
            .min(11)
            .max(11)
            .when("SignUpMethod", { is: "phone", then: Joi.required() }),
});

module.exports = schema;