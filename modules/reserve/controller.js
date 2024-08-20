const mongoose = require('mongoose')
const joi = require('./../../validator/reserveValidator');
const villaModel = require('../villas/model')
const reserveModel = require('./model')
const realTimeDate = new Date()

exports.reserve = async (req, res) => {
    try {

        const villaID = req.params.villaID
        const user = req.user
        const { date } = req.body

        const validator = joi.validate({ villa: villaID, date })
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })



        let from = date.from
        let to = date.to
        let splitedFrom = from.split("/").join('')
        let splitedTo = to.split("/").join('')

        if (+splitedFrom >= +splitedTo) return res.status(402).json({ statusCode: 402, message: "date>to  should greater than date>from" })


        const checkVillaExists = await villaModel.findOne({ _id: villaID })
        if (!checkVillaExists) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" })


        const isReserved = await reserveModel.find({ villa: villaID }).sort({ _id: -1 })

        if (isReserved[0]) {

            if (isReserved[0].date.to >= date.from) return res.status(422).json({ statusCode: 422, message: "Villa is already booked" })

        }

        let reserve = new reserveModel({
            villa: villaID,
            user: user._id,
            date
        })
        reserve = await reserve.save();

        return res.status(200).json({ statusCode: 200, message: "Successful booking" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.reservePrice = async (req, res) => {
    try {

        const villaID = req.params.villaID
        const user = req.user
        const { date } = req.body

        const validator = joi.validate({ villa: villaID, date })
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })



        let from = date.from
        let to = date.to
        let splitedFrom = from.split("/").join('')
        let splitedTo = to.split("/").join('')

        if (+splitedFrom >= +splitedTo) return res.status(402).json({ statusCode: 402, message: "date>to  should greater than date>from" })


        const villa = await villaModel.findOne({ _id: villaID })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" })





        return res.status(200).json({ statusCode: 200, message: "Successful booking" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}