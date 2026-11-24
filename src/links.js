const db = require('./db');
const config = require('./config');

// Перетворює рядок таблиці на об'єкт Link зі специфікації
function toLink(row) {
  return {
    code: row.code,
    shortUrl: `${config.baseUrl}/${row.code}`,
    url: row.url,
    createdAt: row.created_at.toISOString(),
    clicks: row.clicks,
  };
}

// Повертає null, якщо код уже зайнятий
function insert(code, url) {
  return db.oneOrNone(
    `INSERT INTO links (code, url) VALUES ($1, $2)
     ON CONFLICT (code) DO NOTHING
     RETURNING *`,
    [code, url],
  );
}

function findAll() {
  return db.any('SELECT * FROM links ORDER BY created_at DESC');
}

function findByCode(code) {
  return db.oneOrNone('SELECT * FROM links WHERE code = $1', [code]);
}

function updateUrl(code, url) {
  return db.oneOrNone('UPDATE links SET url = $2 WHERE code = $1 RETURNING *', [code, url]);
}

function remove(code) {
  return db.result('DELETE FROM links WHERE code = $1', [code], (r) => r.rowCount);
}

// Атомарно збільшує лічильник і повертає оригінальну адресу
function registerClick(code) {
  return db.oneOrNone(
    'UPDATE links SET clicks = clicks + 1 WHERE code = $1 RETURNING url',
    [code],
  );
}

module.exports = { toLink, insert, findAll, findByCode, updateUrl, remove, registerClick };
