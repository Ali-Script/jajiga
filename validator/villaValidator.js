const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const schema = Joi.object({
    title: Joi.string()
        .required(),
    address: Joi.object().keys({
        state: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required(),
    }),
    coordinates: Joi.object().keys({
        x: Joi.string().required(),
        y: Joi.string().required(),
    }),
    cover: Joi.array().items(Joi.string())
        .min(3)
        .max(10)
        .required(),
    aboutVilla: Joi.object().keys({
        villaSpace: Joi.string().valid("privetRoom", "lockedRoom", "semiClosedRoom", "commonRoom").required(),
        villaType: Joi.objectId().required(),
        villaZone: Joi.string().valid("littoral", "silvan", "summerVilla", "desertHouse", "townHouse", "suburbanHouse", "cottage").required(),
        aboutVilla: Joi.string().required(),
    }),
    capacity: Joi.object().keys({
        normalCapacity: Joi.number().required(),
        maxCapacity: Joi.number().required(),
        buildingSize: Joi.number().required(),
        fuundationSize: Joi.number().required(),
        bedRoom: Joi.number().required(),
        description: Joi.string().required(),
    }),
    facility: Joi.object().keys({
        facility: Joi.object().keys({
            furniture: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            fridge: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            tv: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            diningTable: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            heatingSystem: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            coolingSystem: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            parking: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            Eightball: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            wifi: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            toilet: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            pool: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            moreFacility: Joi.string().required(),
        }),
        sanitaryFacilities: Joi.object().keys({
            changeThePillow: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            changeTheBedsheet: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            chargingToiletPaper: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            dishSoap: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            chargingDishSoap: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            antiseptics: Joi.object().keys({
                status: Joi.boolean().required(),
                description: Joi.string().required(),
            }),
            moreSanitaryFacilities: Joi.string().required(),
        }),
    }),
    price: Joi.object().keys({
        newYear: Joi.number().required(),
        spring: Joi.object().keys({
            midWeek: Joi.number().required(),
            holidays: Joi.number().required(),
            peakDays: Joi.number().required()
        }),
        summer: Joi.object().keys({
            midWeek: Joi.number().required(),
            holidays: Joi.number().required(),
            peakDays: Joi.number().required()
        }),
        autumn: Joi.object().keys({
            midWeek: Joi.number().required(),
            holidays: Joi.number().required(),
            peakDays: Joi.number().required()
        }),
        winter: Joi.object().keys({
            midWeek: Joi.number().required(),
            holidays: Joi.number().required(),
            peakDays: Joi.number().required()
        }),
    }),
    rules: Joi.object().keys({
        pet: Joi.boolean().required(),
        music: Joi.boolean().required(),
        smoke: Joi.boolean(),
        more: Joi.string().required(),
    })
});

module.exports = schema;