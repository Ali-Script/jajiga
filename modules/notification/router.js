const express = require("express");
const router = express.Router();

const notificationController = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");


router
    .route("/send")
    .post(notificationController.send)

router
    .route("/get")
    .get(authMiddleware, isAdmin, notificationController.get)
router
    .route("/getAll")
    .get(authMiddleware, isAdmin, notificationController.getAll)
router
    .route("/remove/:id")
    .delete(authMiddleware, isAdmin, notificationController.remove)

module.exports = router;