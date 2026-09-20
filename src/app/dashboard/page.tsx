'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSE_MODULES } from '@/data/courseCurriculum';
import { getUserProfile, calculateLevel } from '@/lib/gamification';
import { UserProfile } from '@/types/curriculum';
import { Flame, Zap, Award, BookOpen, Clock, Lock, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const totalXp = profile?.totalXp ?? 150;
  const { level, nextLevelXp, currentLevelMinXp } = calculateLevel(totalXp);
  const xpProgressPercent = Math.min(
    100,
    Math.max(0, ((totalXp - currentLevelMinXp) / (nextLevelXp - currentLevelMinXp)) * 100)
  );

  const completedLessons = profile?.completedLessons ?? ['module-01-lesson-01'];
  const unlockedModule = profile?.unlockedModule ?? 3;

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Learner Card & Gamification Bar */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Details */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-full text-xs text-emerald-300 font-semibold">
                <span>লেভেল {level} শিক্ষার্থী</span>
                <span>•</span>
                <span>স্ব-শিক্ষণ পথ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                আস-সালামু আলাইকুম, {profile?.name ?? 'কুরআন শিক্ষার্থী'}!
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                প্রতিদিন ২০–২৫ মিনিটের পাঠ এবং ৩০ মিনিটের নিয়মিত অনুশীলন আপনাকে পুরো কুরআনের সরাসরি অনুধাবনের দিকে এগিয়ে নিচ্ছে।
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex items-center gap-3">
              {/* Streak */}
              <div className="bg-stone-800/80 border border-stone-700/80 p-3.5 rounded-2xl text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                  <Flame className="w-5 h-5 fill-amber-400" />
                  <span>{profile?.streakDays ?? 1}</span>
                </div>
                <span className="text-[13px] text-stone-400 font-medium">দিনের স্ট্রিক</span>
              </div>

              {/* Total XP */}
              <div className="bg-stone-800/80 border border-stone-700/80 p-3.5 rounded-2xl text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-lg">
                  <Zap className="w-5 h-5 fill-emerald-400" />
                  <span>{totalXp}</span>
                </div>
                <span className="text-[13px] text-stone-400 font-medium">মোট XP</span>
              </div>

              {/* Badges Count */}
              <div className="bg-stone-800/80 border border-stone-700/80 p-3.5 rounded-2xl text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-teal-400 font-bold text-lg">
                  <Award className="w-5 h-5" />
                  <span>{profile?.badges?.length ?? 2}</span>
                </div>
                <span className="text-[13px] text-stone-400 font-medium">অর্জিত ব্যাজ</span>
              </div>
            </div>
          </div>

          {/* XP Progress to Next Level */}
          <div className="mt-6 pt-6 border-t border-stone-800/80">
            <div className="flex justify-between text-xs text-stone-300 mb-2 font-medium">
              <span>লেভেল {level} অগ্রগতি</span>
              <span>
                {totalXp} / {nextLevelXp} XP (লেভেল {level + 1}-এর জন্য আর{' '}
                {nextLevelXp - totalXp} XP প্রয়োজন)
              </span>
            </div>
            <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Action Banner (30 Min Practice) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                আজকের ৩০ মিনিটের স্বাধীন পুনরাবৃত্তি বাকি আছে?
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                স্মরণ ব্যবধান (SRS) কার্ডের মাধ্যমে আগের শেখা শব্দের তাৎক্ষণিক অর্থ উদ্ধার করুন।
              </p>
            </div>
          </div>

          <Link
            href="/practice"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs shrink-0 transition-colors"
          >
            <span>পুনরাবৃত্তি শুরু করুন (+৩০ XP)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Badges Showcase */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span>অর্জিত সম্মাননা ও ব্যাজসমূহ</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {profile?.badges?.map((badge) => (
              <div
                key={badge.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3 shadow-2xs"
              >
                <div className="text-2xl p-2 rounded-xl bg-stone-100">{badge.icon}</div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {badge.titleBengali}
                  </h4>
                  <p className="text-[13px] text-stone-500 mt-0.5">
                    {badge.descriptionBengali}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-stone-50/60 p-4 rounded-2xl border border-dashed border-stone-300 flex items-center gap-3 text-stone-400">
              <div className="text-2xl p-2 rounded-xl bg-stone-200/50">🔒</div>
              <div>
                <h4 className="font-semibold text-stone-600 text-xs">
                  পরবর্তী ব্যাজ: চেকপয়েন্ট A বিজয়ী
                </h4>
                <p className="text-[12px] text-stone-400 mt-0.5">
                  সপ্তাহ ৪-এর চেকপয়েন্টে ৮৫%+ পেলে আনলক হবে
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quran Vocabulary Spotlight Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 p-5 rounded-3xl border border-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-quran text-2xl font-bold shrink-0">
              ق
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[13px] text-emerald-300 font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>নতুন ফিচার</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-100">
                কোরানের শব্দভান্ডার (Root Words & Derivatives)
              </h3>
              <p className="text-xs text-stone-300">
                কুরআনের ৮০% অংশ জুড়ে থাকা প্রধান মূল শব্দ পরিবার ও তাদের বিভিন্ন রূপান্তর।
              </p>
            </div>
          </div>
          <Link
            href="/vocabulary"
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            <span>শব্দভান্ডার এক্সপ্লোর করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 24-Module / 120-Lesson Curriculum Pathway */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>১২০টি পাঠের পূর্ণাঙ্গ শিক্ষাপথ (২৪ সপ্তাহ)</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                প্রতি সপ্তাহে ৫টি পাঠ ও ২ দিনের সাপ্তাহিক একত্রীকরণ
              </p>
            </div>
            <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200 self-start sm:self-auto">
              আনলক করা: মডিউল {unlockedModule} পর্যন্ত
            </span>
          </div>

          <div className="space-y-4">
            {COURSE_MODULES.map((module) => {
              const isUnlocked = module.moduleNumber <= unlockedModule;
              const isCurrent = module.moduleNumber === unlockedModule;
              const isCompleted = module.moduleNumber < unlockedModule;

              // Sample lesson route mapping for demo
              const lessonRoute =
                module.moduleNumber === 1
                  ? '/learn/module-01-lesson-01'
                  : module.moduleNumber === 2
                  ? '/learn/module-02-lesson-06'
                  : module.moduleNumber === 3
                  ? '/learn/module-03-lesson-11'
                  : '#';

              return (
                <div
                  key={module.moduleNumber}
                  className={`rounded-3xl p-6 border transition-all ${
                    isCurrent
                      ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                      : isCompleted
                      ? 'bg-white border-stone-200'
                      : 'bg-stone-100/70 border-stone-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isCurrent
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCompleted
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          সপ্তাহ {module.weekNumber} • মডিউল {module.moduleNumber} (পাঠ {((module.moduleNumber - 1) * 5) + 1}–{module.moduleNumber * 5})
                        </span>

                        {module.isCheckpoint && (
                          <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>{module.checkpointTitle}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-stone-900">
                        {module.titleBengali}
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong>মূল বিষয়: </strong> {module.coreGrammarBengali}
                      </p>

                      <p className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl inline-block border border-emerald-200/60">
                        🎯 <strong>প্রত্যাশিত ফল:</strong> {module.observableOutcomeBengali}
                      </p>

                      {module.moduleNumber === 1 && (
                        <div className="pt-2">
                          <div className="text-[13px] font-bold text-stone-500 mb-1.5">মডিউল ১-এর প্রস্তুতকৃত পাঠসমূহ:</div>
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href="/learn/module-01-lesson-01"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ১ (১:২)</span>
                            </Link>
                            <Link
                              href="/learn/module-01-lesson-02"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ২ (১:৬)</span>
                            </Link>
                            <Link
                              href="/learn/module-01-lesson-03"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ৩ (২:২০১)</span>
                            </Link>
                            <Link
                              href="/learn/module-01-lesson-04"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ৪ (১:৪–৫)</span>
                            </Link>
                            <Link
                              href="/learn/module-01-lesson-05"
                              className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>পাঠ ৫ (মডিউল ১ যাচাই) • নতুন</span>
                            </Link>
                          </div>
                        </div>
                      )}

                      {module.moduleNumber === 2 && (
                        <div className="pt-2">
                          <div className="text-[13px] font-bold text-stone-500 mb-1.5">মডিউল ২-এর প্রস্তুতকৃত পাঠ:</div>
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href="/learn/module-02-lesson-06"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ৬ (৭টি সর্বনাম)</span>
                            </Link>
                            <Link
                              href="/learn/module-02-lesson-07"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ৭ (যুক্ত সর্বনাম: কার?)</span>
                            </Link>
                            <Link
                              href="/learn/module-02-lesson-08"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ৮ (কাজের সর্বনাম: কাকে?)</span>
                            </Link>
                            <Link
                              href="/learn/module-02-lesson-09"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ৯ (এক ও অনেকে: তিনি/তারা)</span>
                            </Link>
                            <Link
                              href="/learn/module-02-lesson-10"
                              className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>পাঠ ১০ (মডিউল ২ যাচাই) • নতুন</span>
                            </Link>
                          </div>
                        </div>
                      )}

                      {module.moduleNumber === 3 && (
                        <div className="pt-2">
                          <div className="text-[13px] font-bold text-stone-500 mb-1.5">মডিউল ৩-এর প্রস্তুতকৃত পাঠসমূহ:</div>
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href="/learn/module-03-lesson-11"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ১১ (فِي, مِنْ, إِلَى, عَلَى)</span>
                            </Link>
                            <Link
                              href="/learn/module-03-lesson-12"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ১২ (যুক্ত হরফ: بِـ, لِـ, وَ)</span>
                            </Link>
                            <Link
                              href="/learn/module-03-lesson-13"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ১৩ (দুই নামের সম্পর্ক)</span>
                            </Link>
                            <Link
                              href="/learn/module-03-lesson-14"
                              className="text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>পাঠ ১৪ (সম্পর্কের শৃঙ্খল)</span>
                            </Link>
                            <Link
                              href="/learn/module-03-lesson-15"
                              className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>পাঠ ১৫ (মডিউল ৩ সার্বিক যাচাই) • নতুন</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 self-start md:self-center">
                      {isUnlocked ? (
                        <Link
                          href={lessonRoute}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs ${
                            isCurrent
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>পুনরায় দেখুন</span>
                            </>
                          ) : (
                            <>
                              <span>পাঠ শুরু করুন</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-200/60 px-3.5 py-2 rounded-xl">
                          <Lock className="w-3.5 h-3.5" />
                          <span>পূর্ববর্তী মডিউল শেষ করুন</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
