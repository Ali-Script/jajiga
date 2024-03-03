const Joi = require('joi');

const schema = Joi.object({

    address: Joi.array().items(Joi.object()).items(Joi.string())
        .min(1)
        .required(),

    map: Joi.array().items(Joi.object()).items(Joi.string())
        .min(1)
        .required(),

    cover: Joi.array().items(Joi.string())
        .min(1)
        .required(),

    description: Joi.string()
        .min(3)
        .max(9999)
        .required(),

    capAndSizeAndRooms: Joi.array().items(Joi.object()).items(Joi.string(), Joi.number())
        .min(1)
        .required(),

    facility: Joi.array().items(Joi.array()).items(Joi.object()).items(Joi.string())
        .min(1)
        .required(),

    sanitaryFacilities: Joi.array().items(Joi.array()).items(Joi.object()).items(Joi.string())
        .min(1)
        .required(),

    timing: Joi.array().items(Joi.object()).items(Joi.object()).items(Joi.number())
        .min(1)
        .required(),

    price: Joi.array().items(Joi.object()).items(Joi.object()).items(Joi.number())
        .min(1)
        .required(),

    rules: Joi.array().items(Joi.object()).items(Joi.string())
        .min(1)
        .required(),
});

module.exports = schema;