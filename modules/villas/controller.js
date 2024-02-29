const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const validator = require("email-validator");
const joi = require("./../../validator/villaValidator");

exports.add = async (req, res) => {
    try {
        const { address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, price, rules } = req.body;
        // req.body = { address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, price, rules }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })
        return res.status(200).json("succ")

    } catch (err) { return res.status(422).send(err.message); }
}
