const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    message: {
        type: "string",
        required: true
    },
    users: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }],
    sendBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    ExpiredTimeByHours: {
        type: "number",
        required: true
    },
}, { timestamps: true });

const notification = mongoose.model("notification", schema)

module.exports = notification;

