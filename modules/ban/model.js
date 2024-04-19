const { required } = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    Identifeir: {
        type: "string",
        required: true
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