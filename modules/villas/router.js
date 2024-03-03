const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')

router
    .route("/add")
    .post(authMiddleware, isAdminMiddleware, multerPhotoMiddleware("cover", 5), controller.add)
router
    .route("/getAll")
    .get(controller.getAll)
// router
//     .route("/get/:email")
//     .get(authMiddleware, isAdminMiddleware, controller.getOne)
// router
//     .route("/delete/:email")
//     .delete(authMiddleware, isAdminMiddleware, controller.delete)
// router
//     .route("/setAvatar")
//     .post(authMiddleware, multerPhotoMiddleware.single("Avatar"), controller.setAvatar)
// router
//     .route("/update/:email")
//     .post(authMiddleware, controller.update)


module.exports = router