const express = require('express');
const TransportadoraController = require('./controller/TransportadoraController');

const routes = express.Router();

routes.post('/gerar', TransportadoraController.geraCodigo);
routes.get('/healthcheck', (_, res) => res.json({ alive: true } ));


module.exports = routes;