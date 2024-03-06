const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')

router
    .route("/getAll")
    .get(authMiddleware, isAdminMiddleware, controller.getAll)
router
    .route("/get/:email")
    .get(authMiddleware, isAdminMiddleware, controller.getOne)
router
    .route("/delete/:email")
    .delete(authMiddleware, isAdminMiddleware, controller.delete)
router
    .route("/setAvatar")
    .post(authMiddleware, multerPhotoMiddleware.single("Avatar"), controller.setAvatar)
router
    .route("/update/")
    .post(authMiddleware, controller.update)
router
    .route("/update/")
    .post(authMiddleware, controller.update)
router
    .route("/promotion/:email")
    .post(authMiddleware, isAdminMiddleware, controller.promotion)


module.exports = router