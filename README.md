Фронтенд сайта для подготовки к ЕГЭ.

## Запуск с локальным backend
1. Скопируйте `.env.example` в `.env`.
2. Убедитесь, что `VITE_API_URL` указывает на ваш backend (по умолчанию `http://localhost:8080/api`).
3. Запустите фронтенд: `npm run dev`.

## Что реализовать в backend
### 1) Задачи (админ)
- `POST /api/admin/tasks` — `multipart/form-data`:
  - `number`, `type`, `contentOrder`,
  - опционально `condition`, `answer`, `solution`,
  - опционально файлы `taskImage`, `answerImage`, `solutionImage`.

- `GET /api/admin/tasks?number=1&type=planimetry_right_triangle&page=1&pageSize=10`
  - Ответ:
```json
{
  "items": [
    {
      "id": "uuid",
      "number": 1,
      "type": "planimetry_right_triangle",
      "condition": "...",
      "imageUrl": "https://...",
      "contentOrder": "text-first",
      "answer": "2",
      "answerImageUrl": "https://...",
      "solution": "...",
      "solutionImageUrl": "https://...",
      "createdAt": "2026-04-05T12:00:00.000Z"
    }
  ],
  "total": 124,
  "page": 1,
  "pageSize": 10
}
```

### 2) Материалы обучения (кнопка «К обучению»)
- `GET /api/tasks/:number/materials`
  - Массив материалов:
```json
[
  {
    "id": "m1",
    "number": 1,
    "title": "Теория",
    "description": "Коротко по теме",
    "content": "LaTeX/текст",
    "imageUrl": "https://..."
  }
]
```

### 3) Шпаргалки
- `POST /api/admin/cheatsheets` — `multipart/form-data`:
  - `number`, `title`, опционально `content`, опционально `image`.
- `GET /api/tasks/:number/cheatsheets`
  - Массив шпаргалок:
```json
[
  {
    "id": "c1",
    "number": 1,
    "title": "Формулы планиметрии",
    "content": "...",
    "imageUrl": "https://..."
  }
]
```

### 4) Статистика ученика (профиль)
- `GET /api/stats/me`
```json
{
  "tasks": [
    { "taskNumber": 1, "correct": 16, "incorrect": 4 },
    { "taskNumber": 2, "correct": 7, "incorrect": 9 }
  ]
}
```

### 5) Валидация
- Задача: обязательно хотя бы одно из `condition` или `taskImage`.
- Ответ: обязательно хотя бы одно из `answer` или `answerImage`.
- Шпаргалка: обязательно `title` и хотя бы одно из `content` или `image`.
- `number` только 1..12.
