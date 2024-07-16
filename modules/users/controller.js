const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const villaModel = require('./../villas/model');
const userVillaModel = require('./../user-villa/model');
// const codeModel = require('./../authcode/model');
const validator = require("email-validator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const joi = require("./../../validator/authValidator");

exports.getAll = async (req, res) => {
    try {
        const users = await userModel.find().sort({ _id: -1 }).lean();
        if (users.length == 0) return res.status(404).json({ statusCode: 404, message: 'No user found !' })

        const allUsers = []

        users.forEach(user => {
            Reflect.deleteProperty(user, "password")
            allUsers.push(user)
        })

        return res.status(200).json({ statusCode: 200, users: allUsers })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.getOne = async (req, res) => {
    try {
        const phone = req.params.phone

        const user = await userModel.findOne({ phone }).lean();
        if (!user || user.length == 0) return res.status(404).json({ statusCode: 404, message: 'No user found !' })

        Reflect.deleteProperty(user, "password")

        return res.status(200).json({ statusCode: 200, user })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.delete = async (req, res) => {
    try {
        const phone = req.params.phone

        const user = await userModel.findOne({ phone }).lean();
        if (!user || user.length == 0) return res.status(404).json({ statusCode: 404, message: 'No user found !' })

        const villa = await villaModel.deleteMany({ user: user._id }).lean()
        const userVilla = await userVillaModel.deleteMany({ user: user._id }).lean()
        const removeuser = await userModel.findOneAndDelete({ phone }).lean()

        return res.status(200).json({ statusCode: 200, message: "succ !" })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.setAvatar = async (req, res) => {
    try {
        const user = await userModel.updateOne({ _id: req.user._id }, { $set: { avatar: req.file.filename } })
        if (!user || user.length == 0) return res.status(404).json({ statusCode: 404, message: 'No user found !' })

        return res.status(200).json({ statusCode: 200, message: "succ !" })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.changeName = async (req, res) => {
    try {
        const user = req.user
        const { firstName, lastName } = req.body

        const regex = /[0-9]+/;
        if (regex.test(firstName) | regex.test(lastName)) return res.status(406).json({ statusCode: 406, message: "number is not allowed in name" })

        const update = await userModel.findOneAndUpdate({ _id: user._id }, { firstName, lastName })

        const finduser = await userModel.findOne({ _id: user._id }).lean()
        Reflect.deleteProperty(finduser, "password")

        return res.status(200).json({ statusCode: 200, message: "user updated succ !", user: finduser })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.promotion = async (req, res) => {
    // try {
    //     const Email = req.params.email;
    //     const validate = validator.validate(Email);
    //     if (!validate) return res.status(400).send({ error: 'Invalid Email' })

    //     const user = await userModel.findOne({ Email })
    //     if (!user || user.length == 0) return res.status(404).send({ message: "user not found" })
    //     if (user.Role === "admin") return res.status(422).send({ message: "this user is already admin" })

    //     const makeadmin = await userModel.updateOne({ Email }, { Role: "admin" })
    //     return res.status(200).send({ message: "succ" })
    //} catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.demotion = async (req, res) => {
    // try {
    //     const Email = req.params.email;
    //     const validate = validator.validate(Email);
    //     if (!validate) return res.status(400).send({ error: 'Invalid Email' })

    //     const user = await userModel.findOne({ Email })
    //     if (!user || user.length == 0) return res.status(404).send({ message: "user not found" })
    //     if (user.Role === "user") return res.status(422).send({ message: "this user is already user" })

    //     const makeadmin = await userModel.updateOne({ Email }, { Role: "user" })
    //     return res.status(200).send({ message: "succ" })
    // } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.forgetPassword = async (req, res) => {
    // try {
    //     const Email = req.body.Email;
    //     const validate = validator.validate(Email);
    //     if (!validate) return res.status(400).send({ error: 'Invalid Email' })

    //     const user = await userModel.findOne({ Email })
    //     if (!user || user.length == 0) return res.status(404).send({ message: "user not found" })

    //     const code = Math.floor(Math.random() * 1000000)


    //     let transport = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //             user: "ali.prg01@gmail.com",
    //             pass: "eopj hyfz fyha nduv"
    //         }
    //     })

    //     const mailOptions = {
    //         from: "ali.prg01@gmail.com",
    //         to: req.body.Email,
    //         subject: "jajigacode",
    //         text: `${code}`,
    //     }

    //     transport.sendMail(mailOptions, async (e, i) => {

    //         if (e) {
    //             return res.status(500).json({ error: e.message })
    //         }
    //         else {
    //             const setcode = await codeModel.create({
    //                 Code: code,
    //                 Email,
    //                 ExpiresIn: Date.now() + 120000,
    //             })
    //             if (!setcode) return res.status(500).json({ err: "Server Err" })

    //             return res.status(200).json({ message: "Email Sended !" })
    //         }
    //     })

    // } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.forgetPasswordCode = async (req, res) => {
    // try {
    //     const { Code, Password, ConfirmPassword, Email } = req.body

    //     const Passregex = new RegExp('^[a-zA-Z0-9]{8,999}$')
    //     const test = Password.match(Passregex)

    //     if (test == null) return res.status(422).send({ message: "Password mus have a number and captal letter and more than 8 char" })
    //     if (Password != ConfirmPassword) return res.status(422).send({ message: "Confirm password is not equal with password!" });


    //     const getCode = await codeModel.find({ Email }).sort({ _id: -1 }).lean()
    //     if (getCode.length == 0) return res.status(404).json({ message: `There is no Code for : ${Email}` })

    //     if (getCode[0].Code == Code && getCode[0].ExpiresIn > Date.now()) {
    //         const salt = bcrypt.genSaltSync(10);
    //         const hash = bcrypt.hashSync(Password, salt);

    //         const changePass = await userModel.updateOne({ Email }, { Password: hash })
    //     }
    //     else if (getCode[0].Code != Code) {

    //         return res.status(400).json({ message: "Invalid Code !" })
    //     }
    //     else if (getCode[0].ExpiresIn < Date.now()) {

    //         return res.status(422).json({ message: "Code Has Expired !" })
    //     }
    //     return res.status(200).send({ message: "Password changed" })
    // } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}


