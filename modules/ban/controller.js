const banModel = require("./../ban/model")
const userModel = require("./../auth/model")
const validator = require("email-validator")

exports.ban = async (req, res) => {
    try {
        const Identifeir = req.params.Identifeir;
        const reason = req.body.reason;



        const findUser = await userModel.findOne({ $or: [{ Email: Identifeir }, { Phone: Identifeir }] }).lean()
        if (!findUser || findUser.length == 0) {
            return res.status(404).json({ message: 'no user found' })

        } else if (findUser.Role == "admin") {
            return res.status(422).json({ message: 'you cant ban admin' })
        }

        const FindbanUser = await banModel.findOne({ user: findUser._id }).lean()
        if (FindbanUser) return res.status(404).json({ message: 'This user already has banned' })

        const add = banModel.create({
            email,
            reason,
            bannedBy: req.user._id
        })
        return res.status(200).json({ message: "Ban Successfully" });
    } catch (err) { return res.status(422).send(err.message); }
}
exports.unban = async (req, res) => {
    try {
        const Identifeir = req.params.Identifeir;

        const findUser = await userModel.findOne({ $or: [{ UserName: Identifeir }, { email: Identifeir }] }).lean()
        if (!findUser || findUser.length == 0) return res.status(404).json({ message: 'no user found' })

        const FindbanUser = await banModel.findOne({ user: findUser._id }).lean()
        if (!FindbanUser || FindbanUser.length == 0) return res.status(404).json({ message: 'this user has not been banned' })

        const User = await banModel.deleteOne({ user: findUser._id }).lean()
        return res.status(200).json({ message: 'user unban succ ' })

    } catch (err) { return res.status(422).send(err.message); }
}
exports.getAll = async (req, res) => {
    try {
        const all = await banModel.find({})
            .populate("user")
            .populate("bannedBy")
            .sort({ _id: -1 })
            .lean();

        if (all.length == 0) return res.status(404).json({ message: "no user has banned yet" })
        return res.status(200).json(all)
    } catch (err) { return res.status(422).send(err.message); }
}