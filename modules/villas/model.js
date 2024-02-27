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
    capAndSize: [
        {
            bedRoom: {
                type: "number",
                required: true
            },
            Maxcapacity: {
                type: "number",

            },
            Buildingsize: {
                type: "number",
            },
            FuundationSize: {
                type: "number",
            }
        }
    ],
    phone: {
        type: "string"
    },

}, { timestamps: true })

const model = mongoose.model("code", schema);
module.exports = model;