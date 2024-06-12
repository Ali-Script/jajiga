module.exports = async (req, res, next) => {
    const isadmin = req.user.role === 'admin'

    if (isadmin) {
        return next();
    }
    return res.status(403).json({ message: "you can not have accsess to this route (only admins can)" })
}