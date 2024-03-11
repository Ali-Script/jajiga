const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: 'string',
        required: true
    },
    reason: {
        type: 'string'
    },
}, { timestamps: true })

const model = mongoose.model("ban-users", schema);
module.exports = model;