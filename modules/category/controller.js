const mongoose = require("mongoose");
const categoryModel = require("./model");
const villaModel = require('./../villas/model');
const joi = require('./../../validator/categoryValidator');


exports.setCategory = async (req, res) => {
    try {
        const { title, href } = req.body

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ message: validator.error.details })

        const duplicate = await categoryModel.findOne({ href })
        if (duplicate) {
            return res.status(422).json({ message: "Duplicated Data !!" })
        }

        const Category = await categoryModel.create({ title, href })
        return res.json({ message: "Category Document Created !", Category })

    } catch (err) { return res.status(422).json(err.message) }
}
exports.getOne = async (req, res) => {
    try {

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) {
            return res.status(422).json({ message: "Invalid ObjectId !!" })
        }

        const category = await categoryModel.findOne({ _id: req.params.id }).lean()
        if (!category) {
            return res.status(404).json({ message: "Category not found 404" })
        }

        return res.json(category)
    } catch (err) { return res.status(422).json(err.message) }
}
exports.getAll = async (req, res) => {
    try {
        const category = await categoryModel.find({}).sort({ _id: -1 }).sort({ _id: -1 }).lean()
        if (category.length === 0) return res.status(404).json({ message: "There in no Category !!" })

        return res.status(200).json(category)

    } catch (err) { return res.status(422).json(err.message) }
}
exports.removeOne = async (req, res) => {
    try {

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) {
            return res.status(422).json({ message: 'Invalid Object ID' })
        }
        const category = await categoryModel.findOneAndDelete({ _id: req.params.id }).lean()
        if (!category) {
            return res.status(404).json({ message: "Category not found 404" })
        }
        return res.status(200).json({ message: "Category Removed !" })

    } catch (err) { return res.status(422).json(err.message) }
}
