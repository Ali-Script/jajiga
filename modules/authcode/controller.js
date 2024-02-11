// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const userModel = require('./model')
// const joi = require('./../../validator/authValidator');
// const { signedCookie } = require('cookie-parser');
// require("dotenv").config()


exports.auth = async (req, res) => {
    try {



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