import type { HistoryItem, SupabaseHistoryRow } from './types';

export function mapHistoryRow(row: SupabaseHistoryRow): HistoryItem {
  return {
    id: row.id,
    inputText: row.input_text,
    responseText: row.response_text ?? '',
    usedModel: row.used_model,
    status: row.status,
    forceError: row.force_error,
    errorMessage: row.error_message ?? '',
    executionTimeMs: row.execution_time_ms,
    createdAt: row.created_at,
  };
}

export function modelLabel(model: string): string {
  return model === 'claude' ? 'Claude' : 'Gemini';
}
