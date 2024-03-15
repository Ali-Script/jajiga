const mongoose = require('mongoose');
const notificationModel = require("./model")
const userModel = require("./../auth/model")


exports.send = async (req, res) => {
    try {
        const { message } = req.body
        const allUsers = [];

        const users = await userModel.find()
        if (!users) return res.status(404).json({ message: 'User not found' })
        users.forEach(user => allUsers.push(user._id))

        const notif = await notificationModel.create({
            message,
            users: allUsers,
            sendBy: req.user._id
        })
        return res.status(200).json({ message: "Message sended to all users !" })
    } catch (err) { return res.status(422).json({ message: err.message }); }
}
// test 1
exports.get = async (req, res) => {
    try {
        const getNotif = await notificationModel.find({ seen: 0 }).sort({ _id: -1 }).lean()
        await notificationModel.updateMany({ adminID: req.user._id }, { seen: 1 })
        return res.json(getNotif)
    }
    catch (err) { return res.status(422).json({ message: err.message }); }
}
// test 1
exports.getAll = async (req, res) => {
    try {
        const getNotif = await notificationModel.find({}).sort({ _id: -1 }).lean()
        return res.json(getNotif)
    }
    catch (err) { return res.status(422).json({ message: err.message }); }
}// test 1
exports.remove = async (req, res) => {
    try {

        const isvalidID = mongoose.Types.ObjectId.isValid(req.params.id)
        if (!isvalidID) {
            return res.status(422).json({ message: "Invalid ObjectId !!" })
        }

        const getNotif = await notificationModel.findOneAndDelete({ _id: req.params.id }).lean()
        if (!getNotif) return res.status(404).json({ message: "Notif not found !!" })

        return res.json(getNotif)
    }
    catch (err) { return res.status(422).json({ message: err.message }); }
}
// test 1

