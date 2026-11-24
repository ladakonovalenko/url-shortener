const app = require('./app');
const db = require('./db');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`);
  console.log(`Swagger UI: ${config.baseUrl}/docs`);
});

// Перевірка підключення до бази під час запуску (сервер працює і без неї)
db.connect()
  .then((connection) => {
    console.log(`Connected to PostgreSQL ${connection.client.serverVersion}`);
    connection.done();
  })
  .catch((err) => {
    console.error(`Cannot connect to PostgreSQL: ${err.message}`);
  });
