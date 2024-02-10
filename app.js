const express = require('express');
const app = express();

const authRouter = require('./modules/auth/router')
app.use("/", authRouter)


module.exports = app;