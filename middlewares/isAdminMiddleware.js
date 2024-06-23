module.exports = async (req, res, next) => {
    try {
        const isadmin = req.user.role === 'admin'
        if (isadmin) return next();

        return res.status(403).json({ statusCode: 403, message: "you can not have accsess to this route (only admins can)" })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, error: err.message })
    }
}
// * Checked