const pgp = require('pg-promise')();
const config = require('./config');

const db = pgp(config.db);

module.exports = db;
