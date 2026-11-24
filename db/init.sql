-- Скрипт ініціалізації бази даних.
-- Виконується образом postgres лише один раз: під час першого запуску,
-- коли том із даними (pgdata) ще порожній.

CREATE TABLE links (
    code        VARCHAR(32)  PRIMARY KEY
                CHECK (code ~ '^[A-Za-z0-9_-]{3,32}$'),
    url         TEXT         NOT NULL
                CHECK (char_length(url) <= 2048),
    clicks      INTEGER      NOT NULL DEFAULT 0
                CHECK (clicks >= 0),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
