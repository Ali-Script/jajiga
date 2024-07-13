const mongoose = require('mongoose');
const { description } = require('../../validator/villaValidator');
const { required } = require('joi');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: 'string',
    },
    address: {
        state: {
            type: "string",
        },
        city: {
            type: "string",
        },
        address: {
            type: "string",
        }
    },
    coordinates: {
        x: {
            type: "string",
        },
        y: {
            type: "string",
        }
    },
    cover: {
        type: Array,
    },
    aboutVilla: {
        villaSpace: {
            type: "string",
            enum: ["privetRoom", "lockedRoom", "semiClosedRoom", "commonRoom"],

        },
        villaType: {
            type: mongoose.Types.ObjectId,
            ref: "Users",

        },
        villaZone: {
            type: "string",
            enum: ["littoral", "silvan", "summerVilla", "desertHouse", "townHouse", "suburbanHouse", "cottage"],

        },
        aboutVilla: {
            type: "string", require: true
        }
    },
    capacity: {
        normalCapacity: {
            type: "number",
        },
        maxCapacity: {
            type: "number",
        },
        buildingSize: {
            type: "number",
        },
        fuundationSize: {
            type: "number",
        },
        bedRoom: {
            type: "number",
        },
        description: {
            type: "string",
        },
    },
    facility: {
        facility: {
            furniture: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "مبلمان" }
            },
            fridge: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "یخچال" }
            },
            tv: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "تلویزیون" }
            },
            diningTable: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "میز نهارخوری" }
            },
            heatingSystem: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "سیستم گرمایشی" }
            },
            coolingSystem: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "سیستم سرمایش" }
            },
            parking: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "پارکینگ" }
            },
            Eightball: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "بیلیارد" }
            },
            wifi: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "wifi اینترنت " }
            },
            toilet: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "توالت فرهنگی" }
            },
            pool: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "استخر" }
            },
            moreFacility: {
                type: "string"
            }
        },
        sanitaryFacilities: {
            changeThePillow: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            changeTheBedsheet: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            chargingToiletPaper: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            dishSoap: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            chargingDishSoap: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            antiseptics: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            moreSanitaryFacilities: {
                type: "string"
            }
        }
    },
    price: {
        newYear: { type: "number" },
        spring: {
            midWeek: { type: "number" },
            holidays: { type: "number" },
            peakDays: { type: "number" },
        },
        summer: {
            midWeek: { type: "number" },
            holidays: { type: "number" },
            peakDays: { type: "number" },
        },
        autumn: {
            midWeek: { type: "number" },
            holidays: { type: "number" },
            peakDays: { type: "number" },
        },
        winter: {
            midWeek: { type: "number" },
            holidays: { type: "number" },
            peakDays: { type: "number" },
        }
    },
    rules: {
        pet: {
            type: "boolean",
        },
        music: {
            type: "boolean",
        },
        smoke: {
            type: "boolean",
        },
        more: {
            type: "string",
        }
    },
    step: {
        type: "number"
    },
    finished: {
        type: Boolean
    }
}, { timestamps: true })

const model = mongoose.model("Villa", schema);
module.exports = model;

