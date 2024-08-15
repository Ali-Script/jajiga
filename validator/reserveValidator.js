const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


const schema = Joi.object({

    villa: Joi.objectId(),

    date: Joi.object().keys({
        from: Joi.string().required(),
        to: Joi.string().required()
    })
})
module.exports = schema;