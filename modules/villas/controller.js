const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const validator = require("email-validator");

exports.add = async (req, res) => {
    try {

    } catch (err) { return res.status(422).send(err.message); }
}
