const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    User: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    Villa: {
        type: mongoose.Types.ObjectId,
        ref: "Villa"
    },
    deleted: {
        type: "number",
        enum: [0, 1],
        default: 0
    },
}, { timestamps: true })

const model = mongoose.model("User-Villa", schema);
module.exports = model;