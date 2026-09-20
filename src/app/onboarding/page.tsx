'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getUserProfile, saveUserProfile } from '@/lib/gamification';
import { fetchRemoteUserProfile } from '@/lib/supabaseSync';
import { CheckCircle, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState(() => {
    if (typeof window === 'undefined') return '';
    const p = getUserProfile();
    return p?.name && p.name !== 'কুরআন শিক্ষার্থী' ? p.name : '';
  });
  const [email, setEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    const p = getUserProfile();
    return p?.email && p.email !== 'learner@example.com' ? p.email : '';
  });
  const [readingLevel, setReadingLevel] = useState<'fluent_decoding' | 'intermediate' | 'beginner'>(() => {
    if (typeof window === 'undefined') return 'fluent_decoding';
    return getUserProfile()?.arabicReadingLevel || 'fluent_decoding';
  });
  const [dailyTarget, setDailyTarget] = useState<number>(() => {
    if (typeof window === 'undefined') return 30;
    return getUserProfile()?.dailyTargetMinutes || 30;
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Supabase Google user state
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    // Fetch authenticated Supabase user
    async function loadAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setSupabaseUser(user);
            const gName = user.user_metadata?.full_name || user.user_metadata?.name || '';
            const gEmail = user.email || '';
            const gAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

            if (gName) setName(gName);
            if (gEmail) setEmail(gEmail);
            if (gAvatar) setAvatarUrl(gAvatar);

            // Fetch remote Supabase profile to sync
            const remote = await fetchRemoteUserProfile(user.id);
            if (remote) {
              if (remote.name) setName(remote.name);
              if (remote.arabicReadingLevel) setReadingLevel(remote.arabicReadingLevel);
              if (remote.dailyTargetMinutes) setDailyTarget(remote.dailyTargetMinutes);
            }
          }
        } catch (err) {
          console.error('[Onboarding] Error checking session:', err);
        }
      }
    }
    loadAuth();

    // 3. Subscribe to auth state changes
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user ?? null;
        setSupabaseUser(u);
        if (u) {
          const gName = u.user_metadata?.full_name || u.user_metadata?.name || '';
          const gEmail = u.email || '';
          const gAvatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || '';

          if (gName) setName(gName);
          if (gEmail) setEmail(gEmail);
          if (gAvatar) setAvatarUrl(gAvatar);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleGoogleSignup = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle('/onboarding');
      // If running without Supabase keys (local simulation fallback)
      if (!isSupabaseConfigured) {
        setName('সাদিকুর রহমান');
        setEmail('sadiq@example.com');
      }
    } catch (err) {
      console.error('[Onboarding] Google signin error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutUser();
      setSupabaseUser(null);
      setAvatarUrl('');
      setName('');
      setEmail('');
    } catch (err) {
      console.error('[Onboarding] Signout error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || supabaseUser?.user_metadata?.full_name || 'কুরআন শিক্ষার্থী';
    const finalEmail = email.trim() || supabaseUser?.email || 'learner@example.com';

    // 1. Update local gamification profile
    const current = getUserProfile();
    const updated = {
      ...current,
      id: supabaseUser?.id || current.id,
      name: finalName,
      email: finalEmail,
      arabicReadingLevel: readingLevel,
      dailyTargetMinutes: dailyTarget,
    };
    saveUserProfile(updated);

    // 2. Persist to Supabase if connected
    if (isSupabaseConfigured && supabase && supabaseUser) {
      try {
        await supabase.from('profiles').upsert(
          {
            id: supabaseUser.id,
            name: finalName,
            email: finalEmail,
            arabic_reading_level: readingLevel,
            daily_target_minutes: dailyTarget,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch (err) {
        console.error('[Onboarding] Remote profile update notice:', err);
      }
    }

    setIsSaved(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-emerald-700 text-white rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl shadow-sm">
            ق
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            শিক্ষার্থী প্রোফাইল ও নিবন্ধন
          </h1>
          <p className="text-sm text-stone-600">
            আপনার নিজস্ব গতিতে কুরআনের আরবি শেখার যাত্রা নির্ধারণ করুন
          </p>
        </div>

        {/* Google Authentication Status / Action Card */}
        {supabaseUser ? (
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-xs object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
                    {(name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-stone-900 text-base truncate">
                      {name || supabaseUser.user_metadata?.full_name || 'কুরআন শিক্ষার্থী'}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Google অ্যাকাউন্ট সংযুক্ত
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 truncate mt-0.5">
                    {email || supabaseUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-xs text-stone-500 hover:text-rose-700 hover:bg-rose-50 border border-stone-200 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 disabled:opacity-50"
                title="Google অ্যাকাউন্ট থেকে সাইন-আউট করুন"
              >
                <LogOut className="w-3 h-3" />
                <span>{isSigningOut ? '...' : 'লগআউট'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-emerald-200/70 flex items-center gap-1.5 text-[13px] text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>আপনার গুগল অ্যাকাউন্টের সাথে প্রোফাইল ও অগ্রগতি সরাসরি সুপ্রাবেসে (Supabase) সংরক্ষিত হচ্ছে।</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSigningIn}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm border border-stone-300 shadow-xs flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isSigningIn ? 'সংযোগ স্থাপন করা হচ্ছে...' : 'গুগল (Google) অ্যাকাউন্ট দিয়ে সাইন-ইন করুন'}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[13px] text-stone-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>কোনো পাসওয়ার্ড মনে রাখার প্রয়োজন নেই • নিরাপদ ও সহজ</span>
            </div>
          </div>
        )}

        {/* Basic Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  আপনার নাম
                </label>
                {supabaseUser && (
                  <span className="text-[12px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Google থেকে প্রাপ্ত
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: সায়িদ আহমেদ"
                className="w-full p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none bg-stone-50/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  ইমেইল ঠিকানা
                </label>
                {supabaseUser && (
                  <span className="text-[12px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    যাচাইকৃত ইমেইল
                  </span>
                )}
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none bg-stone-50/50"
              />
            </div>

            {/* Arabic Reading Level Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                আরবি পড়ার বর্তমান অবস্থা (পূর্বশর্ত যাচাই)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                    readingLevel === 'fluent_decoding'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-2xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="readingLevel"
                    value="fluent_decoding"
                    checked={readingLevel === 'fluent_decoding'}
                    onChange={() => setReadingLevel('fluent_decoding')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold mb-1">হরকত দেখে পড়তে পারি ✓</span>
                  <span className="text-[13px] font-normal text-stone-500">
                    কুরআনের যেকোনো আয়াত শুদ্ধভাবে দেখে পড়তে পারি (কোর্সের উপযুক্ত)
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                    readingLevel === 'intermediate'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-2xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="readingLevel"
                    value="intermediate"
                    checked={readingLevel === 'intermediate'}
                    onChange={() => setReadingLevel('intermediate')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold mb-1">ধীরে ধীরে পড়তে পারি</span>
                  <span className="text-[13px] font-normal text-stone-500">
                    অক্ষর চিনি কিন্তু দ্রুত পড়তে একটু সময় লাগে
                  </span>
                </label>
              </div>
            </div>

            {/* Daily Commitment Target */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                দৈনিক অনুশীলনের লক্ষ্যমাত্রা
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { mins: 15, label: '১৫ মিনিট', note: 'হালকা গতি' },
                  { mins: 25, label: '২৫ মিনিট', note: 'একটি পূর্ণ পাঠ' },
                  { mins: 30, label: '৩০ মিনিট', note: 'প্রস্তাবিত পূর্ণ ছন্দ' },
                ].map((item) => (
                  <button
                    key={item.mins}
                    type="button"
                    onClick={() => setDailyTarget(item.mins)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      dailyTarget === item.mins
                        ? 'border-emerald-600 bg-emerald-700 text-white font-bold shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span
                      className={`text-[12px] block mt-0.5 ${
                        dailyTarget === item.mins ? 'text-emerald-200' : 'text-stone-500'
                      }`}
                    >
                      {item.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-300 animate-pulse" />
                <span>সংরক্ষণ সম্পন্ন হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>{supabaseUser ? 'প্রোফাইল নিশ্চিত করুন ও ড্যাশবোর্ডে প্রবেশ করুন' : 'প্রোফাইল সংরক্ষণ ও ড্যাশবোর্ডে প্রবেশ করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
