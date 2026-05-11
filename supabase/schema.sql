create extension if not exists pgcrypto;

create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  response_text text,
  used_model text not null check (used_model in ('gemini', 'claude')),
  status text not null check (status in ('success', 'fallback_success', 'failed', 'db_write_failed')),
  force_error boolean not null default false,
  error_message text,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  execution_time_ms integer not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_request_logs_created_at_idx
  on public.ai_request_logs (created_at desc);

alter table public.ai_request_logs enable row level security;

create policy "Service role can manage request logs"
  on public.ai_request_logs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
