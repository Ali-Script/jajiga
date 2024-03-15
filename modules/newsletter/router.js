const express = require("express");
const router = express.Router();

const newsletterController = require('./controller')
const authMiddleware = require("./../../middlewares/authMiddleware");
const isAdmin = require("./../../middlewares/isAdminMiddleware");

router
    .route("/create")
    .post(newsletterController.create)
router
    .route("/getAll")
    .get(newsletterController.getAll)
// router
//     .route("/getAll")
//     .get(authMiddleware, isAdmin, newsletterController.getAll)
module.exports = router;