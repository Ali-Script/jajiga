const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./model')
const joi = require('./../../validator/authValidatorrs');
const { signedCookie } = require('cookie-parser');
require("dotenv").config()


exports.auth = async (req, res) => {
    try {
        const { UserName, Email, Password, ConfirmPassword } = req.body;
        req.body = { UserName, Email }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error })

        const checkDuplicate = await userModel.findOne({ UserName })
        if (checkDuplicate) return res.status(409).json({ message: "User already exists !" })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(Password, salt);

        const user = await userModel.create({
            UserName,
            Email
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "14 day" })
        res.cookie("token", token, {
            maxAge: 14 * 24 * 60 * 60,
            httpOnly: true,
            signed: true,
            secure: true
        })
        return res.status(200).json({ message: "success", token: token })
    } catch (err) { return res.status(500).send(err.message); }
}
exports.login = async (req, res) => {
    try {
        console.log("object");
    } catch (err) { return res.status(500).send(err.message); }
}
exports.getme = async (req, res) => {
    try {

    } catch (err) { return res.status(500).send(err.message); }
}