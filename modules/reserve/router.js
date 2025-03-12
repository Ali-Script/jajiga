const express = require("express");
const router = express.Router();

const controller = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");

router
    .route("/book/price/:villaID")
    .post(controller.reservePrice)
router
    .route("/book/:villaID")
    .post(authMiddleware, controller.reserve)
router
    .route("/cancelReservation/:villaID")
    .delete(authMiddleware, controller.cancelReservation)

module.exports = router;