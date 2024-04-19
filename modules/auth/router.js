const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')

router
    .route("/")
    .get(authMiddleware, controller.start)
router
    .route("/auth/sendEmail")
    .post(controller.auth)
router
    .route("/auth/emailCode")
    .post(controller.authCode)
router
    .route("auth/sendOtp")
    .post(controller.sendOtpPhone)
router
    .route("/auth/otpCode")
    .post(controller.authOtpPhone)
router
    .route("/login/Phone")
    .post(controller.loginByPhone)
router
    .route("/login/Email")
    .post(controller.loginByEmail)
router
    .route("/getMe")
    .get(authMiddleware, controller.getme)
router
    .route("/setNewAccessToken")
    .get(controller.getAccessToken)

module.exports = router