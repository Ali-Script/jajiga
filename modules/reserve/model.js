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
    },
    date: {
        from: { type: String, required: true },
        to: { type: String, required: true }
    },
    price: {
        type: "String"
    }
}, { timestamps: true })

const model = mongoose.model("Book", schema);
module.exports = model;