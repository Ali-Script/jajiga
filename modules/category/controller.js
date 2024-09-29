const mongoose = require("mongoose");
const categoryModel = require("./model");
const villaModel = require('./../villas/model');
const joi = require('./../../validator/categoryValidator');


exports.setCategory = async (req, res) => {
    try {
        const { title, href } = req.body

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })

        const duplicate = await categoryModel.findOne({ $or: [{ title }, { href }] })
        if (duplicate) {
            return res.status(422).json({ statusCode: 422, message: "Duplicated Data !!" })
        }

        const category = await categoryModel.create({ title, href })
        return res.status(200).json({ statusCode: 200, message: "Category Document Created !", category })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }) }
}
// exports.getOne = async (req, res) => {
//     try {

//         const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
//         if (!isvalidID) {
//             return res.status(422).json({ message: "Invalid ObjectId !!" })
//         }

//         const category = await categoryModel.findOne({ _id: req.params.id }).lean()
//         if (!category) {
//             return res.status(404).json({ message: "Category not found 404" })
//         }

//         return res.json(category)
//     } catch (err) { return res.status(422).json(err.message) }
// }
exports.getAll = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ _id: -1 }).sort({ _id: -1 }).lean()
        if (categories.length === 0) return res.status(404).json({ statusCode: 404, message: "There is no Category !!" })


        const villas = await villaModel.find({}).lean()

        categories.forEach(category => {
            category.villas = villas.filter(villa => villa.aboutVilla.villaType.toString() === category._id.toString()).length || 0;

            if (category.href == "houseboat") category.cover = "kish.webp"
            if (category.href == "boutiqueHotel") category.cover = "rasht.webp"
            if (category.href == "inn") category.cover = "masal.webp"
            if (category.href == "hostle") category.cover = "kordan.webp"
            if (category.href == "dorm") category.cover = "shahriar.webp"
            if (category.href == "tent") category.cover = "talesh.webp"
            if (category.href == "guestHouse") category.cover = "tabriz.webp"
            if (category.href == "hotelApartment") category.cover = "sari.webp"
            if (category.href == "apartment") category.cover = "sari.webp"
            if (category.href == "ecoResort") category.cover = "savadkuh.webp"
            if (category.href == "cottage") category.cover = "kordan.webp"
            if (category.href == "farmhouse") category.cover = "kelardasht.webp"
            if (category.href == "suite") category.cover = "shahriar.webp"
            if (category.href == "house") category.cover = "kordan.webp"

        });








        return res.status(200).json({ statusCode: 200, categories })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }) }
}
exports.removeOne = async (req, res) => {
    try {
        const id = req.params.id
        const isvalidID = mongoose.Types.ObjectId.isValid(id)
        if (!isvalidID) {
            return res.status(422).json({ statusCode: 422, message: 'Invalid Object ID' })
        }
        const category = await categoryModel.findOneAndDelete({ _id: id }).lean()
        if (!category) {
            return res.status(404).json({ statusCode: 404, message: "Category not found 404" })
        }
        return res.status(200).json({ statusCode: 200, message: "Category Removed !" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }) }
}
