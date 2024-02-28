const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    state: {
        type: 'number',
        required: true
    },
    city: {
        type: 'string',
        required: true
    },
    description: {
        type: "string",
        required: true
    },
    cover: [
        {
            type: "string",
            required: true
        }
    ],
    map: [
        {
            type: "string",
            required: true
        }
    ],
    capAndSize: [
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
            }
        }
    ],
    bedRoom: [
        {
            bedRoom: {
                type: "number",
                required: true
            },
            singleBed: {
                type: "number",
                default: 0

            },
            doubleBed: {
                type: "number",
                default: 0
            },
            traditionalBed: {
                type: "number",
                default: 0
            }
        }
    ],
    facility: [
        {
            primaryFacility: [{ type: "string" }],
            moreFacility: [{ type: "string" }],
        }
    ],
    sanitaryFacilities: [
        {
            primarySanitaryFacilities: [{ type: "string" }],
            moreSanitaryFacilities: [{ type: "string" }],
        }
    ],
    phone: {
        type: "string"
    },

}, { timestamps: true })

const model = mongoose.model("code", schema);
module.exports = model;