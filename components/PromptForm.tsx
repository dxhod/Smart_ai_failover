'use client';

import { FormEvent, useState } from 'react';
import { validatePrompt } from '@/lib/validation';
import type { AskPayload } from '@/lib/types';

type Props = {
  onSubmit: (payload: AskPayload) => Promise<void>;
  loading: boolean;
};

const geminiModels = [
  { label: 'Env default', value: '' },
  { label: 'Gemini 3.1 Flash Lite', value: 'gemini-3.1-flash-lite' },
  { label: 'Gemini 3 Flash', value: 'gemini-3-flash' },
  { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  { label: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
];

const quickPrompts = [
  'Explain what AI failover means in two sentences.',
  'Summarize why provider redundancy matters.',
  'Write a short incident update about an AI provider outage.',
];

export function PromptForm({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');
  const [forceError, setForceError] = useState(false);
  const [geminiModel, setGeminiModel] = useState('gemini-3.1-flash-lite');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validatePrompt(text);
    setValidationError(error);
    if (error) return;

    await onSubmit({
      text: text.trim(),
      force_error: forceError,
      gemini_model: geminiModel || undefined,
    });
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
      <div className="mt-3 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            className="border border-line bg-panel px-3 py-1 text-xs text-neutral-700 hover:border-accent"
            type="button"
            onClick={() => setText(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      {validationError ? <p className="mt-2 text-sm text-danger">{validationError}</p> : null}

      <label className="mt-4 block text-sm font-semibold" htmlFor="gemini-model">
        Gemini model
      </label>
      <select
        id="gemini-model"
        className="mt-2 w-full border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-accent"
        value={geminiModel}
        onChange={(event) => setGeminiModel(event.target.value)}
      >
        {geminiModels.map((model) => (
          <option key={model.value || 'default'} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>

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
