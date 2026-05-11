import { NextResponse } from 'next/server';
import { validatePrompt } from '@/lib/validation';
import type { AskPayload, AskResponse, HistoryItem } from '@/lib/types';

const mockHistory = globalThis as typeof globalThis & {
  __smartAiFailoverHistory?: HistoryItem[];
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as AskPayload | null;
  if (!payload) {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const validationError = validatePrompt(payload.text ?? '');
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (process.env.E2E_MOCK_API === 'true') {
    return NextResponse.json(mockAskResponse(payload));
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'N8N_WEBHOOK_URL is not configured.' }, { status: 500 });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text: payload.text.trim(),
      force_error: Boolean(payload.force_error),
      gemini_model: payload.gemini_model || undefined,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(
      { error: data.error ?? 'Both AI providers are currently unavailable.' },
      { status: response.status },
    );
  }

  return NextResponse.json(data as AskResponse);
}

function mockAskResponse(payload: AskPayload): AskResponse {
  const result: AskResponse = {
    answer: payload.force_error
      ? 'Mock Claude fallback response.'
      : 'Mock Gemini primary response.',
    usedModel: payload.force_error ? 'claude' : 'gemini',
    status: payload.force_error ? 'fallback_success' : 'success',
    executionTimeMs: payload.force_error ? 2100 : 1200,
  };

  const item: HistoryItem = {
    id: crypto.randomUUID(),
    inputText: payload.text.trim(),
    responseText: result.answer,
    usedModel: result.usedModel,
    status: result.status,
    forceError: Boolean(payload.force_error),
    errorMessage: payload.force_error ? 'Forced Gemini failure for debug failover.' : '',
    executionTimeMs: result.executionTimeMs,
    createdAt: new Date().toISOString(),
  };

  mockHistory.__smartAiFailoverHistory = [
    item,
    ...(mockHistory.__smartAiFailoverHistory ?? []),
  ].slice(0, 5);

  return result;
}
