import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  const hasUrl = Boolean(url && !url.includes('your-project'));
  const hasKey = Boolean(key && !key.includes('your-anon-key'));

  if (!hasUrl || !hasKey) {
    return NextResponse.json(
      {
        connected: false,
        status: 'DISCONNECTED',
        error: 'Environment variables missing in Vercel.',
        details: {
          hasSupabaseUrl: hasUrl,
          hasSupabaseAnonKey: hasKey,
          tip: 'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Project Settings -> Environment Variables.',
        },
      },
      { status: 200 }
    );
  }

  // Attempt live connection ping
  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from('profiles').select('id').limit(1);

    return NextResponse.json({
      connected: true,
      status: 'CONNECTED',
      message: '✅ Vercel is successfully connected to Supabase!',
      details: {
        projectUrl: url.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co'),
        databaseResponding: !error || error.code === 'PGRST116' || !error.message.includes('FetchError'),
        dbResponseStatus: error ? error.message : 'OK',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({
      connected: false,
      status: 'CONNECTION_ERROR',
      message: 'Supabase URL/Key is present, but could not reach the server.',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
