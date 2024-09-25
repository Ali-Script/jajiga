const banModel = require("./../ban/model")
const userModel = require("./../auth/model")
const validator = require("email-validator")
const joi = require('./../../validator/ban-userValidation');

exports.ban = async (req, res) => {
    try {
        const phone = req.params.phone;
        const { reason } = req.body;

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })

        const findUser = await userModel.findOne({ phone: phone }).lean()
        if (!findUser || findUser.length == 0) {
            return res.status(404).json({ statusCode: 404, message: 'no user found' })

        } else if (findUser.role == "admin") {
            return res.status(402).json({ statusCode: 402, message: 'you can not ban admin' })
        }

        const FindbanUser = await banModel.findOne({ phone: findUser.phone }).lean()
        if (FindbanUser) return res.status(422).json({ statusCode: 422, message: 'This user already has banned' })

        await banModel.create({
            phone,
            reason,
            bannedBy: req.user._id
        })
        return res.status(200).json({ statusCode: 200, message: "Succ" });

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
exports.unban = async (req, res) => {
    try {
        const phone = req.params.phone;

        const findUser = await userModel.findOne({ phone }).lean()
        if (!findUser || findUser.length == 0) return res.status(404).json({ statusCode: 404, message: 'no user found' })

        const FindbanUser = await banModel.findOne({ phone: findUser.phone }).lean()
        if (!FindbanUser || FindbanUser.length == 0) return res.status(422).json({ statusCode: 422, message: 'this user has not been banned' })

        await banModel.deleteOne({ phone: findUser.phone }).lean()
        return res.status(200).json({ statusCode: 200, message: 'user unban succ ' })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
exports.getAll = async (req, res) => {
    try {
        const all = await banModel.find({})
            .populate("bannedBy", "-password")
            .sort({ _id: -1 })
            .lean();

        if (all.length == 0) return res.status(404).json({ message: "no user has banned yet" })
        return res.status(200).json({ statusCode: 200, bannedUsers: all })
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}