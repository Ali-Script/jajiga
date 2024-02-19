const jwt = require('jsonwebtoken');
require("dotenv").config();

const genAccessToken = (Email) => {
    try {
        const token = jwt.sign({ Email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15 s" })
        return token;
    }
    catch (e) { return res.status(500).json(e.message); }
}
const genRefreshToken = (Email) => {
    try {
        // const token = jwt.sign({ Email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "14 day" })
        // return token;

        const token2 = jwt.sign({ Email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "15 s" })
        return token2;
    }
    catch (e) { return res.status(500).json(e.message); }
}

module.exports = {
    genRefreshToken,
    genAccessToken
}