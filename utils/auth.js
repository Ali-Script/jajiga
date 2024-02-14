const jwt = require('jsonwebtoken');
require("dotenv").config();

const genAccessToken = (email) => {
    try {
        const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15 s" })
        return token;
    }
    catch (e) { return res.status(500).json(e.message); }
}
const genRefreshToken = async (email) => {
    try {
        const token = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "14 day" })
        return token;
    }
    catch (e) { return res.status(500).json(e.message); }
}

module.exports = {
    genAccessToken,
    genRefreshToken
}