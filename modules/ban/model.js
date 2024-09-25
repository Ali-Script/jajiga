const { required } = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    phone: {
        type: "string",
        required: true
    },
    bannedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    reason: {
        type: "string",
        enum: [
            "violation of Terms of Service",
            "spamming",
            "harassment or Abuse",
            "illegal Activities",
            "hacking or Security Breaches",
            "inappropriate Content",
            "impersonation",
            "fraudulent Activities",
            "multiple Account Abuse",
            "copyright Infringement"
        ],
    },
}, { timestamps: true })

const model = mongoose.model("ban-user", schema);
module.exports = model;