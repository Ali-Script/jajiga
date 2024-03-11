const mongoose = require('mongoose');
const newsletterModel = require("./model")
const Evalidator = require("email-validator");

exports.create = async (req, res) => {
    try {
        if (!req.body.email) return res.status(401).json({ message: 'email required' })
        const email = req.body.email
        if (!Evalidator.validate(email)) return res.status(422).json("E_mail Format Wrong !!");

        const findDup = await newsletterModel.findOne({ email }).lean()
        if (findDup) return res.status(404).json({ message: "this email is already in use" })

        const news = await newsletterModel.create({ email })
        return res.status(200).json(news)
    } catch (err) { return res.status(422).json({ error: err.message }) }
}
exports.getAll = async (req, res) => {
    try {
        const news = await newsletterModel.find({}).sort({ _id: -1 }).lean()
        if (news.length === 0) return res.status(404).json({ message: "no newsletter found" })
        return res.status(200).json(news)
    } catch (err) { return res.status(422).json({ error: err.message }) }
}