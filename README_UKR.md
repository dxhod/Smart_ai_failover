# Smart AI Failover

MVP веб-інструмент для відмовостійкої обробки AI-запитів. Gemini використовується як основний провайдер. Claude використовується, якщо Gemini недоступний або увімкнено debug failover.

## Стек

- Next.js App Router
- Tailwind CSS
- n8n workflow
- Supabase для логування запитів
- Vitest unit-тести
- Playwright E2E-тести

## Перший запуск

Склонуйте репозиторій і встановіть залежності:

```powershell
git clone https://github.com/dxhod/Smart_ai_failover.git
cd Smart_ai_failover
npm install
copy .env.example .env
```

Заповніть `.env`:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/smart-ai-failover
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_FALLBACK_MODEL=gemini-2.5-flash
ANTHROPIC_MODEL=claude-sonnet-4-5
ANTHROPIC_FALLBACK_MODEL=claude-haiku-4-5
```

Створіть таблицю в Supabase:

1. Створіть або відкрийте Supabase-проєкт на https://supabase.com/.
2. Відкрийте SQL Editor.
3. Виконайте SQL з файлу `supabase/schema.sql`.
4. Скопіюйте URL проєкту в `SUPABASE_URL`.
5. Скопіюйте service role key в `SUPABASE_SERVICE_ROLE_KEY`.

Щоб знайти `SUPABASE_SERVICE_ROLE_KEY`, відкрийте Supabase Project Settings, перейдіть у розділ API і скопіюйте ключ `service_role` з блоку Project API keys. Зберігайте цей ключ тільки на серверній стороні; не використовуйте його в браузерному коді.

Запустіть n8n:

```powershell
docker compose up -d n8n
```

Імпортуйте workflow:

1. Відкрийте `http://localhost:5678`.
2. Створіть локальний owner account, якщо n8n попросить це зробити.
3. Імпортуйте `n8n/workflows/smart-ai-failover.json`.
4. Активуйте імпортований workflow.

Production webhook URL має бути:

```text
http://localhost:5678/webhook/smart-ai-failover
```

## Розробка

```bash
npm run dev
```

Відкрийте `http://localhost:3000`.

## Docker

```bash
docker compose up --build
```

Docker Compose запускає веб-додаток і runtime-сервіс n8n однією командою. Перший setup Supabase schema та імпорт/активація n8n workflow виконуються вручну.

Це запускає:

- Next.js веб-додаток на `http://localhost:3000`
- n8n на `http://localhost:5678`

Supabase очікується як hosted-сервіс і налаштовується через `.env`.

Якщо Docker використовується тільки для n8n, а веб-додаток запускається локально для розробки:

```bash
docker compose up -d n8n
npm run dev
```

## Тести

```bash
npm run test
npm run test:e2e
```

Playwright використовує `E2E_MOCK_API=true`, тому E2E-тести не витрачають ліміти Gemini або Claude.

## Acceptance scenarios

- Standard path: Gemini відповідає, UI показує badge Gemini, а запис з'являється в останніх 5 запитах.
- Fallback path: debug failover увімкнено, Gemini примусово падає, Claude відповідає, UI показує badge Claude.
- Gemini model fallback: n8n спочатку пробує `GEMINI_MODEL`, потім `GEMINI_FALLBACK_MODEL`.
- Claude model fallback: якщо Gemini недоступний, n8n спочатку пробує `ANTHROPIC_MODEL`, потім `ANTHROPIC_FALLBACK_MODEL`.
- Provider outage: якщо обидва провайдери недоступні, UI показує дружнє повідомлення про помилку сервісу.
- Database outage: якщо Supabase logging не спрацював після відповіді AI, користувач все одно отримує відповідь зі статусом `db_write_failed`.

## Demo checklist

1. Відкрийте `http://localhost:3000`.
2. Надішліть `Explain what AI failover means in two sentences.` з вимкненим debug failover.
3. Переконайтесь, що badge відповіді показує `Gemini`, а рядок історії має статус `success`.
4. Увімкніть `Debug failover` і надішліть той самий prompt.
5. Переконайтесь, що badge відповіді показує `Claude`, а рядок історії має статус `fallback_success`.
6. Відкрийте Supabase `ai_request_logs` і перевірте, що останні записи збережені.
7. Відкрийте n8n і покажіть workflow `Smart AI Failover`.

## Архітектурні нотатки

Браузер не викликає n8n напряму. Він викликає Next.js `/api/ask`, який проксіює запит у `N8N_WEBHOOK_URL`. Так webhook URL залишається на серверній стороні.

Історія завантажується через `/api/history`, який повертає останні 5 рядків із Supabase.

n8n workflow відповідає за failover-логіку. Він спочатку пробує `GEMINI_MODEL`, потім `GEMINI_FALLBACK_MODEL`, обробляє примусові або реальні помилки Gemini, викликає Claude як fallback-провайдера, пробує `ANTHROPIC_MODEL` перед `ANTHROPIC_FALLBACK_MODEL`, зберігає фінальну відповідь у Supabase і повертає веб-додатку тільки фінальну відповідь.
