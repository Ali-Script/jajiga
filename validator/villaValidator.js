const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const schema = Joi.object({
    title: Joi.string()
    ,
    address: Joi.object().keys({
        state: Joi.string(),
        city: Joi.string(),
        address: Joi.string(),
    }),
    coordinates: Joi.object().keys({
        x: Joi.string(),
        y: Joi.string(),
    }),
    cover: Joi.array().items(Joi.string())
        .min(3)
        .max(10)
    ,
    aboutVilla: Joi.object().keys({
        villaSpace: Joi.string().valid("privetRoom", "lockedRoom", "semiClosedRoom", "commonRoom"),
        villaType: Joi.objectId(),
        villaZone: Joi.string().valid("littoral", "silvan", "summerVilla", "desertHouse", "townHouse", "suburbanHouse", "cottage"),
        aboutVilla: Joi.string(),
    }),
    capacity: Joi.object().keys({
        normalCapacity: Joi.number(),
        maxCapacity: Joi.number(),
        buildingSize: Joi.number(),
        fuundationSize: Joi.number(),
        bedRoom: Joi.number(),
        description: Joi.string(),
    }),
    facility: Joi.object().keys({
        facility: Joi.object().keys({
            furniture: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            fridge: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            tv: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            diningTable: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            heatingSystem: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            coolingSystem: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            parking: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            Eightball: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            wifi: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            toilet: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            pool: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            moreFacility: Joi.string(),
        }),
        sanitaryFacilities: Joi.object().keys({
            changeThePillow: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            changeTheBedsheet: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            chargingToiletPaper: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            dishSoap: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            chargingDishSoap: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            antiseptics: Joi.object().keys({
                status: Joi.boolean(),
                description: Joi.string(),
            }),
            moreSanitaryFacilities: Joi.string(),
        }),
    }),
    price: Joi.object().keys({
        newYear: Joi.number(),
        spring: Joi.object().keys({
            midWeek: Joi.number(),
            holidays: Joi.number(),
            peakDays: Joi.number()
        }),
        summer: Joi.object().keys({
            midWeek: Joi.number(),
            holidays: Joi.number(),
            peakDays: Joi.number()
        }),
        autumn: Joi.object().keys({
            midWeek: Joi.number(),
            holidays: Joi.number(),
            peakDays: Joi.number()
        }),
        winter: Joi.object().keys({
            midWeek: Joi.number(),
            holidays: Joi.number(),
            peakDays: Joi.number()
        }),
    }),
    rules: Joi.object().keys({
        pet: Joi.boolean(),
        music: Joi.boolean(),
        smoke: Joi.boolean(),
        more: Joi.string(),
    }),
    step: Joi.number().required(),
    finished: Joi.boolean().required()
});

module.exports = schema;