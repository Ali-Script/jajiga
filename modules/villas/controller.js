const mongoose = require('mongoose');
const villaModel = require('./../auth/model');
const joi = require("./../../validator/villaValidator");

exports.add = async (req, res) => {
    try {
        const { address, map, cover, description, capAndSizeAndRooms, facility, sanitaryFacilities, timing, price, rules } = req.body;

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

        const ifDUPLC = await userModel.findOne(map)
        if (ifDUPLC) {
            return res.status(409).json({ message: "this location is already exist" })
        }

        const newVilla = await villaModel.create({
            user: req.user._id,
            address,
            map,
            cover: req.files.filename,
            description,
            capAndSizeAndRooms,
            facility,
            sanitaryFacilities,
            timing,
            price,
            rules
        })
        if (!newVilla) return res.status(500).json({ message: "can not add data to the database" })

        return res.status(200).json({ message: "Succ !" })

    } catch (err) { return res.status(422).send(err.message); }
}
