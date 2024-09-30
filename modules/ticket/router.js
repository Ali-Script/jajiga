const express = require("express");
const router = express.Router();

const controller = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");


router
    .route("/send")
    .post(authMiddleware, controller.send)

module.exports = router;