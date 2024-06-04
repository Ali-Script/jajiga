const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('./model')
const codeModel = require('./../authcode/model')
const OtpcodeModel = require('./../authcode/OTPModel')
const banModel = require('./../ban/model')
const joi = require('./../../validator/authValidator');
const { genRefreshToken, genAccessToken } = require('./../../utils/auth');
const { signedCookie } = require('cookie-parser');
require("dotenv").config()
const request = require('request');

exports.start = async (req, res) => {
    try {
        const checkBan = await banModel.findOne({ user: req.user._id })
        if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })
        return res.status(200).json({ message: "Succ" })
    } catch (err) { return res.status(500).send(err.message); }
}
// exports.auth = async (req, res) => {
//     try {
//         const { UserName, Email } = req.body;

//         const checkBan = await banModel.findOne({ email: Email })
//         if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })


//         const validator = joi.validate(req.body)
//         if (validator.error) return res.status(409).json({ message: validator.error.details })


//         const ifDUPLC = await userModel.findOne({ UserName })
//         if (ifDUPLC) {
//             return res.status(409).json({ message: "UserName is Duplicated" })
//         }
//         const ifDUPLCNum = await userModel.findOne({ Email })
//         if (ifDUPLCNum) {
//             return res.status(410).json({ message: "Email is Duplicated" })
//         }


//         const code = Math.floor(Math.random() * 1000000)


//         let transport = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: "ali.prg01@gmail.com",
//                 pass: "eopj hyfz fyha nduv"
//             }
//         })

//         const mailOptions = {
//             from: "ali.prg01@gmail.com",
//             to: req.body.Email,
//             subject: "jajigacode",
//             text: `${code}`,
//         }

//         transport.sendMail(mailOptions, async (e, i) => {

//             if (e) {
//                 return res.status(500).json({ error: e.message })
//             }
//             else {
//                 const setcode = await codeModel.create({
//                     Code: code,
//                     Email,
//                     ExpiresIn: Date.now() + 120000,
//                 })
//                 if (!setcode) return res.status(500).json({ err: "Server Err" })

//                 return res.status(200).json({ message: "Email Sended !" })
//             }
//         })
//     } catch (err) { return res.status(500).send(err.message); }
// }
// exports.authCode = async (req, res) => {
//     try {
//         const { Code, Email, UserName, Password, ConfirmPassword, SignUpMethod } = req.body;

//         req.body = { Email, UserName, Password, ConfirmPassword, SignUpMethod }

//         const validator = joi.validate(req.body)
//         if (validator.error) return res.status(409).json({ message: validator.error.details })

//         const getCode = await codeModel.find({ Email }).sort({ _id: -1 }).lean()
//         if (getCode.length == 0) return res.status(404).json({ message: `There is no Code for : ${Email}` })


//         if (getCode[0].Code == Code && getCode[0].ExpiresIn > Date.now()) {

//             const salt = bcrypt.genSaltSync(10);
//             const hash = bcrypt.hashSync(Password, salt);

//             const ifDUPLC = await userModel.findOne({
//                 $or: [{ UserName }, { Email }]
//             })
//             if (ifDUPLC) {
//                 return res.status(408).json({ message: "User Name or Email is Duplicated" })
//             }

//             const checkUses = await codeModel.findOne({ Code })
//             if (checkUses.Used == 1) return res.status(200).json({ message: "Code has Used before!" })

//             const user = await userModel.create({
//                 UserName,
//                 Email,
//                 Password: hash
//             })

//             // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "14 day" })

//             const accessToken = genAccessToken(user.Email)
//             const RefreshToken = genRefreshToken(user.Email)


//             res.cookie("RefreshToken", RefreshToken, {
//                 maxAge: 999999999999999,
//                 httpOnly: true,
//                 signed: true,
//                 secure: true
//             })
//             res.cookie("AccessToken", accessToken, {
//                 maxAge: 999999999999999,
//                 httpOnly: true,
//                 signed: true,
//                 secure: true
//             })
//             // res.cookie("RefreshToken", RefreshToken, {
//             //     maxAge: 14 * 24 * 60 * 60,
//             //     httpOnly: true,
//             //     signed: true,
//             //     secure: true
//             // })
//             // res.cookie("AccessToken", accessToken, {
//             //     maxAge: 15000,
//             //     httpOnly: true,
//             //     signed: true,
//             //     secure: true
//             // })

//             const upUser = await userModel.updateOne({ Email }, { $set: { RefreshToken } })

//             return res.status(200).json({ message: "User Created Succ !", token: RefreshToken })

//         } else if (getCode[0].Code != Code) {

//             return res.status(400).json({ message: "Invalid Code !" })
//         }
//         else if (getCode[0].ExpiresIn < Date.now()) {

//             return res.status(422).json({ message: "Code Has Expired !" })
//         }
//         return res.status(422).json({ message: "Invalid Err" })
//     } catch (err) { return res.status(500).send(err.message); }
// }
exports.signup = async (req, res) => {
    try {
        const { Phone } = req.body;

        const checkBan = await banModel.findOne({ Identifeir: Phone })
        if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })


        if (!Phone) return res.status(409).json({ message: "phone number is required" })
        if (Phone.length != "11") return res.status(410).json({ message: "format wrong" })


        const ifDUPLCNum = await userModel.findOne({ Phone })
        if (ifDUPLCNum) {
            return res.status(411).json({ message: "Phone Number is already exist please login" })
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

        return res.status(200).json("redirect ro register")

    } catch (err) { return res.status(500).send(err.message); }
}
exports.sendOtpPhone = async (req, res) => {
    try {
        const { Phone, firstName, lastName, Password, ConfirmPassword } = req.body;

        req.body = { Phone, firstName, lastName, Password, ConfirmPassword }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })


        const setcode = await OtpcodeModel.create({
            Code: 1111,
            Phone,
            ExpiresIn: Date.now() + 120000,
        })

        return res.status(200).json("code sended succ")

    } catch (err) { return res.status(500).send(err.message); }
}
exports.authOtpPhone = async (req, res) => {
    try {
        const { Code, Phone, firstName, lastName, Password, ConfirmPassword } = req.body;

        req.body = { Phone, firstName, lastName, Password, ConfirmPassword }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

        const getCode = await OtpcodeModel.find({ Phone }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ message: `There is no Code for : ${Phone}` })


        if (getCode[0].Code == Code && getCode[0].ExpiresIn > Date.now()) {

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(Password, salt);


            const checkUses = await OtpcodeModel.find({ Code }).sort({ _id: -1 })
            if (checkUses[0].Used == 1) return res.status(405).json({ message: "Code has Used before!" })


            const findNum = await userModel.findOne({ Phone })
            if (findNum) return res.status(406).json({ message: "User already exists" })

            const user = await userModel.create({
                firstName,
                lastName,
                Phone,
                Password: hash
            })



            const accessToken = genAccessToken(user.Phone)
            const RefreshToken = genRefreshToken(user.Phone)


            res.cookie("RefreshToken", RefreshToken, {
                maxAge: 999999999999999, //14 * 24 * 60 * 60,
                httpOnly: true,
                signed: true,
                secure: true
            })
            res.cookie("AccessToken", accessToken, {
                maxAge: 999999999999999, //15000
                httpOnly: true,
                signed: true,
                secure: true
            })


            const upUser = await userModel.updateOne({ Phone }, { $set: { RefreshToken } })


            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { Used: 1 })
            return res.status(200).json({ message: "User Created Succ !", token: RefreshToken })

        } else if (getCode[0].Code != Code) {

            return res.status(400).json({ message: "Invalid Code !" })
        }
        else if (getCode[0].ExpiresIn < Date.now()) {

            return res.status(422).json({ message: "Code Has Expired !" })
        }
        return res.status(500).json({ message: "Invalid Err" })

    } catch (err) { return res.status(500).send(err.message); }
}
exports.login = async (req, res) => {
    try {
        const { Password } = req.body;

        if (!Password) { return res.status(499).json({ message: "password is required" }) }

        const Phone = req.params.phone

        const user = await userModel.findOne({ Phone })

        const checkBan = await banModel.findOne({ Phone })
        if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })

        if (!user) {
            return res.status(404).json({ message: "no user found" })
        }

        const checkPassword = await bcrypt.compare(Password, user.Password)
        if (!checkPassword) {
            return res.status(401).json({ message: "Password is Incrract !!" })
        }
        const accessToken = genAccessToken(user.Phone)
        const RefreshToken = genRefreshToken(user.Phone)

        res.cookie("RefreshToken", RefreshToken, {
            maxAge: 999999999999999,
            httpOnly: true,
            signed: true,
            secure: true
        })
        res.cookie("AccessToken", accessToken, {
            maxAge: 999999999999999,
            httpOnly: true,
            signed: true,
            secure: true
        })
        await userModel.updateOne({ Phone: user.Phone }, { $set: { RefreshToken } })

        return res.json({ message: "Login Successfully " })
    } catch (err) { return res.status(500).send(err.message); }
}
// exports.loginByEmail = async (req, res) => {
//     try {
//         const { Identifeir, Password } = req.body;

//         const user = await userModel.findOne({ Email: Identifeir })

//         const checkBan = await banModel.findOne({ $or: [{ Phone: Identifeir }, { Email: Identifeir }] })
//         if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })

//         if (!user) {
//             return res.status(400).json({ message: "Email is Incrract !!" })
//         }

//         const checkPassword = await bcrypt.compare(Password, user.Password)
//         if (!checkPassword) {
//             return res.status(401).json({ message: "Password is Incrract !!" })
//         }
//         const accessToken = genAccessToken(user.Email)
//         const RefreshToken = genRefreshToken(user.Email)

//         res.cookie("RefreshToken", RefreshToken, {
//             maxAge: 999999999999999,
//             httpOnly: true,
//             signed: true,
//             secure: true
//         })
//         res.cookie("AccessToken", accessToken, {
//             maxAge: 999999999999999,
//             httpOnly: true,
//             signed: true,
//             secure: true
//         })
//         const upUser = await userModel.updateOne({ Email: user.Email }, { $set: { RefreshToken } })

//         return res.json({ message: "Login Successfully " })
//     } catch (err) { return res.status(500).send(err.message); }
// }
exports.getme = async (req, res) => {
    try {
        return res.status(200).json({ message: "Succ", user: req.user })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.getAccessToken = async (req, res) => {
    try {
        const RefreshToken = req.signedCookies.RefreshToken
        if (RefreshToken == undefined) return res.status(403).json({ message: "Refresh Token has expired" })

        const decode = jwt.verify(RefreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await userModel.findOne({ $or: [{ Email: decode.Identifeir }, { Phone: decode.Identifeir }] })
        if (!user) return res.status(404).json({ message: "User Not Found !" })

        const accessToken = genAccessToken(user.Email)
        res.cookie("AccessToken", accessToken, {
            maxAge: 99999999999999,
            httpOnly: true,
            signed: true,
            secure: true
        })

        return res.status(200).json("succ !")
    } catch (err) { return res.status(422).send(err.message); }
}