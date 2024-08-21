const mongoose = require('mongoose');
const wishesModel = require('./model')
const villaModel = require('./../villas/model')

exports.add = async (req, res) => {
    try {
        const user = req.user
        const villaID = req.params.villaID

        const validate = mongoose.Types.ObjectId.isValid(villaID);
        if (!validate) return res.status(400).json({ statusCode: 400, error: 'Invalid Object Id' })

        const villa = await villaModel.findOne({ _id: villaID }).lean()
        if (!villa) return res.status(404).json({ statusCode: 404, error: 'no villa found with this id' })

        let create = new wishesModel({
            user: user._id,
            villa: villaID,
        })
        create = await create.save();


        return res.status(200).json({ statusCode: 200, message: "succ" })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}