exports.setHeaders = (req, res, next) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "https://jajiga.liara.run", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    } catch (err) {
        return res.status(501).json({ statusCode: 501, error: err.message });
    }
}
// * Checked