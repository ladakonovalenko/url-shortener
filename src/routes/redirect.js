const express = require('express');
const { registerClick } = require('../links');
const { notFound, methodNotAllowed } = require('../errors');

const router = express.Router();

// GET /:code — перехід за коротким посиланням
router.route('/:code')
  .get(async (req, res) => {
    const row = await registerClick(req.params.code);
    if (!row) throw notFound(req.params.code);
    res.redirect(302, row.url);
  })
  .all(methodNotAllowed('GET'));

module.exports = router;
