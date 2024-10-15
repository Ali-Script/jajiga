const express = require('express');
const swaggerDoc = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const swaggerOpt = {
    customCssUrl: 'custom-swagger.css'
}

router.use(express.static('./configs/apiDoc'));
router.use("/", swaggerUi.serve)
router.get("/", swaggerUi.setup(swaggerDoc, swaggerOpt))

module.exports = router;