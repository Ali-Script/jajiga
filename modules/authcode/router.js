// !!!!! Deleted

const express = require('express');
const router = express.Router()

const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')


router
    .route("/get/:email")
    .get(authMiddleware, isAdminMiddleware, controller.getOne)
router
    .route("/getAll")
    .get(authMiddleware, isAdminMiddleware, controller.getAll)
router
    .route("/deleteAll")
    .delete(authMiddleware, isAdminMiddleware, controller.deleteAll)

module.exports = router