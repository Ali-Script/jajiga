const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')

router
    .route("/")
    .get(authMiddleware, controller.start)
router
    .route("/signup")
    .post(controller.signup)
router
    .route("/otp")
    .post(controller.sendOtpPhone)
router
    .route("/auth/otp")
    .post(controller.authOtpPhone)
router
    .route("/login/:phone")
    .post(controller.login)
router
    .route("/getMe")
    .get(authMiddleware, controller.getme)
router
    .route("/setNewAccessToken")
    .get(controller.getAccessToken)
router
    .route("/resendCode/:phone")
    .get(controller.resendCode)

module.exports = router