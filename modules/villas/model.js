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
            ref: "Categories",

        },
        villaZone: {
            type: "string",
            enum: ["littoral", "silvan", "summerVilla", "desertHouse", "townHouse", "suburbanHouse", "cottage"],

        },
        aboutVilla: {
            type: "string",
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
                description: { type: "string" },
            },
            fridge: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            tv: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            diningTable: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            heatingSystem: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            coolingSystem: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            parking: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            eightball: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            wifi: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            toilet: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            pool: {
                status: { type: Boolean },
                description: { type: "string" },
            },
            moreFacility: {
                type: "string"
            }
        },
        sanitaryFacilities: {
            changeThePillow: {
                status: { type: Boolean },
            },
            changeTheBedsheet: {
                status: { type: Boolean },
            },
            chargingToiletPaper: {
                status: { type: Boolean },
            },
            dishSoap: {
                status: { type: Boolean },
            },
            chargingDishSoap: {
                status: { type: Boolean },
            },
            antiseptics: {
                status: { type: Boolean },
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
    },
    disable: {
        type: Boolean,
        default: false
    },
    oldPics: {
        type: "string",
    },
    isAccepted: {
        type: "string",
        enum: ["true", "false", "rejected"],
        default: "false"
    }
}, { timestamps: true })

const model = mongoose.model("Villa", schema);
module.exports = model;

