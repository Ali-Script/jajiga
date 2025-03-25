const multer = require('multer');
const path = require('path');


const filename = function (req, file, cb) {
    try {
        const fileunicname = Date.now() + Math.random() * 100
        const extname = path.extname(file.originalname)

        const validFormat = [".jpg", ".png", ".jpeg", ".jfif", ".pjpeg", ".pjp"]

        if (validFormat.includes(extname)) cb(null, fileunicname + extname)
        else cb(new Error(`Just ${validFormat.join(' | ')} is valid`))

    } catch (err) {
        return res.status(444).json({ statusCode: 444, message: err.message })
    }
}


const maxSize = 1 * 1000 * 1000 * 10

const upload = multer({
    filename,
    limits: {
        fileSize: maxSize
    }
})
module.exports = upload






