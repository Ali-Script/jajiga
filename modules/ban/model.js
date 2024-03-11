const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    bannedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    reason: {
        type: 'string'
    },
}, { timestamps: true })

const model = mongoose.model("ban-users", schema);
module.exports = model;