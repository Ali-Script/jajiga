const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')

router
    .route("/ban/:email")
    .get(authMiddleware, isAdminMiddleware, controller.getAll)
router
    .route("/unban/:email")
    .get(authMiddleware, isAdminMiddleware, controller.getOne)
router
    .route("/getAll")
    .delete(authMiddleware, isAdminMiddleware, controller.delete)

module.exports = router