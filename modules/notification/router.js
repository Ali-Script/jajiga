const express = require("express");
const router = express.Router();

const notificationController = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");


router
    .route("/send")
    .post(authMiddleware, isAdmin, notificationController.send)

router
    .route("/get")
    .get(authMiddleware, notificationController.get)
router
    .route("/seen")
    .get(authMiddleware, isAdmin, notificationController.seen)
router
    .route("/removeObserved")
    .delete(authMiddleware, isAdmin, notificationController.removeObserved)
router
    .route("/removeAll")
    .delete(authMiddleware, isAdmin, notificationController.removeAll)

module.exports = router;