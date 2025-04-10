const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require('request');
const nodemailer = require('nodemailer');
const userModel = require('./model')
const villaModel = require('./../villas/model')
const reserveModel = require('./../reserve/model')
const commentModel = require('./../comment/model')
const OtpcodeModel = require('./../authcode/OTPModel')
const moment = require('jalali-moment');
const banModel = require('./../ban/model')
const joi = require('./../../validator/authValidator');
const { genRefreshToken, genAccessToken } = require('./../../utils/auth');
const { signedCookie } = require('cookie-parser');
require("dotenv").config()


exports.start = async (req, res) => {
    try {
        return res.status(200).json({ statusCode: 200, message: "Succ" })
    } catch (err) {
        return res.status(500).json({ statusCode: 500, error: err.message });
    }
}
//* Checked (1)
exports.signup = async (req, res) => {
    try {
        const { phone } = req.body;

        const regex = /[aA-zZ]+/;
        if (regex.test(phone)) return res.status(406).json({ statusCode: 406, message: "phone have to be a number" })

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        if (!phone) return res.status(409).json({ statusCode: 409, message: "phone number is required" })
        if (phone.length != "11") return res.status(410).json({ statusCode: 410, message: "format wrong" })

        const ifDUPLCNum = await userModel.findOne({ phone })
        if (ifDUPLCNum) {

            const OTP_CODE = Math.floor(Math.random() * 10000)

            request.post({
                url: 'http://ippanel.com/api/select',
                body: {
                    "op": "pattern",
                    "user": process.env.USERNAME_OTP_PANEL,
                    "pass": process.env.PASSWORD_OTP_PANEL,
                    "fromNum": process.env.FORMNUM_OTP_PANEL,
                    "toNum": phone,
                    "patternCode": process.env.PATTERT_OTP_PANEL,
                    "inputData": [{ "verification-code": OTP_CODE }]
                },
                json: true,
            },
                async function (error, response, body) {
                    if (!error && response.statusCode === 200) {

                        //  if (typeof response.body !== "number" && response.body[0] !== 0) return res.status(response.body[0]).json(response.body)

                        await OtpcodeModel.create({
                            code: OTP_CODE,
                            phone,
                            email: null,
                            expiresIn: Date.now() + 120000,
                            for: "auth"
                        })

                        return res.status(411).json({ statusCode: 411, message: "Phone Number is already exist please login" })

                    } else {
                        return res.status(500).json({ statusCode: 500, message: err.message })
                    }
                });
        } else {
            return res.status(200).json({ statusCode: 200, message: "redirect ro register" })

        }

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message })
    }
}
//* Checked (1)
exports.sendOtpPhone = async (req, res) => {
    try {
        const { phone, firstName, lastName, password, confirmPassword } = req.body;
        req.body = { phone, firstName, lastName, password, confirmPassword }

        const regex = /[aA-zZ]+/;
        if (regex.test(phone)) return res.status(406).json({ statusCode: 406, message: "phone have to be a number" })

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })

        const OTP_CODE = Math.floor(Math.random() * 10000)

        request.post({
            url: 'http://ippanel.com/api/select',
            body: {
                "op": "pattern",
                "user": process.env.USERNAME_OTP_PANEL,
                "pass": process.env.PASSWORD_OTP_PANEL,
                "fromNum": process.env.FORMNUM_OTP_PANEL,
                "toNum": phone,
                "patternCode": process.env.PATTERT_OTP_PANEL,
                "inputData": [{ "verification-code": OTP_CODE }]
            },
            json: true,
        }, async function (error, response, body) {

            if (!error && response.statusCode === 200) {

                //if (typeof response.body !== "number" && response.body[0] !== 0) return res.status(response.body[0]).json(response.body)

                await OtpcodeModel.create({
                    code: OTP_CODE,
                    phone,
                    email: null,
                    expiresIn: Date.now() + 120000,
                    for: "auth"
                })


                return res.status(200).json({ statusCode: 200, message: "code send succ" })

            } else {
                return res.status(500).json({ statusCode: 500, error: err.message })
            }
        })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, error: err.message });
    }
}
//* Checked (1)
exports.authOtpPhone = async (req, res) => {
    try {

        const { code, phone, firstName, lastName, password, confirmPassword } = req.body;
        req.body = { phone, firstName, lastName, password, confirmPassword }

        const regex = /[aA-zZ]+/;
        if (regex.test(phone)) return res.status(406).json({ statusCode: 406, message: "phone have to be a number" })

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

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
                password: hash,
                gender: null,
                aboutMe: null,
                avatar: null,
            })

            user = await user.save();

            const accessToken = genAccessToken(user.phone)
            const RefreshToken = genRefreshToken(user.phone)

            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })

            return res.status(200).json({ statusCode: 200, message: "User Created Succ !", RefreshToken, accessToken })

        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

        return res.status(500).json({ statusCode: 500, message: "Invalid Err" })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, error: err.message });
    }
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

        return res.json({ statusCode: 200, message: "Login Successfully ", accessToken, RefreshToken })
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
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


            await OtpcodeModel.updateOne({ _id: getCode[0]._id }, { used: 1 })

            return res.status(200).json({ statusCode: 200, message: "Login Successfully ", accessToken, RefreshToken })


        } else if (getCode[0].code != code) {
            return res.status(400).json({ statusCode: 400, message: "Invalid Code !" })
        }
        else if (getCode[0].expiresIn < Date.now()) {
            return res.status(422).json({ statusCode: 422, message: "Code Has Expired !" })
        }

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
//* Checked (1)
exports.getme = async (req, res) => {
    try {
        const user = req.user;
        Reflect.deleteProperty(user, "password")
        const checkBan = await banModel.findOne({ phone: user.phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })

        const findVilla = await villaModel.find({ user: user._id }).populate("aboutVilla.villaType").populate("user", "firstName lastName role avatar")
            .sort({ _id: -1 }).lean()
        const books = await reserveModel.find({ user: user._id }).populate("villa")
        let faveVillas = []


        const today = moment().locale('fa').format('YYYY/MM/DD');

        const filterDates = (books, today) => {
            const todayDate = new Date(today.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
            return books.filter(item => {
                const toDate = new Date(item.date.to.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
                return toDate >= todayDate;
            });
        };

        const filteredDates = filterDates(books, today);


        for (const data of filteredDates) {
            const comments = await commentModel.find({ villa: data.villa._id, isAnswer: 0, isAccept: "true" }).select('score -_id');
            const vill = await villaModel.find({ _id: data.villa._id }).populate("aboutVilla.villaType")

            const commentCount = comments.length;
            const totalScore = comments.reduce((acc, comment) => acc + comment.score, 0);
            const averageScore = commentCount > 0 ? totalScore / commentCount : 0;

            const getBook = await reserveModel.find({ villa: data.villa._id }).countDocuments()


            let obj = {
                _id: data.villa._id,
                title: data.villa.title,
                address: data.villa.address,
                aboutVilla: vill[0].aboutVilla,
                cover: data.villa.cover,
                price: data.villa.price,
                capacity: data.villa.capacity,
                comments: commentCount,
                averageScore,
                booked: getBook
            };
            let obj2 = { date: data.date, price: data.price, guestNumber: data.guestNumber }

            function daysBetweenPersianDates(date1, date2) {

                const m1 = moment(date1, 'jYYYY/jM/jD');
                const m2 = moment(date2, 'jYYYY/jM/jD');


                const gDate1 = m1.format('YYYY-MM-DD');
                const gDate2 = m2.format('YYYY-MM-DD');


                const diffInDays = moment(gDate2).diff(moment(gDate1), 'days') + 1;

                return diffInDays;
            }
            const date1 = data.date.from;
            const date2 = data.date.to;
            let days = daysBetweenPersianDates(date1, date2)
            obj2.days = days;


            const trueKeys = Object.keys(data.villa.facility.facility).filter(key => {
                if (key !== "moreFacility") return data.villa.facility.facility[key].status === true
            });
            if (trueKeys.length >= 5) obj.costly = true

            obj2.villa = obj
            faveVillas.push(obj2);
        }


        for (const villa of findVilla) {
            const books = await reserveModel.find({ villa: villa._id }).populate("user", "firstName lastName _id")

            const today = moment().locale('fa').format('YYYY/MM/DD');

            const filterDates = (books, today) => {
                const todayDate = new Date(today.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
                return books.filter(item => {
                    const toDate = new Date(item.date.to.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
                    return toDate >= todayDate;
                });
            };

            const filteredDates = filterDates(books, today);

            villa.booked = filteredDates

        }
        return res.status(200).json({ statusCode: 200, message: "Succ", user, villas: findVilla, booked: faveVillas })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
//* Checked (1)
exports.getAccessToken = async (req, res) => {
    try {
        // const RefreshToken = req.signedCookies.RefreshToken
        // if (RefreshToken == undefined) return res.status(403).json({ statusCode: 403, message: "Refresh Token has expired" })

        const { refreshToken } = req.body;
        const decode = jwt.verify(RefreshToken, process.env.JWT_REFRESH_SECRET)

        // const user = await userModel.findOne({ phone: decode.Identifeir })
        // if (!user) return res.status(404).json({ statusCode: 404, message: "User Not Found !" })

        // const accessToken = genAccessToken(user.phone)
        // res.cookie("AccessToken", accessToken, {
        //     maxAge: 99999999999999,
        //     httpOnly: true,
        //     signed: true,
        //     secure: true,
        //     sameSite: "none"
        // })

        // return res.status(200).json({ statusCode: 200, message: "succ !", accessToken })




        await RefreshTokenModel.findOneAndDelete({ token: refreshToken });

        const user = await UserModel.findOne({ _id: userID });
        if (!user) {
            //! Error Codes
        }

        const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30day",
        });

        const newRefreshToken = await RefreshTokenModel.createToken(user);

        res.cookie("access-token", accessToken, {
            maxAge: 900_000,
            httpOnly: true,
        });

        res.cookie("refresh-token", newRefreshToken, {
            maxAge: 900_000,
            httpOnly: true,
        });

    } catch (err) {
        return res.status(500).json({ statusCode: 500, error: err.message });
    }
}

exports.resendCode = async (req, res) => {
    try {
        const phone = req.params.phone

        const checkBan = await banModel.findOne({ phone })
        if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })
        const OTP_CODE = Math.floor(Math.random() * 10000)
        request.post({
            url: 'http://ippanel.com/api/select',
            body: {
                "op": "pattern",
                "user": process.env.USERNAME_OTP_PANEL,
                "pass": process.env.PASSWORD_OTP_PANEL,
                "fromNum": process.env.FORMNUM_OTP_PANEL,
                "toNum": phone,
                "patternCode": process.env.PATTERT_OTP_PANEL,
                "inputData": [{ "verification-code": OTP_CODE }]
            },
            json: true,
        }, async function (error, response, body) {

            if (!error && response.statusCode === 200) {

                //if (typeof response.body !== "number" && response.body[0] !== 0) return res.status(response.body[0]).json(response.body)

                await OtpcodeModel.create({
                    code: OTP_CODE,
                    phone,
                    email: null,
                    expiresIn: Date.now() + 120000,
                    for: "auth"
                })


                return res.status(200).json({ statusCode: 200, message: "code send succ" })

            } else {
                return res.status(500).json({ statusCode: 500, message: err.message })
            }
        })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
//* Checked (1)
exports.logout = async (req, res) => {
    try {

        res.clearCookie('session-id');
        res.clearCookie('connect.sid');
        res.clearCookie('RefreshToken');
        res.clearCookie('AccessToken');

        return res.status(200).json({ statusCode: 200, message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
};
//* Checked (1)