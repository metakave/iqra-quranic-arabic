import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Initiates Google OAuth Sign-in using Supabase
 */
export async function signInWithGoogle(redirectTo: string = '/onboarding') {
  if (isSupabaseConfigured && supabase) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) throw error;
  } else {
    // Graceful local fallback for development/demo
    console.log('[Supabase] Running in local simulation mode.');
  }
}

/**
 * Signs out current authenticated user
 */
export async function signOutUser() {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
