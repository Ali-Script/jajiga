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
}, { timestamps: true })

const model = mongoose.model("User-Villa", schema);
module.exports = model;