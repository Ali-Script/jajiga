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
        const user = await userModel.updateOne({ _id: req.user._id }, { $set: { Avatar: req.file.filename } })
        if (!user || user.length == 0) return res.status(404).json({ status: false, message: 'No user found !' })

        return res.status(200).json("succ !")
    } catch (err) { return res.status(422).send(err.message); }
}
exports.update = async (req, res) => {
    try {
        const { Email, UserName, Password, ConfirmPassword } = req.body

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })


        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(Password, salt);

        const user = await userModel.updateOne({ email: Email }, {
            UserName,
            Password: hash
        })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.promotion = async (req, res) => {
    try {
        const Email = req.params.email;
        const validate = validator.validate(Email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const user = await userModel.findOne({ Email })
        if (!user || user.length == 0) return res.status(404).send({ message: "user not found" })
        if (user.Role === "admin") return res.status(422).send({ message: "this user is already admin" })

        const makeadmin = await userModel.updateOne({ Email }, { Role: "admin" })
        return res.status(200).send({ message: "succ" })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.demotion = async (req, res) => {
    try {
        const Email = req.params.email;
        const validate = validator.validate(Email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const user = await userModel.findOne({ Email })
        if (!user || user.length == 0) return res.status(404).send({ message: "user not found" })
        if (user.Role === "user") return res.status(422).send({ message: "this user is already user" })

        const makeadmin = await userModel.updateOne({ Email }, { Role: "user" })
        return res.status(200).send({ message: "succ" })
    } catch (err) { return res.status(422).send(err.message); }
}
