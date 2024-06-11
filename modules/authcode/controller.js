const mongoose = require('mongoose');
const validator = require("email-validator");


exports.getOne = async (req, res) => {
    try {

        const email = req.params.email
        const validate = validator.validate(email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const code = await codeModel.find({ Email: email }).sort({ _id: -1 }).lean();
        if (code.length == 0) return res.status(404).send({ status: false, message: "There is no code for this email !" })

        return res.status(200).json(code);
    } catch (err) { return res.status(422).send(err.message); }
}
exports.getAll = async (req, res) => {
    try {
        const code = await codeModel.find().sort({ _id: -1 }).lean();
        if (code.length == 0) return res.status(404).send({ status: false, message: "There is no code !" })

        return res.status(200).json(code);
    } catch (err) { return res.status(422).send(err.message); }
}
exports.deleteAll = async (req, res) => {
    try {
        const code = await codeModel.find().lean();
        if (code.length == 0) return res.status(404).send({ status: false, message: "There is no code !" })

        const Delcode = await codeModel.deleteMany();
        if (code.length == 0) return res.status(500).send({ status: false, message: "Can not delete codes !" })

        return res.status(200).json("succ !");
    } catch (err) { return res.status(422).send(err.message); }
}