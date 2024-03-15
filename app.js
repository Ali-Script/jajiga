const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const swagger = require('./configs/swagger');

// Packages ^

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cookieParser("rtujh57uhHG)B$&ghy073hy57hbHB)$&BH)Hb85h4b84bhe8hb*BH#$*B"))
app.use("/course/cover", express.static(path.join(__dirname, 'public', 'multer', 'pics', 'avatars')));
swagger(app);

// Middlewares ^

const authRouter = require('./modules/auth/router')
const codeRouter = require('./modules/authcode/router')
const userRouter = require('./modules/users/router')
const banRouter = require('./modules/ban/router')
const villaRouter = require('./modules/villas/router')
const newsletterRouter = require('./modules/newsletter/router')
const notificationRouter = require('./modules/notification/router')

// Routers ^

app.use("/", authRouter)
app.use("/auth/E-code", codeRouter)
app.use("/users/", userRouter)
app.use("/villa/", villaRouter)
app.use("/ban/", banRouter)
app.use("/notification/", notificationRouter)
/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.use("/newsletter/", newsletterRouter)

// Routers Middleware ^

app.use((req, res) => {
    return res.status(404).json({ message: "page not found 404" })
})

app.use((err, req, res, next) => {
    return res.status(500).json({ error: { message: err }, });
});

// Static Routes ^

module.exports = app;