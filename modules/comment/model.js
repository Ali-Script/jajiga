const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    villa: {
        type: mongoose.Types.ObjectId,
        ref: 'Villa'
    },
    isAccept: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    score: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5]
    },
    isAnswer: {
        type: Number,
        enum: [0, 1],
    },
    haveAnswer: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    mainCommentID: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
    },
    answer: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
    }],
    date: {
        type: String,
    }
}, { timestamps: true })

const commentModel = mongoose.model('Comment ', schema)
module.exports = commentModel 