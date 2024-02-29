const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    address: [
        {
            state: {
                type: "string",
                required: true
            },
            city: {
                type: "string",
                required: true
            },
            address: {
                type: "string",
                required: true
            }
        }
    ],
    map: [
        {
            first: {
                type: "string",
                required: true
            },
            sec: {
                type: "string",
                required: true
            }
        }
    ],
    cover: [
        {
            type: "string",
            required: true
        }
    ],
    description: {
        type: "string",
        required: true
    },
    capAndSizeAndRooms: [
        {
            normalcapacity: {
                type: "number",
                required: true
            },
            maxcapacity: {
                type: "number",
                required: true
            },
            buildingsize: {
                type: "number",
                required: true
            },
            fuundationSize: {
                type: "number",
                required: true
            },
            bedRoom: {
                type: "number",
                required: true
            },
            aboutBedRoom: {
                type: "string",
            },
        }
    ],
    facility: [
        {
            facility: [{
                title: { type: "string", required: true },
                description: { type: "string" },
            }],
            moreFacility: [{
                description: { type: "string" },
            }]
        }
    ],
    sanitaryFacilities: [
        {
            sanitaryFacility: [{
                title: { type: "string", required: true },
                description: { type: "string" },
            }],
            moreSanitaryFacility: [{
                description: { type: "string" },
            }]
        }
    ],
    timing: [
        {
            minimumStay: {
                type: "number",
                required: true,
            },
            deliveryTime: {
                from: { type: "number", required: true },
                to: { type: "number", required: true },
            },
            dischargeTime: {
                type: "number", required: true
            }
        }
    ],
    price: [
        {
            newYear: {
                type: "number",
                required: true,
            },
            spring: {
                midWeek: { type: "number", required: true },
                holidays: { type: "number", required: true },
                peakDays: { type: "number", required: true },
            },
            summer: {
                midWeek: { type: "number", required: true },
                holidays: { type: "number", required: true },
                peakDays: { type: "number", required: true },
            },
            autumn: {
                midWeek: { type: "number", required: true },
                holidays: { type: "number", required: true },
                peakDays: { type: "number", required: true },
            },
            winter: {
                midWeek: { type: "number", required: true },
                holidays: { type: "number", required: true },
                peakDays: { type: "number", required: true },
            }
        }
    ],
    rules: [
        {
            pet: {
                type: "boolean",
                required: true,
            },
            music: {
                type: "boolean",
                required: true,
            },
            smoke: {
                type: "boolean",
                required: true,
            },
            more: {
                type: "string",
            }
        }
    ],
    phone: {
        type: "string"
    },
}, { timestamps: true })

const model = mongoose.model("villa", schema);
module.exports = model;