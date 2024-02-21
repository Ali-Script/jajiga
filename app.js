const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

// Packages ^

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cookieParser("rtujh57uhHG)B$&ghy073hy57hbHB)$&BH)Hb85h4b84bhe8hb*BH#$*B"))
app.use("/course/cover", express.static(path.join(__dirname, 'public', 'multer', 'pics', 'avatars')));

// Middlewares ^

const authRouter = require('./modules/auth/router')
const codeRouter = require('./modules/authcode/router')
const userRouter = require('./modules/users/router')

// Routers ^

app.use("/", authRouter)
app.use("/auth/E-code", codeRouter)
app.use("/users/", userRouter)

// Routers Middleware ^

app.use((req, res) => {
    return res.status(404).json({ message: "page not found 404" })
})

app.use((err, req, res, next) => {
    return res.status(500).json({ error: { message: err }, });
});

// Static Routes ^

module.exports = app;