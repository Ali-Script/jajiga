const express = require('express');
const router = express.Router()
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");
const commentController = require('./controller')

router
    .route("/create")
    .post(authMiddleware, commentController.create)
router
    .route("/delete/:commentID")
    .delete(authMiddleware, isAdmin, commentController.remove)
router
    .route("/accept/:commentID")
    .put(authMiddleware, isAdmin, commentController.accept)
router
    .route("/reject/:commentID")
    .put(authMiddleware, isAdmin, commentController.reject)
router
    .route("/answer/:mainCommentID")
    .post(authMiddleware, commentController.answer)
router
    .route("/getAll")
    .get(authMiddleware, isAdmin, commentController.getAll)

module.exports = router