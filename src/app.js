const express = require('express');
const healthRouter = require('./routes/health');
const { routeNotFound, errorHandler } = require('./errors');

const app = express();

app.use(express.json());
app.use('/health', healthRouter);

app.use(routeNotFound);
app.use(errorHandler);

module.exports = app;