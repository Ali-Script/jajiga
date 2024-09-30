exports.send = async (req, res) => {
    try {
        return res.status(200).json({ statusCode: 200, message: "code sended succ" })
    } catch
    (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}