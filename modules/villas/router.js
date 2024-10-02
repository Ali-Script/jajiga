const express = require('express');
const router = express.Router()


const controller = require('./controller')
const authMiddleware = require('./../../middlewares/authMiddleware')
const isAdminMiddleware = require('./../../middlewares/isAdminMiddleware')
const multerPhotoMiddleware = require('./../../middlewares/multerPhotoMiddleware')

router
    .route("/add")
    .post(authMiddleware, multerPhotoMiddleware.array("cover", 10), controller.add)
router
    .route("/update/:villaID")
    .put(authMiddleware, multerPhotoMiddleware.array("cover", 10), controller.update)
router
    .route("/getAll")
    .get(controller.getAll)
router
    .route("/getAllActivated")
    .get(controller.getAllActivated)
router
    .route("/get/:villaID")
    .get(controller.getOne)
router
    .route("/myVillas")
    .get(authMiddleware, controller.myVillas)
router
    .route("/delete/:villaID")
    .delete(authMiddleware, controller.delete)
// ! admin mid
router
    .route("/facility")
    .get(controller.getFacility)
router
    .route("/s")
    .get(controller.filtring)
router
    .route("/privilegedVillas")
    .get(controller.privilegedVillas)
router
    .route("/popularTowns")
    .get(controller.popularTowns)
router
    .route("/quickSearchByZone")
    .get(controller.quickSearchByZone)
router
    .route("/accessVisit/:key/:villaID")
    .put(authMiddleware, isAdminMiddleware, controller.accessVisit)
router
    .route("/getAllBooks")
    .get(authMiddleware, isAdminMiddleware, controller.getAllBooks)
router
    .route("/getAllRejectedVillas")
    .get(authMiddleware, isAdminMiddleware, controller.getAllRejectedVillas)


module.exports = router