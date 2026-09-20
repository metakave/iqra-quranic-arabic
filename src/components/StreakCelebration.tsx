'use client';

import React, { useEffect } from 'react';
import { Award, ArrowRight, Zap, Flame } from 'lucide-react';
import Link from 'next/link';

interface StreakCelebrationProps {
  isOpen: boolean;
  xpEarned: number;
  streakDays: number;
  onClose: () => void;
  nextLessonId?: string;
}

export default function StreakCelebration({
  isOpen,
  xpEarned,
  streakDays,
  onClose,
  nextLessonId,
}: StreakCelebrationProps) {
  useEffect(() => {
    if (isOpen) {
      import('canvas-confetti')
        .then((module) => {
          const confetti = module.default;
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#047857', '#10b981', '#f59e0b', '#fbbf24', '#3b82f6'],
          });
        })
        .catch(() => {
          // Safe fallback if canvas is unavailable
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-stone-200 space-y-5">
        <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg animate-bounce">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
            মাশাআল্লাহ! পাঠ সম্পন্ন হয়েছে
          </span>
          <h2 className="text-2xl font-bold text-stone-900 mt-1">
            অসাধারণ অগ্রগতি!
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            আপনি আজকের পাঠের প্রতিটি ধাপ সফলভাবে সম্পন্ন করেছেন।
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-lg">
              <Zap className="w-5 h-5 fill-emerald-600" />
              <span>+{xpEarned} XP</span>
            </div>
            <span className="text-xs text-emerald-800 font-medium mt-0.5">জ্ঞান পয়েন্ট</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-700 font-bold text-lg">
              <Flame className="w-5 h-5 fill-amber-500" />
              <span>{streakDays} দিন</span>
            </div>
            <span className="text-xs text-amber-800 font-medium mt-0.5">ধারাবাহিক স্ট্রিক</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {nextLessonId ? (
            <Link
              href={`/learn/${nextLessonId}`}
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>পরবর্তী পাঠে যান</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>ড্যাশবোর্ডে ফিরে যান</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/practice"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs block transition-colors"
          >
            আজকের ৩০ মিনিটের পুনরাবৃত্তি শুরু করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
