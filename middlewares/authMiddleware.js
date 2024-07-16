const jwt = require('jsonwebtoken');
const userModel = require('./../modules/auth/model');
require("dotenv").config()

module.exports = async (req, res, next) => {
    try {
        // let Cookies = JSON.stringify(req.cookies)
        // console.log(Cookies);
        // const token = req.signedCookies.AccessToken;
        // if (token == undefined) return res.status(440).json({ statusCode: 440, message: "Please login no user found" })

        const headers = req.header("Authorization")?.split(" ")
        if (headers?.length !== 2) {
            return res.status(403).json({ message: "This Route is Protect You cant Have Accsess it" })
        }

        const token = headers[1]


        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const user = await userModel.findOne({ phone: decoded.Identifeir })
        if (!user) return res.status(404).json({ statusCode: 404, message: "User Not Found !" })

        const userobj = user.toObject()
        // Reflect.deleteProperty(userobj, "Password")

        // req.user = userobj
        req.user = userobj

        return next();
    }
    catch (err) {
        return res.status(500).json({ statusCode: 500, error: err.message })
    }
};
// * Checked 
