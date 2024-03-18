const banModel = require("./../ban/model")
const userModel = require("./../auth/model")
const validator = require("email-validator")

exports.ban = async (req, res) => {
    try {
        const email = req.params.email;
        const reason = req.body.reason;

        const validate = validator.validate(email);
        if (!validate) return res.status(400).json({ error: 'Invalid Email' })

        const findUser = await userModel.findOne({ Email: email }).lean()
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
        const email = req.params.email;

        const validate = validator.validate(email);
        if (!validate) return res.status(400).json({ error: 'Invalid Email' })

        const findUser = await userModel.findOne({ Email: email }).lean()
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
            .populate("user", " -_id Email")
            .populate("bannedBy", "-_id Email ")
            .sort({ _id: -1 })
            .lean();

        if (all.length == 0) return res.status(404).json({ message: "no user has banned yet" })
        return res.status(200).json(all)
    } catch (err) { return res.status(422).send(err.message); }
}