const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')

router
    .route("/:Identifeir")
    .post(authMiddleware, isAdminMiddleware, controller.ban)
router
    .route("/unban/:Identifeir")
    .delete(authMiddleware, isAdminMiddleware, controller.unban)
router
    .route("/getAll")
    .get(authMiddleware, isAdminMiddleware, controller.getAll)

module.exports = router