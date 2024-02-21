const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const validator = require("email-validator");

exports.getAll = async (req, res) => {
    try {
        const users = await userModel.find().sort({ _id: -1 }).lean();
        if (users.length == 0) return res.status(404).json({ status: false, message: 'No user found !' })

        return res.status(200).json({ status: true, users })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.getOne = async (req, res) => {
    try {
        const email = req.params.email
        const validate = validator.validate(email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const user = await userModel.findOne({ Email: email }).lean();
        if (!user || user.length == 0) return res.status(404).json({ status: false, message: 'No user found !' })

        Reflect.deleteProperty(user, "Password")

        return res.status(200).json({ status: true, user })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.delete = async (req, res) => {
    try {
        const email = req.params.email
        const validate = validator.validate(email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const user = await userModel.findOneAndDelete({ Email: email }).lean();
        if (!user || user.length == 0) return res.status(404).json({ status: false, message: 'No user found !' })

        return res.status(200).json("succ !")
    } catch (err) { return res.status(422).send(err.message); }
}
exports.setAvatar = async (req, res) => {
    try {

    } catch (err) { return res.status(422).send(err.message); }
}
exports.update = async (req, res) => {
    try {

    } catch (err) { return res.status(422).send(err.message); }
}
