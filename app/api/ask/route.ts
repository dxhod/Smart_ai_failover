import { NextResponse } from 'next/server';
import { validatePrompt } from '@/lib/validation';
import type { AskPayload, AskResponse } from '@/lib/types';

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'N8N_WEBHOOK_URL is not configured.' }, { status: 500 });
  }

  const payload = (await request.json().catch(() => null)) as AskPayload | null;
  if (!payload) {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const validationError = validatePrompt(payload.text ?? '');
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text: payload.text.trim(),
      force_error: Boolean(payload.force_error),
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
