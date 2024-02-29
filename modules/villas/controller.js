const mongoose = require('mongoose');
const userModel = require('./../auth/model');
const validator = require("email-validator");

exports.add = async (req, res) => {
    try {
        const { address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, rules } = req.body;

        req.body = { address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, rules }

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

    } catch (err) { return res.status(422).send(err.message); }
}
