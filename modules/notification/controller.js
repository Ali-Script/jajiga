const mongoose = require('mongoose');
const notificationModel = require("./model")
const userModel = require("./../auth/model")


exports.send = async (req, res) => {
    try {
        const { message } = req.body

        const users = await userModel.find()
        if (!users) return res.status(404).json({ message: 'User not found' })

        users.forEach(async (user) => {
            const notif = await notificationModel.create({
                message,
                id: user._id,
                sendBy: req.user._id
            })
        })
        return res.status(200).json({ message: "Message sended to all users !" })
    } catch (err) { return res.status(422).json({ message: err.message }); }
}
exports.get = async (req, res) => {
    try {

        const getNotif = await notificationModel.find({ seen: 0, allUsers: 1 })
            .sort({ _id: -1 })
            .populate("id", "UserName -_id")
            .populate("sendBy", "UserName -_id")
            .lean();

        if (getNotif.length == 0 || !getNotif) return res.status(404).json({ message: "there is no notificatoin" })
        return res.status(200).json(getNotif)

    } catch (err) { return res.status(422).json({ message: err.message }); }
}
exports.seen = async (req, res) => {
    try {
        const getNotif = await notificationModel.findOneAndUpdate({ id: req.user._id }, { seen: 1 })
        if (getNotif.length == 0 || !getNotif) return res.status(404).json({ message: "there is no notificatoin for this user" })
        return res.status(200).json({ message: "seen !" })
    }
    catch (err) { return res.status(422).json({ message: err.message }); }
}
exports.removeObserved = async (req, res) => {
    try {
        const getNotif = await notificationModel.find({ seen: 1 }).lean()
        if (!getNotif || getNotif.length == 0) return res.status(404).json({ message: "Notif not found !!" })
        const deleteN = await notificationModel.deleteMany({ seen: 1 }).lean()
        return res.status(200).json(deleteN)
    } catch (err) { return res.status(422).json({ message: err.message }); }
}
exports.removeAll = async (req, res) => {
    try {

        const getNotif = await notificationModel.find().lean()
        if (!getNotif) return res.status(404).json({ message: "Notif not found !!" })
        const deleteN = await notificationModel.deleteMany()
        return res.json(deleteN)

    } catch (err) { return res.status(422).json({ message: err.message }); }
}


