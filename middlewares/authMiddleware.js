const jwt = require('jsonwebtoken');
const userModel = require('./../modules/auth/model');
require("dotenv").config()

module.exports = async (req, res, next) => {
    try {

        const headers = req.header("Authorization")?.split(" ")
        if (headers?.length !== 2) {
            return res.status(403).json({ message: "This Route is Protect You cant Have Accsess it" })
        }

        // const token = req.signedCookies.AccessToken;
        // if (token == undefined) return res.status(403).json({ message: "This Route is Protect You cant Have Accsess it" })

        // const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        // const user = await userModel.findOne({ _id: decoded.id })

        // if (!user) return res.status(404).json({ message: "User Not Found !" })
        const token = headers[1]
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const user = await userModel.findOne({ Email: decoded.Email })

        if (!user) {
            return res.status(403).json({ message: "This Route is Protect You cant Have Accsess it" })
        }

        const userobj = user.toObject()
        Reflect.deleteProperty(userobj, "Password")
        //console.log(userobj);
        req.user = userobj
        next();
    }
    catch (err) {
        return res.status(422).json(err.message)
    }
}
