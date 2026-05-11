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
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_FALLBACK_MODEL=gemini-2.5-flash
ANTHROPIC_MODEL=claude-sonnet-4-5
```

Run the Supabase SQL from `supabase/schema.sql`.

Import `n8n/workflows/smart-ai-failover.json` into n8n.

Activate the imported workflow. The production webhook URL must be:

```text
http://localhost:5678/webhook/smart-ai-failover
```

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

If Docker is used for n8n and local development is used for the web app, run:

```bash
docker compose up -d n8n
npm run dev
```

## Tests

```bash
npm run test
npm run test:e2e
```

Playwright uses `E2E_MOCK_API=true`, so E2E tests do not spend Gemini or Claude API quota.

## Acceptance scenarios

- Standard path: Gemini answers, the UI shows a Gemini badge, and a log record appears in the last 5 requests.
- Fallback path: debug failover is enabled, Gemini is forced to fail, Claude answers, and the UI shows a Claude badge.
- Gemini model fallback: n8n tries `GEMINI_MODEL` first, then `GEMINI_FALLBACK_MODEL`, then Claude.
- Provider outage: if both providers fail, the UI shows a friendly service error.
- Database outage: if Supabase logging fails after an AI response, the user still receives the response with `db_write_failed` status.

## Demo checklist

1. Open `http://localhost:3000`.
2. Send `Explain what AI failover means in two sentences.` with debug failover disabled.
3. Confirm that the answer badge is `Gemini` and the history row has `success`.
4. Enable `Debug failover` and send the same prompt.
5. Confirm that the answer badge is `Claude` and the history row has `fallback_success`.
6. Open Supabase `ai_request_logs` and confirm that the latest rows were persisted.
7. Open n8n and show the `Smart AI Failover` workflow.

## Architecture notes

The browser does not call n8n directly. It calls Next.js `/api/ask`, which proxies the request to `N8N_WEBHOOK_URL`. This keeps the webhook URL server-side.

History is loaded through `/api/history`, which returns the latest 5 rows from Supabase.

The n8n workflow owns the provider failover behavior. It attempts `GEMINI_MODEL` first, then `GEMINI_FALLBACK_MODEL`, catches forced or real Gemini failures, calls Claude as the provider fallback, persists the final answer to Supabase, and returns only the final answer to the web app.

## Video presentation outline

Record a short video covering:

1. Final product behavior in the browser.
2. Standard Gemini path.
3. Forced failover path through Claude.
4. Supabase log table with the latest requests.
5. n8n workflow structure.
6. Code structure and test commands.
