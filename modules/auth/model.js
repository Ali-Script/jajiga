const mongoose = require('mongoose');


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
    aboutMe: {
        type: 'string',
    },
    gender: {
        type: 'string',
        enum: ['male', 'female'],
    },
    refreshToken: {
        type: 'string',
    },
}, { timestamps: true })

const model = mongoose.model("User", schema);
module.exports = model;