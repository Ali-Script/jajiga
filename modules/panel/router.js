const express = require("express");
const router = express.Router();

const controller = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");


router
    .route("/admin-panel")
    .get(authMiddleware, isAdmin, controller.get)

module.exports = router;