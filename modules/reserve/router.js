const express = require("express");
const router = express.Router();

const controller = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");


router
    .route("/book/:villaID")
    .post(authMiddleware, controller.reserve)

module.exports = router;