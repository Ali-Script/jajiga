const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const villaModel = require('./../villas/model');
const reserveModel = require('./../reserve/model');
const banModel = require('./../ban/model');
const OtpcodeModel = require('./../authcode/OTPModel');
const userVillaModel = require('./../user-villa/model');
const newsletterModel = require('./../newsletter/model');
const wishesModel = require('./../wishes/model');
const emailValidator = require("email-validator");
const nodemailer = require("nodemailer");
const { genRefreshToken, genAccessToken } = require('./../../utils/auth');
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const joi = require("./../../validator/authValidator");
const sharp = require("sharp")

exports.getAll = async (req, res) => {
    try {
        const userss = await userModel.find().sort({ _id: -1 }).lean();
        if (userss.length == 0) return res.status(404).json({ statusCode: 404, message: 'No user found !' })

        const checkBan = await banModel.find({})
        const users = userss.filter(user => !checkBan.find(banneduser => user.phone == banneduser.phone));

        const allUsers = []

        for (const user of users) {
            Reflect.deleteProperty(user, "password")
            allUsers.push(user)

            const getBooked = await reserveModel.find({ user: user._id }).lean()
            let allreserve = { number: getBooked.length, id: [] }
            getBooked.forEach(data => {
                allreserve.id.push(data._id)
            })

            const getVilla = await villaModel.find({ user: user._id }).lean()
            let allVilla = { number: getVilla.length, id: [] }
            getVilla.forEach(data => {
                allVilla.id.push(data._id)
            })

            user.booked = allreserve
            user.villa = allVilla
        }

        return res.status(200).json({ statusCode: 200, users: allUsers })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.getOne = async (req, res) => {
    try {
        const phone = req.params.phone

        const checkBan = await banModel.findOne({ phone })

        const user = await userModel.findOne({ phone }).lean();
        if (!user || user.length == 0) return res.status(404).json({ statusCode: 404, message: 'No user found !' })

        const findVilla = await villaModel.find({ user: user._id }).populate("aboutVilla.villaType").populate("user", "firstName lastName role avatar")
            .sort({ _id: -1 }).lean()
        const books = await reserveModel.find({ user: user._id })
        const wishes = await wishesModel.find({ user: user._id })
        let getfaveVillas = []
        if (wishes.length != 0) {

            const getfaveVillas = await Promise.all(
                wishes.map(async (data) => {
                    const find = await villaModel.findOne({ _id: data.villa }).populate("aboutVilla.villaType").lean();
                    return find;
                })
            );

            Reflect.deleteProperty(user, "password")
            return res.status(200).json({ statusCode: 200, message: "Succ", user, villas: findVilla, books, wishes: getfaveVillas })
        }
        Reflect.deleteProperty(user, "password")

        if (checkBan) user.ban = true
        else if (!checkBan) user.ban = false
        return res.status(200).json({ statusCode: 200, message: "Succ", user, villas: findVilla, books, wishes: [] })

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
        const newsletter = await newsletterModel.findOneAndDelete({ email: user.email }).lean()

        return res.status(200).json({ statusCode: 200, message: "succ !" })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.changeRole = async (req, res) => {
    try {
        const phone = req.params.phone;
        const key = req.params.key;

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "this user has banned from this website" })

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

        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

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

        const checkBan = await banModel.findOne({ phone: req.user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        await OtpcodeModel.create({
            code: 1111,
            phone: req.user.phone,
            email: null,
            expiresIn: Date.now() + 99999999, // 120000
            for: "password"
        })
        return res.status(200).json({ statusCode: 200, message: "code sended succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.forgetPasswordConfirmCode = async (req, res) => {
    try {
        const user = req.user

        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

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
exports.edit = async (req, res) => {
    try {
        // const user = req.user
        const { avatar, firstName, lastName, gender, aboutMe } = req.body;
        const user = await userModel.findOne({ phone: "09189450686" })
        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        const regex = /[0-9]+/;

        if (regex.test(firstName) | regex.test(lastName)) return res.status(406).json({ statusCode: 406, message: "number is not allowed in name" })

        if (gender != undefined) {
            if (gender !== "male" && gender !== "female") {
                return res.status(400).json({ statusCode: 400, message: "Invalid gender. Only 'male' or 'female' is allowed." });
            }
        }

        if (req.file != undefined) {

            const pathh = `./avatars/${Date.now()}${req.file.originalname}`
            const buffer = req.file.buffer


            try {
                await sharp(buffer).toFormat('png').jpeg({ quality: 30 }).toFile(`./public/${pathh}`);
            } catch (error) {
                console.error("Error processing image with sharp:", error);
                return res.status(500).json({ statusCode: 500, message: "Image processing failed." });
            }
            const finalPath = pathh.replace('./avatars/', '');
            const update = await userModel.findOneAndUpdate({ _id: user._id }, {
                firstName,
                lastName,
                avatar: finalPath,
                gender,
                aboutMe
            })
            const finduser = await userModel.findOne({ _id: user._id }).lean()
            Reflect.deleteProperty(finduser, "password")

            return res.status(200).json({ statusCode: 200, message: "user updated succ !", user: finduser })
        }

        const update = await userModel.findOneAndUpdate({ _id: user._id }, {
            firstName,
            lastName,
            gender,
            aboutMe
        })

        const finduser = await userModel.findOne({ _id: user._id }).lean()
        Reflect.deleteProperty(finduser, "password")

        return res.status(200).json({ statusCode: 200, message: "user updated succ !", user: finduser })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.addEmail = async (req, res) => {
    try {
        const user = req.user
        const { email } = req.body;

        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        if (!emailValidator.validate(email)) return res.status(423).json({ statusCode: 423, message: "Invalid email" })

        await OtpcodeModel.create({
            code: 1111,
            phone: null,
            email,
            expiresIn: Date.now() + 99999999, // 120000
            for: "email"
        })

        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: req.body.email,
            subject: "Add Email in Jajiga",
            text: "1111",
        }

        transport.sendMail(mailOptions, async (e, i) => {
            if (e) {
                return res.status(400).json({ statusCode: 400, message: e.message })
            }
            else {
                return res.status(200).json({ statusCode: 200, message: "code sended succ" })
            }
        })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.authEmail = async (req, res) => {
    try {
        const user = req.user
        const { email, code, newsletter } = req.body;

        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        if (newsletter == undefined) return res.status(465).json({ statusCode: 465, message: `newsletter required` })
        else if (newsletter !== true && newsletter !== false) return res.status(400).json({ statusCode: 400, message: "newsletter must be boolean" });
        else if (!emailValidator.validate(email)) return res.status(423).json({ statusCode: 422, message: "Invalid email" })

        const getCode = await OtpcodeModel.find({ email }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ statusCode: 404, message: `There is no Code for : ${email}` })

        if (getCode[0].code == code && getCode[0].expiresIn > Date.now()) {

            const checkUses = await OtpcodeModel.find({ code }).sort({ _id: -1 })
            if (checkUses[0].used == 1) return res.status(405).json({ statusCode: 405, message: "Code has Used before!" })


            const updateUser = await userModel.findOneAndUpdate({ _id: user._id }, { $set: { email } })
            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })

            const findDup = await newsletterModel.findOne({ email }).lean()
            if (!findDup && newsletter == true) {
                const news = await newsletterModel.create({ email })
            }
            const updatedUser = await userModel.findOne({ _id: user._id })
            return res.status(200).json({ statusCode: 200, message: "email Changed !", user: updatedUser })

        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

        return res.status(500).json({ statusCode: 500, message: "Invalid Err" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.changeNumber = async (req, res) => {
    try {
        const user = req.user
        const { phone } = req.body;

        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })
        const checkBann = await banModel.findOne({ phone })
        if (checkBann) return res.status(403).json({ statusCode: 403, message: "Sorry this PhoneNumber has banned from this website" })

        const regex = /[aA-zZ]+/;
        if (regex.test(phone)) return res.status(406).json({ statusCode: 406, message: "phone have to be a number" })

        if (!phone) return res.status(422).json({ statusCode: 422, message: "phoneNumber is Required" })

        await OtpcodeModel.create({
            code: 1111,
            phone,
            email: null,
            expiresIn: Date.now() + 99999999, // 120000
            for: "auth"
        })

        return res.status(200).json({ statusCode: 200, message: "code sended Succ " })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.authNumber = async (req, res) => {
    try {
        const user = req.user
        const { phone, code } = req.body;

        const regex = /[aA-zZ]+/;
        if (regex.test(phone)) return res.status(406).json({ statusCode: 406, message: "phone have to be a number" })

        const getCode = await OtpcodeModel.find({ phone }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ statusCode: 404, message: `There is no Code for : ${phone}` })

        if (getCode[0].code == code && getCode[0].expiresIn > Date.now()) {

            const checkUses = await OtpcodeModel.find({ code }).sort({ _id: -1 })
            if (checkUses[0].used == 1) return res.status(405).json({ statusCode: 405, message: "Code has Used before!" })

            const accessToken = genAccessToken(phone)
            const RefreshToken = genRefreshToken(phone)

            const updateUser = await userModel.findOneAndUpdate({ _id: user._id }, { phone })
            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })


            const updatedUser = await userModel.findOne({ _id: user._id })
            const userobj = updatedUser.toObject()
            Reflect.deleteProperty(userobj, "password")

            return res.status(200).json({
                statusCode: 200,
                message: "phoneNumber Changed !",
                user: userobj,
                accessToken,
                RefreshToken
            })

        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

        return res.status(500).json({ statusCode: 500, message: "Invalid Err" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}