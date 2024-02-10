const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');


app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cookieParser("rtujh57uhHG)B$&ghy073hy57hbHB)$&BH)Hb85h4b84bhe8hb*BH#$*B"))



const authRouter = require('./modules/auth/router')
app.use("/", authRouter)


module.exports = app;