const Joi = require('joi');

const schema = Joi.object({

    address: Joi.array().items(Joi.object().items(Joi.string()))
        .required(),

    map: Joi.array().items(Joi.object().items(Joi.string()))
        .required(),

    cover: Joi.array().items(Joi.string())
        .required(),

    description: Joi.string()
        .min(3)
        .max(9999)
        .required(),

    capAndSizeAndRooms: Joi.array().items(Joi.object().items(Joi.number().string()))
        .required(),

    facility: Joi.array().items(Joi.array().items(Joi.object().items(Joi.string())))
        .required(),

    sanitaryFacilities: Joi.array().items(Joi.array().items(Joi.object().items(Joi.string())))
        .required(),

    timing: Joi.array().items(Joi.object().items(Joi.string()))
        .required(),
    price: Joi.string()
        .min(3)
        .max(30)
        .required(),
    rules:
        Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,999}$'))
            .required(),
    phone:
        Joi.any().valid(Joi.ref('Password')).required(),
});

module.exports = schema;