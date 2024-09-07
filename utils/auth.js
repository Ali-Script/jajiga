const jwt = require('jsonwebtoken');
require("dotenv").config();

const genAccessToken = (Identifeir) => {
    try {
        const token = jwt.sign({ Identifeir }, process.env.JWT_ACCESS_SECRET, { expiresIn: "150 day" })
        return token;
    }
    catch (e) { return res.status(500).json({ statusCode: 500, message: e.message }); }
}
const genRefreshToken = (Identifeir) => {
    try {
        const token = jwt.sign({ Identifeir }, process.env.JWT_REFRESH_SECRET, { expiresIn: "14 day" })
        return token;
    }
    catch (e) { return res.status(500).json({ statusCode: 500, message: e.message }); }
}

module.exports = {
    genAccessToken,
    genRefreshToken
}