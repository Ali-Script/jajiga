const jwt = require('jsonwebtoken');
const userModel = require('./../modules/auth/model');
require("dotenv").config()

module.exports = async (req, res, next) => {
    try {

        const token = req.signedCookies.AccessToken;
        if (token == undefined) return res.status(440).json({ message: "Please login no user found" })

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const user = await userModel.findOne({ $or: [{ Email: decoded.Identifeir }, { Phone: decoded.Identifeir }] })

        if (!user) return res.status(404).json({ message: "User Not Found !" })

        const userobj = user.toObject()
        Reflect.deleteProperty(userobj, "Password")

        req.user = userobj
        return next();
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}
