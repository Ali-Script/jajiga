const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const swagger = require('./configs/apiDoc/swaggerRoutes');
const { setHeaders } = require('./middlewares/headers')

app.use(helmet());
app.use(express.json())
app.use(bodyParser.urlencoded({ limit: "20mb", extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cookieParser("rtujh57uhHG)B$&ghy073hy57hbHB)$&BH)Hb85h4b84bhe8hb*BH#$*B"))
app.use("/villa/covers", express.static(path.join(__dirname, 'public', 'covers')));
app.use("/user/avatars", express.static(path.join(__dirname, 'public', 'avatars')));
app.use("/static/zone", express.static(path.join(__dirname, 'public', 'static', 'zone')));
app.use("/static/city", express.static(path.join(__dirname, 'public', 'static', 'city')));
app.use("/api-doc", swagger)
app.use(setHeaders);

const corsOptions = {
    origin: ["https://jajiga.liara.run", "http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: "include",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const authRouter = require('./modules/auth/router')
const codeRouter = require('./modules/authcode/router')
const userRouter = require('./modules/users/router')
const banRouter = require('./modules/ban/router')
const villaRouter = require('./modules/villas/router')
const newsletterRouter = require('./modules/newsletter/router')
const notificationRouter = require('./modules/notification/router')
const commentRouter = require('./modules/comment/router')
const categoryRouter = require('./modules/category/router')
const reserveRouter = require('./modules/reserve/router')
const wishesRouter = require('./modules/wishes/router')
const panelRouter = require('./modules/panel/router')
const ticketRouter = require('./modules/ticket/router')


app.use("/", authRouter, panelRouter)
app.use("/auth/E-code", codeRouter)
app.use("/user/", userRouter)
app.use("/villa/", villaRouter, reserveRouter)
app.use("/ban-user/", banRouter)
app.use("/notification/", notificationRouter)
app.use("/newsletter/", newsletterRouter)
app.use("/comment/", commentRouter)
app.use("/category/", categoryRouter)
app.use("/wishes/", wishesRouter)
app.use("/ticket/", ticketRouter)

app.use((req, res) => {
    return res.status(404).json({ statusCode: 404, message: "page not found 404" })
})

app.use((err, req, res, next) => {
    return res.status(500).json({ statusCode: 500, message: err });
});


module.exports = app;