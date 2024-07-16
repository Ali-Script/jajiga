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
                placeHolder: { type: "string" },
                title: { type: "string", default: "مبلمان" },
                icon: { type: "string", default: "" },
                id: { type: "number", default: 1 }
            },
            fridge: {
                status: { type: Boolean },
                icon: { type: "string", default: "" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "یخچال" },
                id: { type: "number", default: 2 }
            },
            tv: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "تلویزیون" },
                id: { type: "number", default: 3 }
            },
            diningTable: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "میز نهارخوری" },
                id: { type: "number", default: 4 }
            },
            heatingSystem: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "سیستم گرمایشی" },
                id: { type: "number", default: 5 }
            },
            coolingSystem: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "سیستم سرمایش" },
                id: { type: "number", default: 6 }
            },
            parking: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "پارکینگ" },
                id: { type: "number", default: 7 }
            },
            eightball: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "بیلیارد" },
                id: { type: "number", default: 8 }
            },
            wifi: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "wifi اینترنت " },
                id: { type: "number", default: 9 }
            },
            toilet: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "توالت فرهنگی" },
                id: { type: "number", default: 10 }
            },
            pool: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "استخر" },
                id: { type: "number", default: 11 }
            },
            moreFacility: {
                type: "string"
            }
        },
        sanitaryFacilities: {
            changeThePillow: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "تعویض رو بالشتی و رو تختی" },
                id: { type: "number", default: 1 }
            },
            changeTheBedsheet: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "تعویض ملحفه" },
                id: { type: "number", default: 2 }
            },
            chargingToiletPaper: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "شارژ کاغد توالت" },
                id: { type: "number", default: 3 }
            },
            dishSoap: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "مایع ظرفشویی" },
                id: { type: "number", default: 4 }
            },
            chargingDishSoap: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "شارژ مایع دستشویی با صابون" },
                id: { type: "number", default: 5 }
            },
            antiseptics: {
                status: { type: Boolean },
                icon: { type: "string" },
                placeHolder: { type: "string" },
                title: { type: "string", default: "مواد ضدعفونی کننده" },
                id: { type: "number", default: 6 }
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

