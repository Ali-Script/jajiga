const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const codeModel = require('./../authcode/model');
const validator = require("email-validator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

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
        // const { Email, UserName, Password, ConfirmPassword } = req.body

        // const validator = joi.validate(req.body)
        // if (validator.error) return res.status(409).json({ message: validator.error.details })


        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(Password, salt);

        // const user = await userModel.updateOne({ email: Email }, {
        //     UserName,
        //     Password: hash
        // })
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
exports.forgetPassword = async (req, res) => {
    try {
        const Email = req.body.Email;
        const validate = validator.validate(Email);
        if (!validate) return res.status(400).send({ error: 'Invalid Email' })

        const user = await userModel.findOne({ Email })
        if (!user || user.length == 0) return res.status(404).send({ message: "user not found" })

        const code = Math.floor(Math.random() * 1000000)


        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ali.prg01@gmail.com",
                pass: "eopj hyfz fyha nduv"
            }
        })

        const mailOptions = {
            from: "ali.prg01@gmail.com",
            to: req.body.Email,
            subject: "jajigacode",
            text: `${code}`,
        }

        transport.sendMail(mailOptions, async (e, i) => {

            if (e) {
                return res.status(500).json({ error: e.message })
            }
            else {
                const setcode = await codeModel.create({
                    Code: code,
                    Email,
                    ExpiresIn: Date.now() + 120000,
                })
                if (!setcode) return res.status(500).json({ err: "Server Err" })

                return res.status(200).json({ message: "Email Sended !" })
            }
        })

    } catch (err) { return res.status(422).send(err.message); }
}
exports.forgetPasswordCode = async (req, res) => {
    try {
        const { Code, Password, ConfirmPassword, Email } = req.body

        const Passregex = new RegExp('^[a-zA-Z0-9]{8,999}$')
        const test = Password.match(Passregex)

        if (test == null) return res.status(422).send({ message: "Password mus have a number and captal letter and more than 8 char" })
        if (Password != ConfirmPassword) return res.status(422).send({ message: "Confirm password is not equal with password!" });


        const getCode = await codeModel.find({ Email }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ message: `There is no Code for : ${Email}` })

        if (getCode[0].Code == Code && getCode[0].ExpiresIn > Date.now()) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(Password, salt);

            const changePass = await userModel.updateOne({ Email }, { Password: hash })
        }
        else if (getCode[0].Code != Code) {

            return res.status(400).json({ message: "Invalid Code !" })
        }
        else if (getCode[0].ExpiresIn < Date.now()) {

            return res.status(422).json({ message: "Code Has Expired !" })
        }
        return res.status(200).send({ message: "Password changed" })
    } catch (err) { return res.status(422).send(err.message); }
}

