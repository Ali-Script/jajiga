const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    villa: {
        type: mongoose.Types.ObjectId,
        ref: "Villa"
    },
    deleted: {
        type: "number",
        enum: [0, 1],
        default: 0
    },
}, { timestamps: true })

const model = mongoose.model("Ticket", schema);
module.exports = model;