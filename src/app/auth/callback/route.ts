import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/onboarding';

  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server component / Route handler cookie handling
            }
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user) {
        // Automatically ensure user profile is initialized in profiles table
        const u = data.user;
        const name = u.user_metadata?.full_name || u.user_metadata?.name || 'কুরআন শিক্ষার্থী';
        const email = u.email || '';

        try {
          await supabase.from('profiles').upsert(
            {
              id: u.id,
              name,
              email,
              arabic_reading_level: 'fluent_decoding',
              daily_target_minutes: 30,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        } catch (profileErr) {
          console.error('[Auth Callback] Profile upsert notice:', profileErr);
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('[Auth Callback] Exchange error:', error);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
