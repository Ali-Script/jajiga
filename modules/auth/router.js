const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')

router
    .route("/")
    .get(authMiddleware, controller.start)
router
    .route("/auth")
    .post(controller.auth)
router
    .route("/authCode")
    .post(controller.authCode)
router
    .route("/login")
    .post(controller.login)
router
    .route("/getMe")
    .get(authMiddleware, controller.getme)

module.exports = router