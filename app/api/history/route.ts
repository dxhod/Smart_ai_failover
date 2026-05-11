import { NextResponse } from 'next/server';
import { mapHistoryRow } from '@/lib/mappers';
import { createSupabaseAdmin } from '@/lib/supabase';
import type { SupabaseHistoryRow } from '@/lib/types';

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('ai_request_logs')
      .select('id,input_text,response_text,used_model,status,force_error,execution_time_ms,created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json({
      items: ((data ?? []) as SupabaseHistoryRow[]).map(mapHistoryRow),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not load history.' },
      { status: 500 },
    );
  }
}
