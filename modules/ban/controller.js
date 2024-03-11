const banModel = require("./../ban/model")
const banModel = require("./../auth/model")

exports.ban = async (req, res) => {
    try {
        const id = req.params.id;


    } catch (err) { return res.status(422).send(err.message); }
}
exports.unban = async (req, res) => {
    try {

    } catch (err) { return res.status(422).send(err.message); }
}
exports.getAll = async (req, res) => {
    try {
        const all = await banModel.find({}).populate("user ", "UserName Email").sort({ _id: -1 }).lean();
        if (all.length == 0) return res.status(404).json({ message: "no user has banned yet" })
        return res.status(200).json(all)
    } catch (err) { return res.status(422).send(err.message); }
}