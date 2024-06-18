const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('./model')
const OtpcodeModel = require('./../authcode/OTPModel')
const banModel = require('./../ban/model')
const joi = require('./../../validator/authValidator');
const { genRefreshToken, genAccessToken } = require('./../../utils/auth');
const { signedCookie } = require('cookie-parser');
require("dotenv").config()
const request = require('request');

exports.start = async (req, res) => {
    try {
        const checkBan = await banModel.findOne({ phone: req.user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        return res.status(200).json({ statusCode: 200, message: "Succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.signup = async (req, res) => {
    try {
        const { phone } = req.body;

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        if (!phone) return res.status(409).json({ statusCode: 409, message: "phone number is required" })
        if (phone.length != "11") return res.status(410).json({ statusCode: 410, message: "format wrong" })

        const ifDUPLCNum = await userModel.findOne({ phone })
        if (ifDUPLCNum) {
            await OtpcodeModel.create({
                code: 1111,
                phone,
                expiresIn: Date.now() + 120000,
            })
            return res.status(411).json({ statusCode: 411, message: "Phone Number is already exist please login" })
        }

        // const OTP_CODE = Math.floor(Math.random() * 1000000)

        // request.post({
        //     url: 'http://ippanel.com/api/select',
        //     body: {
        //         "op": "pattern",
        //         "user": process.env.USERNAME_OTP_PANEL,
        //         "pass": process.env.PASSWORD_OTP_PANEL,
        //         "fromNum": process.env.FORMNUM_OTP_PANEL,
        //         "toNum": Phone,
        //         "patternCode": process.env.PATTERT_OTP_PANEL,
        //         "inputData": [{ "verification-code": OTP_CODE }]
        //     },
        //     json: true,
        // },
        //     async function (error, response, body) {
        //         if (!error && response.statusCode === 200) {
        //             /////////************ */
        //             //  if (typeof response.body !== "number" && response.body[0] !== 0) return res.status(response.body[0]).json(response.body)
        //             /****************************** */

        //             const setcode = await OtpcodeModel.create({
        //                 Code: OTP_CODE,
        //                 Phone,
        //                 ExpiresIn: Date.now() + 120000,
        //             })
        //             return res.status(200).json("code send succ")
        //         } else {

        //         }
        //     });

        // const setcode = await OtpcodeModel.create({
        //     Code: 1111,
        //     Phone,
        //     ExpiresIn: Date.now() + 120000,
        // })

        return res.status(200).json({ statusCode: 200, message: "redirect ro register" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }) }
}
//* Checked (1)
exports.sendOtpPhone = async (req, res) => {
    try {
        const { phone, firstName, lastName, password, confirmPassword } = req.body;
        req.body = { phone, firstName, lastName, password, confirmPassword }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })

        await OtpcodeModel.create({
            code: 1111,
            phone,
            expiresIn: Date.now() + 99999999, // 120000
        })

        return res.status(200).json({ statusCode: 200, message: "code sended succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.authOtpPhone = async (req, res) => {
    try {

        const { code, phone, firstName, lastName, password, confirmPassword } = req.body;
        req.body = { phone, firstName, lastName, password, confirmPassword }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })

        const getCode = await OtpcodeModel.find({ phone }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ statusCode: 404, message: `There is no Code for : ${phone}` })

        if (getCode[0].code == code && getCode[0].expiresIn > Date.now()) {

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const checkUses = await OtpcodeModel.find({ code }).sort({ _id: -1 })
            if (checkUses[0].used == 1) return res.status(405).json({ statusCode: 405, message: "Code has Used before!" })

            const findNum = await userModel.findOne({ phone })
            if (findNum) return res.status(406).json({ statusCode: 406, message: "User already exists" })




            let user = new userModel({
                firstName,
                lastName,
                phone,
                password: hash
            })

            user = await user.save();

            const accessToken = genAccessToken(user.phone)
            const RefreshToken = genRefreshToken(user.phone)
            res.cookie("RefreshToken", RefreshToken, {
                maxAge: 999999999999999, //14 * 24 * 60 * 60,
                httpOnly: true,
                signed: true,
                secure: true,
                sameSite: "none"
            })
            res.cookie("AccessToken", accessToken, {
                maxAge: 999999999999999, //15000
                httpOnly: true,
                signed: true,
                secure: true,
                sameSite: "none"
            })


            await userModel.updateOne({ phone }, { $set: { refreshToken: RefreshToken } })
            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })

            return res.status(200).json({ statusCode: 200, message: "User Created Succ !", token: RefreshToken })

        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

        return res.status(500).json({ statusCode: 500, message: "Invalid Err" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.loginByPassword = async (req, res) => {
    try {

        const { password } = req.body;
        const phone = req.params.phone

        if (!password) { return res.status(499).json({ statusCode: 499, message: "password is required" }) }

        const user = await userModel.findOne({ phone })

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: "no user found" })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(401).json({ statusCode: 401, message: "Password is Incrract !!" })
        }


        const accessToken = genAccessToken(user.phone)
        const RefreshToken = genRefreshToken(user.phone)

        res.cookie("RefreshToken", RefreshToken, {
            maxAge: 999999999999999,
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "none"
        })
        res.cookie("AccessToken", accessToken, {
            maxAge: 999999999999999,
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "none"
        })

        await userModel.updateOne({ phone: user.phone }, { $set: { refreshToken: RefreshToken } })

        return res.json({ statusCode: 200, message: "Login Successfully " })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.loginByCode = async (req, res) => {
    try {
        const phone = req.params.phone
        const { code } = req.body;

        const user = await userModel.findOne({ phone })

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: "no user found" })
        }

        const getCode = await OtpcodeModel.find({ phone }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(408).json({ statusCode: 408, message: `There is no Code for : ${Phone}` })


        if (getCode[0].code == code && getCode[0].expiresIn > Date.now()) {

            const checkUses = await OtpcodeModel.find({ code }).sort({ _id: -1 })
            if (checkUses[0].used == 1) return res.status(405).json({ statusCode: 405, message: "Code has Used before!" })


            const accessToken = genAccessToken(user.phone)
            const RefreshToken = genRefreshToken(user.phone)

            res.cookie("RefreshToken", RefreshToken, {
                maxAge: 999999999999999, //14 * 24 * 60 * 60,
                httpOnly: true,
                signed: true,
                secure: true,
                sameSite: "lax"
            })
            res.cookie("AccessToken", accessToken, {
                maxAge: 999999999999999, //15000
                httpOnly: true,
                signed: true,
                secure: true,
                sameSite: "lax"
            })


            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })
            await userModel.updateOne({ phone: user.phone }, { $set: { refreshToken: RefreshToken } })
            return res.status(200).json({ statusCode: 200, message: "Login Successfully " })


        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.getme = async (req, res) => {
    try {
        const checkBan = await banModel.findOne({ phone: req.user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        return res.status(200).json({ statusCode: 200, message: "Succ", user: req.user })

    } catch (err) { return res.status(500).josn({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.getAccessToken = async (req, res) => {
    try {
        const RefreshToken = req.signedCookies.RefreshToken
        if (RefreshToken == undefined) return res.status(403).json({ statusCode: 403, message: "Refresh Token has expired" })

        const decode = jwt.verify(RefreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await userModel.findOne({ phone: decode.Identifeir })
        if (!user) return res.status(404).json({ statusCode: 404, message: "User Not Found !" })

        const accessToken = genAccessToken(user.phone)
        res.cookie("AccessToken", accessToken, {
            maxAge: 99999999999999,
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "none"
        })

        return res.status(200).json({ statusCode: 200, message: "succ !" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)
exports.resendCode = async (req, res) => {
    try {
        const phone = req.params.phone

        const user = await userModel.findOne({ phone })
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: "no user found" })
        }

        await OtpcodeModel.create({
            code: 1111,
            phone: phone,
            expiresIn: Date.now() + 120000,
        })

        return res.status(200).json({ statusCode: 200, message: "succ !" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
//* Checked (1)