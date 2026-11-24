const express = require('express');
const docs = require('./docs');
const healthRouter = require('./routes/health');
const linksRouter = require('./routes/links');
const redirectRouter = require('./routes/redirect');
const { routeNotFound, errorHandler } = require('./errors');

const app = express();

// 1. Розбір тіла запиту
app.use(express.json());

// 2. Документація і маршрути
app.use('/docs', docs);
app.use('/health', healthRouter);
app.use('/api/links', linksRouter);
// Перехід за коротким кодом — останнім, щоб не перехоплювати інші шляхи
app.use('/', redirectRouter);

// 3. В кінці: 404 і middleware для помилок
app.use(routeNotFound);
app.use(errorHandler);

module.exports = app;
