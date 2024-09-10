const express = require("express");
const router = express.Router();

const controller = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");


router
    .route("/:villaID")
    .post(authMiddleware, controller.add)
router
    .route("/")
    .get(authMiddleware, controller.get)
router
    .route("/dell")
    .get(controller.dell)

module.exports = router;