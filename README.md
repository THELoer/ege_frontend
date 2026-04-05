# EGE Frontend (React + Vite)

Фронтенд для подготовки к ЕГЭ по математике.

## 1) Быстрый старт фронтенда

1. Установить зависимости:
   ```bash
   npm install
   ```
2. Создать `.env` (или `.env.local`) и указать адрес API:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
3. Запустить dev-сервер:
   ```bash
   npm run dev
   ```
4. Сборка production:
   ```bash
   npm run build
   ```

---

## 2) Ключевое правило по изображениям

### Что должен вернуть backend
Во всех JSON-ответах, где есть изображения (`imageUrl`, `answerImageUrl`, `solutionImageUrl`), frontend ожидает **имя файла** (например `abc123.png`) или уже готовый путь вида `/images/abc123.png`.

### Как frontend будет запрашивать картинку
Если приходит имя файла, frontend автоматически обращается по URL:

```text
/images/{filename}
```

Пример:
- backend вернул: `"imageUrl": "task_1_42.png"`
- браузер запросит: `GET /images/task_1_42.png`

### Что нужно реализовать в backend для статики
- Эндпоинт/раздачу файлов по пути: `GET /images/{filename}`.
- Заголовки кэширования (желательно): `Cache-Control: public, max-age=31536000, immutable` для уникальных имен.
- Безопасность:
  - запрет `../` path traversal;
  - 404 для отсутствующих файлов;
  - корректный `Content-Type`.

---

## 3) Авторизация (что ожидает фронт)

- Фронт отправляет JWT в каждом запросе (кроме логина):
  ```http
  Authorization: Bearer <token>
  ```
- Если токен невалиден/просрочен — backend возвращает `401`.

---

## 4) Полный backend-контракт для текущего фронта

Ниже перечислены API, которые реально используются в коде фронтенда.

---

### 4.1 Auth

#### `POST /api/auth/login`
Вход пользователя.

**Request JSON**
```json
{
  "email": "student@example.com",
  "password": "secret"
}
```

**Response 200 JSON**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "u1",
    "email": "student@example.com",
    "name": "Иван",
    "role": "student"
  }
}
```

**Ошибки**
- `401` — неверный логин/пароль.

---

### 4.2 Диагностика

#### `GET /api/diagnostic/:number/start`
Старт диагностики для номера задания.

**Response 200 JSON**
```json
{
  "taskNumber": 1,
  "title": "Входная диагностика",
  "tasks": [
    {
      "id": "t1",
      "number": 1,
      "type": "trigonometric",
      "part": 1,
      "condition": "Решите уравнение...",
      "imageUrl": "diag_1.png",
      "contentOrder": "text-first"
    }
  ]
}
```

#### `POST /api/diagnostic/submit`
Отправка ответов диагностики.

**Request JSON**
```json
{
  "taskNumber": 1,
  "answers": [
    { "taskId": "t1", "answer": "2" },
    { "taskId": "t2", "answer": null }
  ],
  "partTwoReviews": [
    { "taskId": "t100", "selfScore": 1, "comment": "решил полностью" }
  ]
}
```

**Response 200 JSON**
```json
{
  "summary": {
    "trigonometric": 2,
    "logarithmic": 1,
    "exponential": 0,
    "rational": 1
  },
  "maxByType": 3,
  "weakTypes": ["exponential"],
  "partOne": { "scored": 4, "total": 12 },
  "partTwo": [
    {
      "taskId": "t100",
      "condition": "...",
      "solution": "...",
      "selfScore": 1
    }
  ]
}
```

---

### 4.3 Каталог задач (в т.ч. режим «Отработка ошибок»)

#### `GET /api/tasks/catalog`
Используется в каталоге задач и в режиме `practice-errors`.

**Query params**
- `number` (опц.) — номер задания 1..12
- `type` (опц.) — строковый subtype
- `page` (опц.) — номер страницы
- `pageSize` (опц.) — размер страницы

Пример:
```http
GET /api/tasks/catalog?number=1&type=planimetry_right_triangle&page=1&pageSize=20
```

**Response 200 JSON**
```json
{
  "items": [
    {
      "id": "uuid",
      "number": 1,
      "type": "planimetry_right_triangle",
      "condition": "...",
      "imageUrl": "task_1_001.png",
      "contentOrder": "text-first",
      "answer": "2",
      "answerImageUrl": "answer_1_001.png",
      "solution": "Подставим...",
      "solutionImageUrl": "solution_1_001.png",
      "createdAt": "2026-04-05T12:00:00.000Z"
    }
  ],
  "total": 124,
  "page": 1,
  "pageSize": 20
}
```

> Важно: для режима «Отработка ошибок» желательно, чтобы у задач были заполнены `answer` и/или `answerImageUrl`, а также `solution` и/или `solutionImageUrl`.

---

### 4.4 Обучение

#### `GET /api/tasks/:number/materials`
Материалы обучения по номеру задания.

**Response 200 JSON**
```json
[
  {
    "id": "m1",
    "number": 1,
    "title": "Краткая теория",
    "description": "Что нужно помнить",
    "content": "Формулы...",
    "imageUrl": "material_1.png"
  }
]
```

---

### 4.5 Шпаргалки

#### `GET /api/tasks/:number/cheatsheets`
Список шпаргалок для номера.

**Response 200 JSON**
```json
[
  {
    "id": "c1",
    "number": 1,
    "title": "Тригонометрия",
    "content": "sin^2x + cos^2x = 1",
    "imageUrl": "cheat_1.png"
  }
]
```

#### `POST /api/admin/cheatsheets`
Создание шпаргалки (админ).

**Content-Type**: `multipart/form-data`

**FormData fields**
- `number` (required, integer 1..12)
- `title` (required, string)
- `content` (optional, string)
- `image` (optional, file)

**Validation backend**
- `title` обязателен;
- хотя бы одно из `content` или `image` обязательно.

---

### 4.6 Админ: создание задач

#### `POST /api/admin/tasks`
Создание задачи вручную (админка фронта).

**Content-Type**: `multipart/form-data`

**FormData fields**
- `number` (required, integer 1..12)
- `type` (required, string)
- `contentOrder` (required, `text-first` | `image-first`)
- `condition` (optional, string)
- `answer` (optional, string)
- `solution` (optional, string)
- `taskImage` (optional, file)
- `answerImage` (optional, file)
- `solutionImage` (optional, file)

**Validation backend**
- задача: обязательно хотя бы одно из `condition` или `taskImage`;
- ответ: обязательно хотя бы одно из `answer` или `answerImage`;
- `number` только 1..12.

---

### 4.7 Профиль и статистика

#### `GET /api/stats/me`
Статистика пользователя для страницы профиля.

**Response 200 JSON**
```json
{
  "tasks": [
    { "taskNumber": 1, "correct": 16, "incorrect": 4 },
    { "taskNumber": 2, "correct": 7, "incorrect": 9 }
  ]
}
```

Если данных нет — можно вернуть пустой массив `tasks: []`.

---

## 5) Рекомендуемые HTTP-коды

- `200` / `201` — успешный ответ.
- `400` — ошибка валидации payload.
- `401` — неавторизован.
- `403` — недостаточно прав (например, не админ).
- `404` — сущность не найдена (в том числе `/images/{filename}`).
- `500` — внутренняя ошибка.

---

## 6) Минимальный чеклист backend для совместимости

1. Реализовать все маршруты из раздела 4.
2. Настроить JWT-проверку и роли (`student`/`admin`).
3. Реализовать загрузку файлов и хранение имен файлов в БД.
4. Реализовать выдачу статики через `GET /images/{filename}`.
5. В JSON возвращать поля изображений как filename (или уже `/images/...`).
6. Соблюдать валидации из разделов админки и шпаргалок.

---

## 7) Актуальность

Этот контракт синхронизирован с фронтендом на **2026-04-05**.
