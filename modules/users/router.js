const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const addAvatarMiddleware = require('./../../middlewares/addAvatarMiddleware')

router
    .route("/getAll")
    .get(authMiddleware, controller.getAll)
router
    .route("/get/:phone")
    .get(authMiddleware, controller.getOne)
router
    .route("/remove/:phone")
    .delete(authMiddleware, controller.delete)
router
    .route("/setAvatar")
    .put(authMiddleware, addAvatarMiddleware.single("avatar"), controller.setAvatar)
router
    .route("/changeName")
    .put(authMiddleware, controller.changeName)
router
    .route("/promotion/:email")
    .put(authMiddleware, isAdminMiddleware, controller.promotion)
router
    .route("/demotion/:email")
    .put(authMiddleware, isAdminMiddleware, controller.demotion)
router
    .route("/forgetPassword")
    .post(controller.forgetPassword)
router
    .route("/forgetPasswordCode")
    .post(controller.forgetPasswordCode)


module.exports = router