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

    timing: Joi.array().items(Joi.object().items(Joi.object().items(Joi.number())))
        .required(),

    price: Joi.array().items(Joi.object().items(Joi.object().items(Joi.number())))
        .required(),

    rules: Joi.array().items(Joi.object().items(Joi.string()))
        .required(),
});

module.exports = schema;