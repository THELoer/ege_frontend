Фронтенд сайта для подготовки к ЕГЭ.

## Запуск с локальным backend
1. Скопируйте `.env.example` в `.env`.
2. Убедитесь, что `VITE_API_URL` указывает на ваш backend (по умолчанию `http://localhost:8080/api`).
3. Запустите фронтенд: `npm run dev`.

## Что реализовать в backend для текущей админ-панели
### 1) Эндпоинт
- `POST /api/admin/tasks` — `multipart/form-data`:
  - `number`, `type`, `contentOrder`,
  - опционально `condition`, `answer`, `solution`,
  - опционально файлы `taskImage`, `answerImage`, `solutionImage`.

### 2) Минимальная схема БД
- `tasks`
  - `id` (uuid/pk), `number` (smallint), `type` (varchar), `condition_text` (text, nullable),
  - `task_image_path` (text, nullable), `content_order` (varchar),
  - `answer_text` (text, nullable), `answer_image_path` (text, nullable),
  - `solution_text` (text, nullable), `solution_image_path` (text, nullable),
  - `created_by` (fk users), `created_at`, `updated_at`.

### 3) Хранение файлов
- Сохраняйте картинки в локальное хранилище (`uploads/tasks/...`) или S3/MinIO.
- В БД храните **только путь/ключ**, не бинарные данные.
- Отдавайте публичный URL через backend (например `/media/...`).

### 4) Валидация
- Задача: обязательно хотя бы одно из `condition` или `taskImage`.
- Ответ: обязательно хотя бы одно из `answer` или `answerImage`.
- `number` только 1..12, `type` — непустая строка под выбранную подкатегорию.
