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
    seen: {
        type: "number",
        enum: [0, 1],
        default: 0
    },
}, { timestamps: true });

const notification = mongoose.model("notification", schema)

module.exports = notification;

