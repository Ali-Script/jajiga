const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')

router
    .route("/:email")
    .post(authMiddleware, isAdminMiddleware, controller.ban)
router
    .route("/unban/:email")
    .delete(authMiddleware, isAdminMiddleware, controller.unban)
router
    .route("/getAll")
    .get(authMiddleware, isAdminMiddleware, controller.getAll)

module.exports = router