const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const villaModel = require('./../villas/model');
const OtpcodeModel = require('./../authcode/OTPModel');
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

        if (firstName.length < 3 || lastName.length < 3) {
            return res.status(420).json({ statusCode: 420, message: "Minimum 3 characters" })
        }

        if (firstName == user.firstName & lastName == user.lastName) {
            return res.status(421).json({ statusCode: 421, message: "You cannot reset your last name to a new name" })
        }

        const regex = /[0-9]+/;
        if (regex.test(firstName) | regex.test(lastName)) return res.status(406).json({ statusCode: 406, message: "number is not allowed in name" })

        const update = await userModel.findOneAndUpdate({ _id: user._id }, { firstName, lastName })

        const finduser = await userModel.findOne({ _id: user._id }).lean()
        Reflect.deleteProperty(finduser, "password")

        return res.status(200).json({ statusCode: 200, message: "user updated succ !", user: finduser })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.changeRole = async (req, res) => {
    try {
        const phone = req.params.phone;
        const key = req.params.key;

        if (key !== "promotion" && key !== "demotion") {
            return res.status(400).json({ statusCode: 400, message: "Invalid key. Only 'promotion' or 'demotion' is allowed." });
        }
        const user = await userModel.findOne({ phone })

        if (key == "promotion") {

            if (!user || user.length == 0) return res.status(404).json({ statusCode: 404, message: "user not found" })
            if (user.role === "admin") return res.status(422).json({ statusCode: 422, message: "this user is already admin" })

            const makeadmin = await userModel.updateOne({ phone }, { role: "admin" })
            return res.status(200).json({ statusCode: 200, message: "succ" })

        } else if (key == "demotion") {

            if (!user || user.length == 0) return res.status(404).json({ statusCode: 404, message: "user not found" })
            if (user.role === "user") return res.status(422).json({ statusCode: 422, message: "this user is already NormalUser" })

            const makeadmin = await userModel.updateOne({ phone }, { role: "user" })
            return res.status(200).json({ statusCode: 200, message: "succ" })

        } else {
            return res.status(400).json({ statusCode: 401, message: "unknown error" })
        }

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.changePassword = async (req, res) => {
    try {
        const user = req.user
        const { currentPassword, newPassword } = req.body

        const checkPassword = await bcrypt.compare(currentPassword, user.password)
        if (!checkPassword) {
            return res.status(401).json({ statusCode: 401, message: "Password is Incrract !!" })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        if (await bcrypt.compare(newPassword, user.password)) return res.status(402).json({ statusCode: 402, message: "You cannot reset your last password to a new password" })

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9.@$\-_#]{8,}$/;
        if (!regex.test(newPassword)) return res.status(406).json({ statusCode: 406, message: "The password must contain 8 characters or more and contain at least one number and one capital letter" })

        const updatePass = await userModel.findOneAndUpdate({ _id: user._id }, { password: hash })
        return res.status(200).json({ statusCode: 200, message: "Succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.forgetPassword = async (req, res) => {
    try {

        await OtpcodeModel.create({
            code: 1111,
            phone: req.user.phone,
            expiresIn: Date.now() + 99999999, // 120000
            for: "pssword"
        })
        return res.status(200).json({ statusCode: 200, message: "code sended succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.forgetPasswordConfirmCode = async (req, res) => {
    try {
        const user = req.user

        const { code, password, confirmPassword } = req.body;
        if (password != confirmPassword) return res.status(416).json({ statusCode: 416, message: "password and confirmPassword are not same" })

        const getCode = await OtpcodeModel.find({ phone: user.phone }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ statusCode: 404, message: `There is no Code for : ${user.phone}` })

        if (getCode[0].code == code && getCode[0].expiresIn > Date.now()) {

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const checkUses = await OtpcodeModel.find({ code }).sort({ _id: -1 })
            if (checkUses[0].used == 1) return res.status(405).json({ statusCode: 405, message: "Code has Used before!" })

            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9.@$\-_#]{8,}$/
            if (!regex.test(password)) return res.status(406).json({ statusCode: 406, message: "The password must contain 8 characters or more and contain at least one number and one capital letter" })

            if (await bcrypt.compare(password, user.password)) return res.status(402).json({ statusCode: 402, message: "You cannot reset your last password to a new password" })

            const updateUser = await userModel.findOneAndUpdate({ _id: user._id }, { password: hash })
            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })

            return res.status(200).json({ statusCode: 200, message: "Password Changed !" })

        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

        return res.status(500).json({ statusCode: 500, message: "Invalid Err" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}


