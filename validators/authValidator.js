const Joi = require('joi');

const schema = Joi.object({
    UserName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    Password:
        Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
            .required(),
    ConfirmPassword:
        Joi.ref("Password"),
    Email:
        Joi.string()
            .email({ tlds: { allow: false } });
});

module.exports = schema;