const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')

router
    .route("/")
    .get(controller.start)
router
    .route("/signup")
    .post(controller.signup)
router
    .route("/auth/sendCode")
    .post(controller.sendOtpPhone)
router
    .route("/auth/confirmCode")
    .post(controller.authOtpPhone)
router
    .route("/loginByPassword/:phone")
    .post(controller.loginByPassword)
router
    .route("/loginByCode/:phone")
    .post(controller.loginByCode)
router
    .route("/getMe")
    .get(authMiddleware, controller.getme)
router
    .route("/setNewAccessToken")
    .get(controller.getAccessToken)
router
    .route("/resendCode/:phone")
    .post(controller.resendCode)

module.exports = router