const mongoose = require('mongoose');
const villaModel = require('./../villas/model');
const commentModel = require('./../comment/model');
const userVilla = require('./../user-villa/model');
const joi = require("./../../validator/villaValidator");
const validator = require("email-validator");
const { func } = require('joi');

exports.add = async (req, res) => {
    try {
        const { title, address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, price, rules } = req.body;
        req.body = { title, address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, price, rules }
        const validatorr = joi.validate(req.body)
        console.log(validator.error);
        if (validatorr.error) return res.status(409).json({ message: validator.error.details })

        const ifDUPLC = await villaModel.find()

        if (ifDUPLC.length >= 1) {
            let flag = false;

            ifDUPLC.forEach(data => {
                let userobj = data.map[0].toObject()
                Reflect.deleteProperty(userobj, "_id")
                if (userobj.first === map[0].first) flag = true
            })
            if (flag == true) return res.status(409).json({ message: "this location is already exist" })
        }

        const covers = req.files;
        const coverFiles = []
        covers.forEach(i => coverFiles.push(i.filename))

        const newVilla = await villaModel.create({
            title,
            user: req.user._id,
            email: req.user.Email,
            address,
            map,
            cover: coverFiles,
            description,
            capAndSizeAndRooms,
            facility,
            sanitaryFacilities,
            timing,
            price,
            rules
        })
        if (!newVilla) return res.status(500).json({ message: "can not add data to the database" })

        const isAlreadyExist = await userVilla.findOne({ User: req.user._id, Villa: newVilla._id })
        if (isAlreadyExist) {
            return res.status(404).json({ message: "this location is already exists!" })
        }

        const create = await userVilla.create({
            User: req.user._id,
            Villa: newVilla._id,
        })

        return res.status(200).json({ message: "Succ !" })

    } catch (err) { return res.status(422).json(err.message); }
}
exports.getAll = async (req, res) => {
    try {
        const villas = await villaModel.find({}).sort({ _id: -1 }).lean()
        if (villas.length == 0) return res.status(404).json({ message: "there is no villa!" })

        return res.status(200).json(villas)
    } catch (err) { return res.status(422).send(err.message); }
}
exports.getOne = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).send({ error: 'Invalid Object Id' })

        const villa = await villaModel.find({ _id: id }).sort({ _id: -1 }).lean()
        if (villa.length == 0) return res.status(404).json({ message: "villa not found 404 ! " })



        const comments = await commentModel.find({ villa: id, isAccept: 1 })
            .populate("villa", "_id title")
            .populate("creator", "UserName")
            .sort({ _id: -1 })
            .lean();

        let orderedComment = []

        comments.forEach(mainComment => {
            comments.forEach(answerComment => {

                if (String(mainComment._id) == String(answerComment.mainCommentID)) {

                    orderedComment.push({
                        ...mainComment,
                        villa: answerComment.villa.title,
                        creator: answerComment.creator.UserName,
                        answerComment
                    })
                }
            })
        })


        const noAnswerComments = await commentModel.find({ villa: id, isAnswer: 0, haveAnswer: 0 })
            .populate("villa", "_id title")
            .populate("creator", "UserName")
            .sort({ _id: -1 })
            .lean();

        noAnswerComments.forEach(i => orderedComment.push({ ...i }))

        return res.status(200).json({ villa, comments: orderedComment })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.myVillas = async (req, res) => {
    try {
        const email = req.user.email
        const villa = await villaModel.find(email).sort({ _id: -1 }).lean()
        if (villa.length == 0) return res.status(404).json({ message: "You have not added a villa yet " })
        return res.status(200).json(villa)
    } catch (err) { return res.status(422).send(err.message); }
}
exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).send({ error: 'Invalid Object Id' })

        const villa = await villaModel.findOneAndDelete({ _id: id })
        if (!villa) return res.status(404).json({ message: "Villa Not Found 404 ! " })

        const deleteComment = await commentModel.deleteMany({ villa: id })
        const removeuservilla = await villaModel.findOneAndUpdate({ villa: id }, { deleted: 1 })


        return res.status(200).json("Succ !")
    } catch (err) { return res.status(422).send(err.message); }
}
