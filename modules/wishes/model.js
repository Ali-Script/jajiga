const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    villa: {
        type: mongoose.Types.ObjectId,
        ref: "Villa",
        required: true
    }
}, { timestamps: true })

const model = mongoose.model("Wishes", schema);
module.exports = model;