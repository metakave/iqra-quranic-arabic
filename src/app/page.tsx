'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { COURSE_MODULES } from '@/data/courseCurriculum';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Clock,
  Award,
  ShieldCheck,
  ChevronRight,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const [demoRevealed, setDemoRevealed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-850 to-emerald-950 text-white py-16 sm:py-24 px-4">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Bengali Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs sm:text-sm text-emerald-300 font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>বাংলাভাষীদের জন্য বৈজ্ঞানিক স্ব-শিক্ষণ প্ল্যাটফর্ম</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-tight">
              ইক্বরা কোরানের আরবী
            </h1>
            <p className="text-sm sm:text-base font-sans font-semibold tracking-widest text-emerald-400 uppercase">
              IQRA Quranic Arabic
            </p>
          </div>

          <p className="text-lg sm:text-2xl text-emerald-300 font-medium max-w-2xl mx-auto leading-relaxed">
            কোনো মুখস্থ ছক ছাড়াই কুরআনের আরবি সরাসরি উপলব্ধি করার আধুনিক পদ্ধতি
          </p>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            “ছোট ছোট পাঠ, নিয়মিত অনুশীলন এবং বাস্তব আয়াতের সাহায্যে কুরআনের আরবি বুঝে পড়ার ধাপে ধাপে কোর্স। প্রথমে প্রয়োজনীয় শব্দ ও বাক্যের গঠন; এরপর নতুন আয়াত নিজে বোঝার অনুশীলন।”
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>গুগল দিয়ে বিনামূল্যে শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/learn/module-01-lesson-01"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 font-semibold text-base border border-stone-700 flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>প্রথম পাঠের ডেমো দেখুন (সূরা ফাতিহা)</span>
            </Link>
          </div>

          {/* Guarantee / Realism banner */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ১২০টি ছোট পাঠ (প্রতিটি ২০–২৫ মিনিট)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              দৈনিক ৩০ মিনিটের স্বাধীন পুনরাবৃত্তি
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              গেমিফিকেশন ও ধারাবাহিক স্ট্রিক
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Micro-Demo Widget */}
      <section className="py-12 px-4 -mt-8 relative z-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              পদ্ধতির জীবন্ত উদাহরণ
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
              মডিউল ২ • পাঠ ৬
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              শব্দের শেষে نَا (না) দেখলে কীভাবে বুঝবেন এর অর্থ কী?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              নিচের অংশে ক্লিক করে দেখুন কীভাবে কাজের সাথে আর নামের সাথে সংযুক্ত হয়ে অর্থ বদলে যায়:
            </p>
          </div>

          {/* Interactive Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2" dir="rtl">
            {/* Card 1: اهْدِنَا */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 text-center space-y-3">
              <div className="font-quran text-4xl text-emerald-950 leading-relaxed">
                اهْدِ + نَا
              </div>
              <div className="text-xs text-stone-600 font-sans" dir="ltr">
                সূরা আল-ফাতিহা ১:৬
              </div>
              <div className="border-t border-emerald-200/60 pt-2 text-stone-900 font-bold text-sm" dir="ltr">
                “আমাদেরকে পথ দেখান”
              </div>
              <p className="text-[11px] text-stone-500 font-sans" dir="ltr">
                اهْدِ কাজের নির্দেশ হওয়ায় نَا মানে <strong>“আমাদেরকে”</strong> (কর্ম)
              </p>
            </div>

            {/* Card 2: رَبَّنَا */}
            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 text-center space-y-3">
              <div className="font-quran text-4xl text-amber-950 leading-relaxed">
                رَبَّ + نَا
              </div>
              <div className="text-xs text-stone-600 font-sans" dir="ltr">
                সূরা আল-বাকারা ২:২০১
              </div>
              <div className="border-t border-amber-200/60 pt-2 text-stone-900 font-bold text-sm" dir="ltr">
                “আমাদের প্রতিপালক”
              </div>
              <p className="text-[11px] text-stone-500 font-sans" dir="ltr">
                رَبّ নাম/বিশেষ্য হওয়ায় نَا মানে <strong>“আমাদের”</strong> (মালিকানা)
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/learn/module-02-lesson-06"
              className="text-xs sm:text-sm text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
            >
              <span>এই পাঠের সম্পূর্ণ ৫টি ধাপ অনুশীলন করুন</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The 5-Step Teaching Method */}
      <section className="py-16 px-4 bg-stone-100/60 border-y border-stone-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              বৈজ্ঞানিক শিক্ষাদান কাঠামো
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-900">
              ৫ ধাপের পাঠপদ্ধতি: দেখুন → ভাঙুন → জুড়ুন → বলুন → মিলিয়ে নিন
            </h2>
            <p className="text-sm text-stone-600">
              অনুবাদ মুখস্থ নয়; প্রতিটি আয়াতে শিক্ষার্থী নিজেই অর্থের মূল ভিত্তি আবিষ্কার করেন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '১. দেখুন',
                title: 'সরাসরি পাঠ',
                desc: 'মূল আরবি পাঠটি পড়ুন এবং পরিচিত চিহ্নগুলো খেয়াল করুন। কোনো প্রাথমিক অনুবাদ দেওয়া হয় না।',
                icon: '👁️',
              },
              {
                step: '২. ভাঙুন',
                title: 'অংশ বিশ্লেষণ',
                desc: 'অর্থপূর্ণ খণ্ড ও সংযুক্ত টুকরোগুলো (উপসর্গ, প্রত্যয়, মূল শব্দ) আলাদা করে চিনুন।',
                icon: '🧩',
              },
              {
                step: '৩. জুড়ুন',
                title: 'সম্পর্ক তৈরি',
                desc: 'কে কাজটি করছে, কার ওপর ঘটছে এবং যৌক্তিক সংযোগগুলো একটার সাথে আরেকটা জোড়া দিন।',
                icon: '🔗',
              },
              {
                step: '৪. বলুন',
                title: 'নিজের ভাষায় অর্থ',
                desc: 'মডেল উত্তর দেখার আগেই নিজের বোধগম্যতা বাংলায় টাইপ করে প্রকাশ করুন।',
                icon: '✍️',
              },
              {
                step: '৫. মিলিয়ে নিন',
                title: 'যাচাই ও সমাধান',
                desc: 'প্রামাণ্য ব্যাখ্যার সাথে মিলিয়ে ভুল শনাক্ত করুন এবং প্রয়োজনীয় সূত্র আত্মস্থ করুন।',
                icon: '✓',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-stone-900 text-base mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Snapshot */}
      <section id="curriculum" className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              স্ব-শিক্ষণ সিলেবাস
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              ১২০টি পাঠ • ২৪ সপ্তাহের রূপরেখা
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              প্রতিটি মডিউলে রয়েছে ৫টি সুনির্দিষ্ট পাঠ এবং ৫টি নিয়মিত চেকপয়েন্ট মূল্যায়ন।
            </p>
          </div>

          <div className="space-y-3">
            {COURSE_MODULES.slice(0, 6).map((m) => (
              <div
                key={m.moduleNumber}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      সপ্তাহ {m.weekNumber} • মডিউল {m.moduleNumber}
                    </span>
                    {m.isCheckpoint && (
                      <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                        {m.checkpointTitle}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-base">
                    {m.titleBengali}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {m.coreGrammarBengali}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="text-xs text-emerald-700 font-bold hover:underline shrink-0 flex items-center gap-1"
                >
                  <span>সিলেবাসে দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-bold text-xs sm:text-sm inline-flex items-center gap-2"
            >
              <span>সকল ২৪টি মডিউল ও ১২০টি পাঠের তালিকা দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer Card */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-bold">
            আজই শুরু হোক আপনার কুরআনিক আরবি বোঝার যাত্রা
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            কোনো খরচ নেই, কোনো জটিল রেজিস্ট্রেশন নেই। গুগল একাউন্ট দিয়ে এক ক্লিকে প্রবেশ করে নিজের সুবিধাজনক সময়ে পড়ুন।
          </p>
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-stone-100 text-emerald-950 font-bold text-base shadow-lg inline-flex items-center gap-2 transition-all transform hover:scale-102"
            >
              <span>নিবন্ধন ছাড়াই এখনই পরীক্ষা করুন</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
