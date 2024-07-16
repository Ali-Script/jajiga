const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    code: {
        type: 'number',
        required: true
    },
    for: {
        type: 'string',
        enum: ["auth", "pssword"],
        required: true
    },
    phone: {
        type: 'string',
        required: true
    },
    expiresIn: {
        type: "number",
        required: true
    },
    used: {
        type: 'number',
        enum: [0, 1],
        default: 0

    },
}, { timestamps: true })

const model = mongoose.model("OTP-Code", schema);
module.exports = model;