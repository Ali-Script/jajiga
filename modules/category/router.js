const express = require("express");
const router = express.Router()

const categoryController = require("./controller");
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");


router
    .route("/add")
    .post(authMiddleware, isAdmin, categoryController.setCategory)
// router
//     .route("/getOne/:id")
//     .get(categoryController.getOne)
router
    .route("/getAll")
    .get(categoryController.getAll)
router
    .route("/remove/:id")
    .delete(authMiddleware, isAdmin, categoryController.removeOne)

module.exports = router;