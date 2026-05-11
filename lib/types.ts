export type ProviderModel = 'gemini' | 'claude';

export type AskPayload = {
  text: string;
  force_error: boolean;
  gemini_model?: string;
};

export type AskResponse = {
  answer: string;
  usedModel: ProviderModel;
  status: 'success' | 'fallback_success' | 'failed' | 'db_write_failed';
  executionTimeMs: number;
};

export type HistoryItem = {
  id: string;
  inputText: string;
  responseText: string;
  usedModel: ProviderModel;
  status: string;
  forceError: boolean;
  errorMessage: string;
  executionTimeMs: number;
  createdAt: string;
};

export type SupabaseHistoryRow = {
  id: string;
  input_text: string;
  response_text: string | null;
  used_model: ProviderModel;
  status: string;
  force_error: boolean;
  error_message: string | null;
  execution_time_ms: number;
  created_at: string;
};
