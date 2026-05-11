import type { AskResponse } from '@/lib/types';
import { ModelBadge } from './ModelBadge';

type Props = {
  result: AskResponse | null;
  loading: boolean;
  error: string | null;
};

export function AnswerPanel({ result, loading, error }: Props) {
  if (loading) {
    return (
      <section className="min-h-64 border border-line bg-white p-5">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-line" />
        <div className="space-y-3">
          <div className="h-4 animate-pulse rounded bg-line" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-line" />
          <div className="h-4 w-8/12 animate-pulse rounded bg-line" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-64 border border-danger/30 bg-danger/5 p-5 text-danger">
        <h2 className="text-sm font-semibold">Service unavailable</h2>
        <p className="mt-3 text-sm">{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="min-h-64 border border-line bg-white p-5 text-sm text-neutral-500">
        Submit a prompt to test primary and fallback AI routing.
      </section>
    );
  }

  return (
    <section className="min-h-64 border border-line bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ModelBadge model={result.usedModel} />
        <span className="text-xs text-neutral-500">{result.status}</span>
        <span className="text-xs text-neutral-500">{result.executionTimeMs} ms</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6">{result.answer}</p>
    </section>
  );
}
