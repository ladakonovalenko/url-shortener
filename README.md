# URL Shortener — лабораторна робота № 6

Сервіс скорочення посилань на Express.js 5 + PostgreSQL у Docker.
API описане у файлі `openapi.yaml` (OpenAPI 3.1, підхід design-first).

## Вимоги

- Docker Desktop (Docker Engine + Docker Compose v2)
- Git

## Запуск з нуля

```bash
git clone https://github.com/ladakonovalenko/url-shortener.git
cd url-shortener
cp .env.sample .env        # заповніть значення (приклад нижче)
docker compose up --build
```

Приклад `.env`:

```
PORT=8080
BASE_URL=http://localhost:8080
DB_HOST=db
DB_PORT=5432
DB_NAME=shortener
DB_USER=shortener
DB_PASSWORD=ваш_пароль
```

Після запуску:

| Адреса | Що там |
|---|---|
| http://localhost:8080/docs | Swagger UI (документація та тестування API) |
| http://localhost:8080/health | Перевірка стану сервера і бази |
| http://localhost:8080/api/links | API коротких посилань |
| http://localhost:8080/{code} | Перехід за коротким посиланням |

## Зупинка

```bash
docker compose down            # дані зберігаються в томі pgdata
docker compose down --volumes  # видалити також усі дані
```

## Перевірка специфікації

```bash
npx @redocly/cli lint openapi.yaml
```

## Структура

```
openapi.yaml          специфікація API (єдине джерело правди)
compose.yaml          сервіси app і db
Dockerfile            образ сервера
db/init.sql           створення таблиці links
src/server.js         запуск сервера
src/app.js            застосунок Express, порядок middleware
src/config.js         змінні середовища
src/db.js             підключення pg-promise
src/links.js          SQL-запити до таблиці links
src/code.js           генерація короткого коду
src/validation.js     перевірка тіла запитів
src/errors.js         ApiError і middleware для помилок
src/docs.js           Swagger UI з openapi.yaml
src/routes/           маршрути: health, links, redirect
test.txt              команди curl зі Swagger UI
```
