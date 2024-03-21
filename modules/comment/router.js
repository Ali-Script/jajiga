const express = require('express');
const router = express.Router()
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");
const commentController = require('./controller')

router
    .route("/create")
    .post(authMiddleware, commentController.create)
router
    .route("/remove/:id")
    .delete(authMiddleware, isAdmin, commentController.remove)
router
    .route("/accept/:id")
    .put(authMiddleware, isAdmin, commentController.accept)
router
    .route("/reject/:id")
    .put(authMiddleware, isAdmin, commentController.reject)
router
    .route("/answer/:id")
    .post(authMiddleware, commentController.answer)
router
    .route("/getAll")
    .get(authMiddleware, commentController.getAll)

module.exports = router