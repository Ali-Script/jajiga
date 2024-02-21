const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')

router
    .route("/getAll")
    .get(authMiddleware, isAdminMiddleware, controller.getAll)
router
    .route("/getOne/:email")
    .get(authMiddleware, isAdminMiddleware, controller.getOne)
router
    .route("/delete/:email")
    .delete(authMiddleware, isAdminMiddleware, controller.delete)
router
    .route("/setAvatar/:email")
    .post(authMiddleware, controller.setAvatar)
router
    .route("/update/:email")
    .post(authMiddleware, controller.update)

module.exports = router