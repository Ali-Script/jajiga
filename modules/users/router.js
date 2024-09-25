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
    .route("/edit")
    .put(authMiddleware, addAvatarMiddleware.single("avatar"), controller.edit)
router
    .route("/changeRole/:key/:phone")
    .post(authMiddleware, controller.changeRole)
router
    .route("/changePassword")
    .put(authMiddleware, controller.changePassword)
router
    .route("/forgotPassword")
    .post(authMiddleware, controller.forgetPassword)
router
    .route("/forgotPasswordCode")
    .put(authMiddleware, controller.forgetPasswordConfirmCode)
router
    .route("/addEmail")
    .post(authMiddleware, controller.addEmail)
router
    .route("/authEmail")
    .put(authMiddleware, controller.authEmail)
router
    .route("/changeNumber")
    .post(authMiddleware, controller.changeNumber)
router
    .route("/authNumber")
    .put(authMiddleware, controller.authNumber)



module.exports = router