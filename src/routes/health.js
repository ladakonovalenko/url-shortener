const express = require('express');
const db = require('../db');
const { methodNotAllowed } = require('../errors');

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      await db.one('SELECT 1');
      res.json({ status: 'ok', database: 'up' });
    } catch {
      res.status(503).json({ error: 'DATABASE_UNAVAILABLE', message: 'Database is not available' });
    }
  })
  .all(methodNotAllowed('GET'));

module.exports = router;
