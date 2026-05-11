# n8n workflow

Import `workflows/smart-ai-failover.json` into n8n.

The workflow expects these environment variables:

- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_MODEL`
- `ANTHROPIC_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Webhook path:

```text
POST /webhook/smart-ai-failover
```

Request body:

```json
{
  "text": "Explain what failover means",
  "force_error": false
}
```

Response body:

```json
{
  "answer": "...",
  "usedModel": "gemini",
  "status": "success",
  "executionTimeMs": 1000
}
```
