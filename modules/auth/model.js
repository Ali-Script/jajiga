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
}, { timestamps: true })

const model = mongoose.model("User", schema);
module.exports = model;