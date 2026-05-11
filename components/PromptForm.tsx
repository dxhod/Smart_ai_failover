'use client';

import { FormEvent, useState } from 'react';
import { validatePrompt } from '@/lib/validation';

type Props = {
  onSubmit: (payload: { text: string; force_error: boolean }) => Promise<void>;
  loading: boolean;
};

export function PromptForm({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');
  const [forceError, setForceError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validatePrompt(text);
    setValidationError(error);
    if (error) return;

    await onSubmit({ text: text.trim(), force_error: forceError });
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white p-5">
      <label className="text-sm font-semibold" htmlFor="prompt">
        Prompt
      </label>
      <textarea
        id="prompt"
        className="mt-3 min-h-40 w-full resize-y border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
        value={text}
        maxLength={2000}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ask the AI service to summarize, transform, or reason about any text..."
      />
      {validationError ? <p className="mt-2 text-sm text-danger">{validationError}</p> : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={forceError}
            onChange={(event) => setForceError(event.target.checked)}
          />
          Debug failover
        </label>
        <button
          className="border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send request'}
        </button>
      </div>
    </form>
  );
}
