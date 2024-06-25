const Joi = require('joi');

const capacitySchema = Joi.object().keys({
    normalCapacity: Joi.number().required(),
    maxCapacity: Joi.number().required(),
    buildingSize: Joi.number().required(),
    fuundationSize: Joi.number().required(),
    bedRoom: Joi.number().required(),
    description: Joi.string().required()
});

const validateCapacity = (capacity) => {
    const result = capacitySchema.validate(capacity);
    if (result.error) {
        throw new Error(result.error.details.map(err => err.message).join(', '));
    }
    return result.value;
};