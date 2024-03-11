const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    Email: {
        type: 'string',
        required: true
    },
    Used: {
        type: 'number',
        enum: [0, 1],
        default: 0

    },
}, { timestamps: true })

const model = mongoose.model("ban-users", schema);
module.exports = model;