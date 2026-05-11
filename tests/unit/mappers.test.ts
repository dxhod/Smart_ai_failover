import { describe, expect, it } from 'vitest';
import { mapHistoryRow, modelLabel } from '@/lib/mappers';

describe('mappers', () => {
  it('maps Supabase history rows to UI history items', () => {
    expect(
      mapHistoryRow({
        id: '1',
        input_text: 'hello',
        response_text: 'world',
        used_model: 'claude',
        status: 'fallback_success',
        force_error: true,
        execution_time_ms: 1200,
        created_at: '2026-05-11T00:00:00.000Z',
      }),
    ).toEqual({
      id: '1',
      inputText: 'hello',
      responseText: 'world',
      usedModel: 'claude',
      status: 'fallback_success',
      forceError: true,
      executionTimeMs: 1200,
      createdAt: '2026-05-11T00:00:00.000Z',
    });
  });

  it('formats provider labels', () => {
    expect(modelLabel('gemini')).toBe('Gemini');
    expect(modelLabel('claude')).toBe('Claude');
  });
});
