# Smart AI Failover

MVP web tool for AI provider failover. Gemini is the primary model. Claude is used when Gemini fails or when debug failover is enabled.

## Stack

- Next.js App Router
- Tailwind CSS
- n8n workflow
- Supabase request logging
- Vitest unit tests
- Playwright E2E tests

## Setup

```bash
npm install
copy .env.example .env
```

Fill `.env`:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/smart-ai-failover
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
ANTHROPIC_MODEL=claude-sonnet-4-5
```

Run the Supabase SQL from `supabase/schema.sql`.

Import `n8n/workflows/smart-ai-failover.json` into n8n.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Docker

```bash
docker compose up --build
```

This starts:

- Next.js web app on `http://localhost:3000`
- n8n on `http://localhost:5678`

Supabase is expected to be hosted and configured through `.env`.

## Tests

```bash
npm run test
npm run test:e2e
```

## Acceptance scenarios

- Standard path: Gemini answers, the UI shows a Gemini badge, and a log record appears in the last 5 requests.
- Fallback path: debug failover is enabled, Gemini is forced to fail, Claude answers, and the UI shows a Claude badge.
- Provider outage: if both providers fail, the UI shows a friendly service error.
- Database outage: if Supabase logging fails after an AI response, the user still receives the response with `db_write_failed` status.

## Architecture notes

The browser does not call n8n directly. It calls Next.js `/api/ask`, which proxies the request to `N8N_WEBHOOK_URL`. This keeps the webhook URL server-side.

History is loaded through `/api/history`, which returns the latest 5 rows from Supabase.
