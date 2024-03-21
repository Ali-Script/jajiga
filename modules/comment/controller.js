const mongoose = require('mongoose');
const commentModel = require("./model")
const villaModel = require("./../villas/model")
const joi = require("./../../validator/commentValidator")


exports.create = async (req, res) => {
    try {
        const { body, villa, score } = req.body;

        const validatorr = joi.validate(req.body)
        if (validatorr.error) return res.status(409).json({ message: validatorr.error.details })

        const validate = mongoose.Types.ObjectId.isValid(villa);
        if (!validate) return res.status(400).send({ error: 'Invalid Object Id' })

        const villaId = await villaModel.findOne({ _id: villa })
        if (!villaId) return res.status(404).json({ message: "villa Not Found", err: 404 })

        const comment = await commentModel.create({
            body,
            creator: req.user._id,
            villa: villa._id,
            score,
            isAccept: 0,
            isAnswer: 0,
            haveAnswer: 0,
        })
        return res.status(200).json(comment)
    } catch (err) { return res.status(422).json(err.message) }
}
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) {
            return res.status(422).json({ message: "Invalid ObjectId !!" })
        }

        const comment = await commentModel.findOneAndDelete({ _id: id })

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }
        if (comment.isAnswer === 1) {
            const commentt = await commentModel.findOneAndUpdate({ _id: comment.mainCommentID }, { haveAnswer: 0 })
        }

        if (comment.answer) {
            const deleteanswer = await commentModel.findOneAndDelete({ _id: comment.answer })
        }

        return res.json({ message: `Comment removed `, id: comment._id })
    }
    catch (err) {
        return res.status(422).json(err.message)
    }
}
// test 1
exports.accept = async (req, res) => {
    try {
        const { id } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) {
            return res.status(422).json({ message: "Invalid ObjectId !!" })
        }

        const comment = await commentModel.findOneAndUpdate({ _id: id }, { isAccept: 1 })

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }
        else if (comment.isAccept == 1) {
            return res.status(422).json({ message: 'Comment is Already Accepted ! ' })
        }

        return res.json({ message: 'Comment Accepted (:' })
    } catch (err) { return res.status(422).json(err.message) }
}
exports.reject = async (req, res) => {
    try {

        const { id } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) {
            return res.status(422).json({ message: "Invalid ObjectId !!" })
        }

        const comment = await commentModel.findOneAndUpdate({ _id: id }, { isAccept: 0 })

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }
        else if (comment.isAccept == 0) {
            return res.status(422).json({ message: 'Comment is Already Rejected ! ' })
        }

        return res.json({ message: 'Comment Rejected (:' })
    }
    catch (err) {
        return res.status(422).json(err.message)
    }
}
exports.answer = async (req, res) => {
    try {
        const { body } = req.body;
        const { id } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) return res.status(422).json({ message: "Invalid ObjectId !!" })

        const comment = await commentModel.findOne({ _id: id })
        if (!comment) return res.status(404).json({ message: 'Comment not found' })
        else if (comment.isAccept == 0) return res.status(422).json({ message: 'Comment has not accepted yet !' })

        const Updatecomment = await commentModel.updateOne({ _id: id }, { haveAnswer: 1 })

        const answer = await commentModel.create({
            body,
            creator: req.user._id,
            course: comment.course,
            isAccept: 0,
            isAnswer: 1,
            mainCommentID: comment._id
        })

        const setandser = await commentModel.findOneAndUpdate({ _id: id }, { $set: { answer: answer._id } })
        return res.status(200).json(answer)

    } catch (err) { return res.status(422).json({ message: err.message }) }
}
// test 1
exports.getAll = async (req, res) => {
    try {

        const comments = await commentModel.find({})
            .populate("course", "title")
            .populate("creator", "UserName")
            .sort({ _id: -1 })
            .lean();

        let orderedComment = []

        comments.forEach(mainComment => {
            comments.forEach(answerComment => {

                if (String(mainComment._id) == String(answerComment.mainCommentID)) {

                    orderedComment.push({
                        ...mainComment,
                        course: answerComment.course.title,
                        creator: answerComment.creator.UserName,
                        answerComment
                    })
                }
            })
        })

        const noAnswerComments = await commentModel.find({ isAnswer: 0, haveAnswer: 0 })
            .populate("course", "title")
            .populate("creator", "UserName")
            .sort({ _id: -1 })
            .lean();
        noAnswerComments.forEach(i => orderedComment.push({ ...i }))

        return res.json(orderedComment)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
// test 1