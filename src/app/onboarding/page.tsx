'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, isSupabaseConfigured } from '@/lib/supabase';
import { getUserProfile, saveUserProfile } from '@/lib/gamification';
import { CheckCircle, ArrowRight, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [readingLevel, setReadingLevel] = useState<'fluent_decoding' | 'intermediate' | 'beginner'>('fluent_decoding');
  const [dailyTarget, setDailyTarget] = useState<number>(30);
  const [goal, setGoal] = useState<string>('full_quran');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setReadingLevel(profile.arabicReadingLevel);
      setDailyTarget(profile.dailyTargetMinutes);
    }
  }, []);

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
      // If local fallback, pre-fill mock
      if (!isSupabaseConfigured) {
        setName('সাদিকুর রহমান');
        setEmail('sadiq@example.com');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = getUserProfile();
    const updated = {
      ...current,
      name: name.trim() || 'কুরআন শিক্ষার্থী',
      email: email.trim() || 'learner@example.com',
      arabicReadingLevel: readingLevel,
      dailyTargetMinutes: dailyTarget,
    };
    saveUserProfile(updated);
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

        {/* Google One-Click Signup */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm border border-stone-300 shadow-xs flex items-center justify-center gap-3 transition-colors"
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
            <span>গুগল (Google) অ্যাকাউন্ট দিয়ে সাইন-ইন করুন</span>
          </button>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>কোনো পাসওয়ার্ড মনে রাখার প্রয়োজন নেই • নিরাপদ ও সহজ</span>
          </div>
        </div>

        {/* Basic Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                আপনার নাম
              </label>
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
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                ইমেইল ঠিকানা
              </label>
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
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
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
                  <span className="text-[11px] font-normal text-stone-500">
                    কুরআনের যেকোনো আয়াত শুদ্ধভাবে দেখে পড়তে পারি (কোর্সের উপযুক্ত)
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                    readingLevel === 'intermediate'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
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
                  <span className="text-[11px] font-normal text-stone-500">
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
                        ? 'border-emerald-600 bg-emerald-700 text-white font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-800'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span
                      className={`text-[10px] block mt-0.5 ${
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
                <span>সংরক্ষণ সম্পন্ন হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>প্রোফাইল নিশ্চিত করুন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
