const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    message: {
        type: "string",
        required: true
    },
    id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    seen: {
        type: "number",
        enum: [0, 1],
        default: 0
    },
    sendBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    allUsers: {
        type: "number",
        enum: [0, 1],
        default: 1
    },
}, { timestamps: true });

const notification = mongoose.model("notification", schema)

module.exports = notification;

