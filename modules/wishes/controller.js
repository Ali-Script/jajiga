const mongoose = require('mongoose');
const wishesModel = require('./model')
const villaModel = require('./../villas/model')
const commentModel = require('./../comment/model')
const reserveModel = require('./../reserve/model')

exports.add = async (req, res) => {
    try {
        const user = req.user
        const villaID = req.params.villaID
        const { flag } = req.body
        let type = typeof flag
        if (flag == undefined) return res.status(422).json({ statusCode: 422, message: 'validation error' })
        if (type != "boolean") return res.status(422).json({ statusCode: 422, message: 'validation error' })

        const validate = mongoose.Types.ObjectId.isValid(villaID);
        if (!validate) return res.status(400).json({ statusCode: 400, message: 'Invalid Object Id' })

        const villa = await villaModel.findOne({ _id: villaID, finished: true, isAccepted: "true" }).lean()
        if (!villa) return res.status(404).json({ statusCode: 404, message: 'no villa found with this id' })


        if (flag == true) {

            let checkEx = await wishesModel.findOne({ user: user._id, villa: villa._id })
            if (checkEx) return res.status(421).json({ statusCode: 421, message: 'this villa is already in your wish list' })
            let create = new wishesModel({
                user: user._id,
                villa: villaID,
            })
            create = await create.save();
            return res.status(200).json({ statusCode: 200, message: "added" })
        } else if (flag == false) {
            let del = await wishesModel.findOneAndDelete({ user: user._id, villa: villa._id })
            if (!del) return res.status(422).json({ statusCode: 422, message: 'nothing found in wish list' })
            return res.status(200).json({ statusCode: 200, message: "removed" })
        }

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.get = async (req, res) => {
    try {
        const user = req.user
        let faveVillas = []

        const getWishes = await wishesModel.find({ user: user._id }).populate("villa").lean()

        for (const data of getWishes) {
            const comments = await commentModel.find({ villa: data.villa._id }).select('score -_id');
            const vill = await villaModel.find({ _id: data.villa._id }).populate("aboutVilla.villaType")

            const commentCount = comments.length;
            const totalScore = comments.reduce((acc, comment) => acc + comment.score, 0);
            const averageScore = commentCount > 0 ? totalScore / commentCount : 0;

            const getBook = await reserveModel.find({ villa: data.villa._id }).countDocuments()


            let obj = {
                _id: data.villa._id,
                title: data.villa.title,
                address: data.villa.address,
                aboutVilla: vill[0].aboutVilla,
                cover: data.villa.cover,
                price: data.villa.price,
                capacity: data.villa.capacity,
                comments: commentCount,
                averageScore,
                booked: getBook
            };

            const trueKeys = Object.keys(data.villa.facility.facility).filter(key => {
                if (key !== "moreFacility") return data.villa.facility.facility[key].status === true
            });
            if (trueKeys.length >= 5) obj.costly = true

            faveVillas.push(obj);
        }



        res.cookie("test11acc", "ffac", {
            maxAge: 999999999999999, //14 * 24 * 60 * 60,
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "strict"
        })
        res.cookie("test22reff", "ffref", {
            maxAge: 999999999999999, //15000
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "strict"
        })



        return res.status(200).json({ statusCode: 200, faveVillas })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.dell = async (req, res) => {
    await villaModel.updateMany({ isAccepted: "true" })
    await commentModel.updateMany({ isAccept: "true" })
}