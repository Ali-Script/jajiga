const express = require('express');
const router = express.Router()

const controller = require('./controller')

router
    .route("/auth")
    .post(controller.auth)
router
    .route("/login")
    .get(controller.login)
router
    .route("/getme")
    .get(controller.getme)

module.exports = router