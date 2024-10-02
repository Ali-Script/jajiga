const mongoose = require('mongoose');
const moment = require('jalali-moment');
const commentModel = require("./model")
const villaModel = require("./../villas/model")
const joi = require("./../../validator/commentValidator")
let realTimeShamsiDate = moment().locale('fa').format('jYYYY/jM/jD');

exports.create = async (req, res) => {
    try {
        const { body, villa, score } = req.body;

        const validatorr = joi.validate(req.body)
        if (validatorr.error) return res.status(409).json({ statusCode: 409, message: validatorr.error.details })

        const validate = mongoose.Types.ObjectId.isValid(villa);
        if (!validate) return res.status(400).send({ statusCode: 400, message: 'Invalid Object Id' })

        const villaId = await villaModel.findOne({ _id: villa })
        if (!villaId) return res.status(404).json({ statusCode: 404, message: "villa Not Found", })
        else if (String(villaId.user) == String(req.user._id)) return res.status(425).json({ statusCode: 425, message: 'You cannot register a comment for your own villa' })

        let comment = new commentModel({
            body,
            creator: req.user._id,
            villa: villaId._id,
            score,
            isAnswer: 0,
            haveAnswer: 0,
            date: realTimeShamsiDate
        })
        comment = await comment.save();

        return res.status(200).json({ statusCode: 200, message: 'succ' })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.remove = async (req, res) => {
    try {
        const { commentID } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.commentID)
        if (!isvalidID) {
            return res.status(422).json({ statusCode: 422, message: "Invalid ObjectId !!" })
        }

        const comment = await commentModel.findOneAndDelete({ _id: commentID })

        if (!comment) {
            return res.status(404).json({ statusCode: 404, message: 'Comment not found' })
        }
        if (comment.isAnswer == 1) {
            const commentt = await commentModel.findOneAndUpdate({ _id: comment.mainCommentID }, { haveAnswer: 0, answer: [] })
        }

        if (comment.answer) {
            const deleteanswer = await commentModel.findOneAndDelete({ _id: comment.answer })
        }

        return res.status(200).json({ statusCode: 200, message: "Comment removed " })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.accept = async (req, res) => {
    try {
        const { commentID } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.commentID)
        if (!isvalidID) {
            return res.status(422).json({ statusCode: 422, message: "Invalid ObjectId !!" })
        }

        const comment = await commentModel.findOneAndUpdate({ _id: commentID }, { isAccept: "true" })

        if (!comment) {
            return res.status(404).json({ statusCode: 404, message: 'Comment not found' })
        }
        else if (comment.isAccept == "true") {
            return res.status(421).json({ statusCode: 421, message: 'Comment is Already Accepted ! ' })
        }

        return res.status(200).json({ statusCode: 200, message: 'Comment Accepted' })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.reject = async (req, res) => {
    try {

        const { commentID } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.commentID)
        if (!isvalidID) return res.status(422).json({ statusCode: 422, message: "Invalid ObjectId !!" })

        const comment = await commentModel.findOneAndUpdate({ _id: commentID }, { isAccept: "rejected" })

        if (!comment) return res.status(404).json({ statusCode: 404, message: 'Comment not found' })
        else if (comment.isAccept == "rejected") return res.status(421).json({ statusCode: 421, message: 'Comment is Already Rejected ! ' })

        return res.status(200).json({ statusCode: 200, message: 'Comment Rejected' })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.answer = async (req, res) => {
    try {

        const { body } = req.body;
        const { mainCommentID } = req.params;

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.mainCommentID)
        if (!isvalidID) return res.status(422).json({ statusCode: 422, message: "Invalid ObjectId !!" })

        const comment = await commentModel.findOne({ _id: mainCommentID }).populate("villa", "user")
        if (!comment) return res.status(404).json({ statusCode: 404, message: 'Comment not found' })
        else if (comment.isAccept == "false") return res.status(424).json({ statusCode: 424, message: 'The comment has not been accepted yet' })
        else if (comment.isAnswer == 1) return res.status(421).json({ statusCode: 421, message: 'this is an answer you cant reply answers' })
        else if (comment.answer.length >= 1) return res.status(423).json({ statusCode: 423, message: 'this comment already have a answer' })
        else if (String(comment.villa.user) != String(req.user._id)) return res.status(425).json({ statusCode: 425, message: 'you are not the owner of villa' })

        const Updatecomment = await commentModel.updateOne({ _id: mainCommentID }, { haveAnswer: 1 })

        let answer = new commentModel({
            body,
            creator: req.user._id,
            villa: comment.villa,
            isAnswer: 1,
            mainCommentID: comment._id,
            date: realTimeShamsiDate
        })

        answer = await answer.save();



        await commentModel.findOneAndUpdate({ _id: mainCommentID }, { $push: { answer: answer._id } })
        return res.status(200).json({ statusCode: 200, message: "succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getAll = async (req, res) => {
    try {

        const commentss = await commentModel.find({})
            .populate("villa", "_id")
            .populate("creator", "firstName lastName avatar")
            .sort({ _id: -1 })
            .lean();


        const rejectedComments = await commentModel.find({ isAccept: "rejected" }).lean()
        const comments = commentss.filter(villa => !rejectedComments.find(rejectedVilla => String(villa._id) === String(rejectedVilla._id)));

        let orderedComment = []


        comments.forEach(comment => {
            if (comment.mainCommentID) {
                let mainComment = comments.find(c => String(c._id) == String(comment.mainCommentID));
                if (mainComment) {
                    orderedComment.push({
                        ...mainComment,
                        villa: mainComment._id,
                        creator: comment.creator ? comment.creator : null,
                        answerComment: {
                            ...comment,
                            villa: mainComment._id
                        }
                    })
                }
            } else {
                orderedComment.push({ ...comment, villa: comment.villa._id });
            }
        })


        // const noAnswerComments = await commentModel.find({ isAnswer: 0, haveAnswer: 0 })
        //     .populate("villa", "_id title")
        //     .populate("creator", "firstName lastName avatar")
        //     .sort({ _id: -1 })
        //     .lean();
        // noAnswerComments.forEach(i => orderedComment.push({ ...i }))

        return res.status(200).json({ statusCode: 200, comment: orderedComment })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getAllRejectedComments = async (req, res) => {
    try {

        const rejectedComments = await commentModel.find({ isAccepted: "rejected" }).lean()

        return res.status(200).json({ statusCode: 200, rejectedComments })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
