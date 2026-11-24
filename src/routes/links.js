const express = require('express');
const links = require('../links');
const { generateCode } = require('../code');
const { parseCreate, parseUpdate } = require('../validation');
const { ApiError, notFound, methodNotAllowed } = require('../errors');

const router = express.Router();
const MAX_ATTEMPTS = 5;

// POST /api/links — створити посилання
async function createLink(req, res) {
  const { url, alias } = parseCreate(req.body);

  let row;
  if (alias) {
    row = await links.insert(alias, url);
    if (!row) {
      throw new ApiError(409, 'ALIAS_TAKEN', `Alias '${alias}' is already taken`);
    }
  } else {
    // Згенерований код може збігтися з існуючим — пробуємо ще раз
    for (let attempt = 0; attempt < MAX_ATTEMPTS && !row; attempt++) {
      row = await links.insert(generateCode(), url);
    }
    if (!row) {
      throw new Error('Could not generate a unique code');
    }
  }

  res.status(201).location(`/api/links/${row.code}`).json(links.toLink(row));
}

// GET /api/links — перелік усіх посилань
async function listLinks(req, res) {
  const rows = await links.findAll();
  res.json(rows.map(links.toLink));
}

// GET /api/links/:code — одне посилання
async function getLink(req, res) {
  const row = await links.findByCode(req.params.code);
  if (!row) throw notFound(req.params.code);
  res.json(links.toLink(row));
}

// PATCH /api/links/:code — змінити оригінальну адресу
async function updateLink(req, res) {
  const { url } = parseUpdate(req.body);
  const row = await links.updateUrl(req.params.code, url);
  if (!row) throw notFound(req.params.code);
  res.json(links.toLink(row));
}

// DELETE /api/links/:code — видалити посилання
async function deleteLink(req, res) {
  const deleted = await links.remove(req.params.code);
  if (deleted === 0) throw notFound(req.params.code);
  res.sendStatus(204);
}

router.route('/')
  .get(listLinks)
  .post(createLink)
  .all(methodNotAllowed('GET, POST'));

router.route('/:code')
  .get(getLink)
  .patch(updateLink)
  .delete(deleteLink)
  .all(methodNotAllowed('GET, PATCH, DELETE'));

module.exports = router;
