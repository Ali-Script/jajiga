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
    .delete(authMiddleware, commentController.remove)
router
    .route("/accept/:commentID")
    .put(authMiddleware, commentController.accept)
router
    .route("/reject/:commentID")
    .put(authMiddleware, commentController.reject)
router
    .route("/answer/:mainCommentID")
    .post(authMiddleware, commentController.answer)
router
    .route("/getAll")
    .get(commentController.getAll)

module.exports = router