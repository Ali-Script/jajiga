const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    code: {
        type: 'number',
    },
    for: {
        type: 'string',
        enum: ["auth", "password", "email"],
    },
    phone: {
        type: 'string',
    },
    email: {
        type: 'string',
    },
    expiresIn: {
        type: "number",
    },
    used: {
        type: 'number',
        enum: [0, 1],
        default: 0
    },
}, { timestamps: true })

const model = mongoose.model("OTP-Code", schema);
module.exports = model;