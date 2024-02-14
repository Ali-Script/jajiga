const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    UserName: {
        type: 'string',
        required: true
    },
    Password: {
        type: 'string',
        required: true
    },
    Email: {
        type: 'string',
        required: true
    },
    refreshToken: {
        type: 'string',
        required: false
    },
}, { timestamps: true })

const model = mongoose.model("User", schema);
module.exports = model;