const jsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerFunc = (app) => {
    const options = jsdoc({
        failOnErrors: true,
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Jajiga-APIs',
                version: '1.0.1',
            },
            servers: [{ url: 'https://localhost:4001' }]
        },
        apis: ['./app.js'],
    });
    var costumCss = {
        customCssUrl: './swaggerStyles.css'
    };
    const swagger = swaggerUi.setup(options, costumCss)
    app.use("/Api-Doc", swaggerUi.serve, swagger)
}

module.exports = swaggerFunc;
