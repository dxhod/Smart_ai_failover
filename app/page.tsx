'use client';

import { useEffect, useState } from 'react';
import { AnswerPanel } from '@/components/AnswerPanel';
import { HistoryTable } from '@/components/HistoryTable';
import { PromptForm } from '@/components/PromptForm';
import type { AskPayload, AskResponse, HistoryItem } from '@/lib/types';

export default function Home() {
  const [result, setResult] = useState<AskResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory() {
    const response = await fetch('/api/history', { cache: 'no-store' });
    if (!response.ok) return;
    const data = (await response.json()) as { items: HistoryItem[] };
    setHistory(data.items);
  }

  async function submitPrompt(payload: AskPayload) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? 'Both AI providers are currently unavailable.');
      }
      setResult(data as AskResponse);
      await loadHistory();
    } catch (submitError) {
      setResult(null);
      setError(submitError instanceof Error ? submitError.message : 'Unexpected service error.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
      <header className="border-b border-line pb-5">
        <p className="text-sm font-semibold uppercase text-accent">MVP</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Smart AI Failover</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Gemini is used first. Claude answers when the primary provider fails or debug failover is enabled.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <PromptForm onSubmit={submitPrompt} loading={loading} />
        <AnswerPanel result={result} loading={loading} error={error} />
      </div>

      <HistoryTable items={history} />
    </main>
  );
}
