const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const { errorHandler } = require('./utilities');

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));

app.use(routes);

app.use(errorHandler);

module.exports = app;
