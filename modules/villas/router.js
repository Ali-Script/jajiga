const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')

router
    .route("/add")
    .post(authMiddleware, isAdminMiddleware, multerPhotoMiddleware.array("cover", 5), controller.add)
router
    .route("/getAll")
    .get(controller.getAll)
router
    .route("/get/:email")
    .get(authMiddleware, isAdminMiddleware, controller.getOne)
router
    .route("/myVillas")
    .get(authMiddleware, controller.myVillas)
router
    .route("/delete/:id")
    .delete(authMiddleware, isAdminMiddleware, controller.delete)

module.exports = router