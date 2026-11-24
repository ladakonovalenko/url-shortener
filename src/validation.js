const { validationError } = require('./errors');

const CODE_PATTERN = /^[A-Za-z0-9_-]{3,32}$/;
const RESERVED = ['api', 'docs', 'health'];
const MAX_URL_LENGTH = 2048;

function checkBody(body, allowed) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw validationError('Request body must be a JSON object');
  }
  const extra = Object.keys(body).filter((key) => !allowed.includes(key));
  if (extra.length > 0) {
    throw validationError(`Unknown field(s): ${extra.join(', ')}`);
  }
}

function checkUrl(value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw validationError("Field 'url' is required and must be a string");
  }
  if (value.length > MAX_URL_LENGTH) {
    throw validationError(`Field 'url' must not exceed ${MAX_URL_LENGTH} characters`);
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw validationError("Field 'url' must be an absolute http or https URL");
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw validationError("Field 'url' must be an absolute http or https URL");
  }
  return parsed.href;
}

function checkAlias(value) {
  if (typeof value !== 'string' || !CODE_PATTERN.test(value)) {
    throw validationError("Field 'alias' must be 3-32 characters: A-Z, a-z, 0-9, '_' or '-'");
  }
  if (RESERVED.includes(value.toLowerCase())) {
    throw validationError(`Alias '${value}' is reserved`);
  }
  return value;
}

function parseCreate(body) {
  checkBody(body, ['url', 'alias']);
  return {
    url: checkUrl(body.url),
    alias: body.alias === undefined ? undefined : checkAlias(body.alias),
  };
}

function parseUpdate(body) {
  checkBody(body, ['url']);
  return { url: checkUrl(body.url) };
}

module.exports = { parseCreate, parseUpdate };
