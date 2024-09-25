const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')

router
    .route("/:phone")
    .post(authMiddleware, controller.ban)
router
    .route("/unban/:phone")
    .delete(authMiddleware, controller.unban)
router
    .route("/getAll")
    .get(authMiddleware, controller.getAll)

module.exports = router