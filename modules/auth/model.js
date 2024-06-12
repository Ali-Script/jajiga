const mongoose = require('mongoose');
const { required } = require('../../validator/authValidator');

const schema = new mongoose.Schema({
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string'
    },
    phone: {
        type: 'string',
        required: true
    },
    role: {
        type: 'string',
        enum: ['admin', 'user'],
        default: 'user'
    },
    avatar: {
        type: 'string',
    },
    refreshToken: {
        type: 'string',
    },
}, { timestamps: true })

const model = mongoose.model("User", schema);
module.exports = model;