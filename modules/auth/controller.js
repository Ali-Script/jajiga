const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('./model')
const joi = require('./../../validator/authValidator');
const { signedCookie } = require('cookie-parser');
require("dotenv").config()


exports.auth = async (req, res) => {
    try {
        const { UserName, Email, Password, ConfirmPassword } = req.body;

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

        const ifDUPLC = await userModel.findOne({
            $or: [{ UserName }, { Email }]
        })

        if (ifDUPLC) {
            return res.status(409).json({ message: "User Name or Email is Duplicated" })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(Password, salt);

        const user = await userModel.create({
            UserName,
            Email,
            Password: hash
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "14 day" })
        res.cookie("token", token, {
            maxAge: 14 * 24 * 60 * 60,
            httpOnly: true,
            signed: true,
            secure: true
        })



        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ex@gmail.com", // your gmail
                pass: "your app password" // your app password
            }
        })

        const mailOptions = {
            from: "ex@gmail.com", // your gmail
            to: req.body.email, // send to 
            subject: "contactUs", // email subject
            text: req.body.answer, // email body
        }

        transport.sendMail(mailOptions, async (e, i) => {
            if (e) {
                return res.status(422).json({ error: e.message })
            }
            else {
                const x = await contactUs.updateOne({ email: req.body.email }, { answerd: 1 })
                return res.json({ message: "succ" })
            }
        })





        return res.status(200).json({ message: "success", token: token })
    } catch (err) { return res.status(500).send(err.message); }
}
exports.login = async (req, res) => {
    try {

        const user = await userModel.create({
            UserName: "perikb",
            Email: "perikb",
            Password: "perikb",
        })
    } catch (err) { return res.status(500).send(err.message); }
}
exports.getme = async (req, res) => {
    try {

    } catch (err) { return res.status(500).send(err.message); }
}