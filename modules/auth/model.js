const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    Password: {
        type: 'string',
        required: true
    },
    Email: {
        type: 'string'
    },
    Phone: {
        type: 'string'
    },
    Role: {
        type: 'string',
        enum: ['admin', 'user'],
        default: 'user'
    },
    Avatar: {
        type: 'string',
    },
    RefreshToken: {
        type: 'string',
    },
}, { timestamps: true })

const model = mongoose.model("User", schema);
module.exports = model;