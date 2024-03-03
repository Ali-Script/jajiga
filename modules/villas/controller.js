const mongoose = require('mongoose');
const villaModel = require('./../villas/model');
const userVilla = require('./../user-villa/model');
const joi = require("./../../validator/villaValidator");
const validator = require("email-validator");

exports.add = async (req, res) => {
    try {
        const { address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, price, rules } = req.body;
        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

        const ifDUPLC = await villaModel.findOne(map)
        if (ifDUPLC) {
            return res.status(409).json({ message: "this location is already exist" })
        }

        const covers = req.files;
        const coverFiles = []
        covers.forEach(i => coverFiles.push(i.filename))

        const newVilla = await villaModel.create({
            user: req.user._id,
            email: req.user.email,
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

    } catch (err) { return res.status(422).send(err.message); }
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
        const email = req.params.email
        const validate = validator.validate(email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const villa = await villaModel.find(email).sort({ _id: -1 }).lean()
        if (villa.length == 0) return res.status(404).json({ message: "This user has not added a villa yet " })

        return res.status(200).json(villa)
    } catch (err) { return res.status(422).send(err.message); }
}
exports.myVillas = async (req, res) => {
    try {
        const email = req.user.email
        const validate = validator.validate(email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const villa = await villaModel.find(email).sort({ _id: -1 }).lean()
        if (villa.length == 0) return res.status(404).json({ message: "You have not added a villa yet " })

        return res.status(200).json(villa)
    } catch (err) { return res.status(422).send(err.message); }
}
exports.delete = async (req, res) => {
    try {
        const id = req.params.User
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).send({ error: 'Invalid Object Id' })

        const villa = await villaModel.findOneAndDelete({ _id: id })
        if (!villa) return res.status(404).json({ message: "Villa Not Found 404 ! " })

        return res.status(200).json("Succ !")
    } catch (err) { return res.status(422).send(err.message); }
}
