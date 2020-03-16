const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

function generateSwaggerSpec() {
  const swaggerDefinition = {
    openapi: '3.0.0',
    components: {},
    info: {
      title: 'EMS REST API Documentation',
      version: '1.0.0',
      description: 'documentations of all REST endpoints used in https://emspaarcontrol.com',
    },
    host: 'localhost:3000',
    basePath: '/',
  };

  const options = {
    swaggerDefinition,
    apis: [path.resolve(__dirname, 'routes/v1/*.js')],
  };
  return swaggerJSDoc(options);
}

function docServer(app) {
  const spec = generateSwaggerSpec();
  app.get('/doc/swagger.json', function(req, res) {
    res.send(spec);
  });
  const swaggerUiOptions = {
    explorer: true,
    customSiteTitle: 'EMS Documentations',
    customCss: '.swagger-ui .topbar { display: none }',
  };
  app.use('/doc/explorer', swaggerUi.serve, swaggerUi.setup(spec, swaggerUiOptions));
}

module.exports = docServer;
