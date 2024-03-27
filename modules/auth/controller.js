const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('./model')
const codeModel = require('./../authcode/model')
const banModel = require('./../ban/model')
const joi = require('./../../validator/authValidator');
const { genRefreshToken, genAccessToken } = require('./../../utils/auth');
const { signedCookie } = require('cookie-parser');
require("dotenv").config()

exports.start = async (req, res) => {
    try {
        const checkBan = await banModel.findOne({ user: req.user._id })
        if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })
        return res.status(200).json({ message: "Succ" })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.auth = async (req, res) => {
    try {
        const { UserName, Email, Password, ConfirmPassword } = req.body;

        const checkBan = await banModel.findOne({ email: Email })
        if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })


        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })


        const ifDUPLC = await userModel.findOne({
            $or: [{ UserName }, { Email }]
        })
        if (ifDUPLC) {
            return res.status(409).json({ message: "User Name or Email is Duplicated" })
        }


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
exports.authCode = async (req, res) => {
    try {
        const { Code, Email, UserName, Password, ConfirmPassword } = req.body;

        req.body = { Email, UserName, Password, ConfirmPassword }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

        const getCode = await codeModel.find({ Email }).sort({ _id: -1 }).lean()
        if (getCode.length == 0) return res.status(404).json({ message: `There is no Code for : ${Email}` })

        if (getCode[0].Code == Code && getCode[0].ExpiresIn > Date.now()) {

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(Password, salt);

            const ifDUPLC = await userModel.findOne({
                $or: [{ UserName }, { Email }]
            })
            if (ifDUPLC) {
                return res.status(409).json({ message: "User Name or Email is Duplicated" })
            }

            const user = await userModel.create({
                UserName,
                Email,
                Password: hash
            })

            // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "14 day" })

            const accessToken = genAccessToken(user.Email)
            const RefreshToken = genRefreshToken(user.Email)


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
            // res.cookie("RefreshToken", RefreshToken, {
            //     maxAge: 14 * 24 * 60 * 60,
            //     httpOnly: true,
            //     signed: true,
            //     secure: true
            // })
            // res.cookie("AccessToken", accessToken, {
            //     maxAge: 15000,
            //     httpOnly: true,
            //     signed: true,
            //     secure: true
            // })

            const upUser = await userModel.updateOne({ Email }, { $set: { accessToken: accessToken } })

            return res.status(200).json({ message: "User Created Succ !", token: RefreshToken })

        } else if (getCode[0].Code != Code) {

            return res.status(400).json({ message: "Invalid Code !" })
        }
        else if (getCode[0].ExpiresIn < Date.now()) {

            return res.status(422).json({ message: "Code Has Expired !" })
        }
        return res.status(422).json({ message: "Invalid Err" })
    } catch (err) { return res.status(422).send(err.message); }
}
exports.login = async (req, res) => {
    try {
        const { Identifeir, Password } = req.body;

        const user = await userModel.findOne({
            $or: [{ UserName: Identifeir }, { email: Identifeir }]
        })

        const checkBan = await banModel.findOne({ user: user.Email })
        if (checkBan) return res.status(403).json({ message: "Sorry u has banned from this website" })

        if (!user) {
            return res.status(400).json({ message: "UserName or Email is Incrract !!" })
        }

        const checkPassword = await bcrypt.compare(Password, user.Password)
        if (!checkPassword) {
            return res.status(400).json({ message: "Password is Incrract !!" })
        }
        const accessToken = genAccessToken(user.Email)
        const RefreshToken = genRefreshToken(user.Email)

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
        const upUser = await userModel.updateOne({ Email: user.Email }, { $set: { RefreshToken } })

        return res.json({ message: "Login Successfully " })
    } catch (err) { return res.status(422).send(err.message); }
}
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

        const user = await userModel.findOne({ Email: decode.Email })
        if (!user) return res.status(404).json({ message: "User Not Found !" })

        const accessToken = genAccessToken(user.Email)
        res.cookie("AccessToken", accessToken, {
            maxAge: 15000,
            httpOnly: true,
            signed: true,
            secure: true
        })

        return res.status(200).json("succ !")
    } catch (err) { return res.status(422).send(err.message); }
}