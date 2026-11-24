require('dotenv').config({ quiet: true });

const config = {
  port: Number(process.env.PORT) || 8080,
  baseUrl: (process.env.BASE_URL || 'http://localhost:8080').replace(/\/+$/, ''),
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};

module.exports = config;
