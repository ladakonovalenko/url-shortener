class ApiError extends Error {
  constructor(status, error, message) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

const notFound = (code) =>
  new ApiError(404, 'NOT_FOUND', `Link '${code}' not found`);

const validationError = (message) =>
  new ApiError(400, 'VALIDATION_ERROR', message);

// 405 для методів, яких немає в специфікації; Allow — дозволені методи
const methodNotAllowed = (allow) => (req, res) => {
  res.status(405).set('Allow', allow).json({
    error: 'METHOD_NOT_ALLOWED',
    message: `Method ${req.method} is not allowed`,
  });
};

// 404 для шляхів, яких немає в специфікації
function routeNotFound(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: `Route ${req.path} not found` });
}

// Middleware для помилок: 4 параметри, реєструється останнім
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.error, message: err.message });
  }

  // Синтаксична помилка JSON у тілі запиту (від express.json())
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON' });
  }

  console.error(err);
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal server error' });
}

module.exports = { ApiError, notFound, validationError, methodNotAllowed, routeNotFound, errorHandler };
