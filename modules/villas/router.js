const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')
router
    .route("/:id/facility")
    .get(authMiddleware, controller.getFacility)
router
    .route("/add")
    .post(authMiddleware, multerPhotoMiddleware.array("cover", 10), controller.add)
router
    .route("/update/:id")
    .put(authMiddleware, multerPhotoMiddleware.array("cover", 10), controller.update)
router
    .route("/getAll")
    .get(controller.getAll)
router
    .route("/get/:id")
    .get(authMiddleware, controller.getOne)
router
    .route("/myVillas")
    .get(authMiddleware, controller.myVillas)
router
    .route("/delete/:id")
    .delete(authMiddleware, controller.delete)
// ! admin mid

module.exports = router