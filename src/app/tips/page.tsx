'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Search,
  ArrowRight,
  Filter,
  Sparkles,
  Zap,
  CheckCircle2,
  HeartHandshake,
  RotateCcw
} from 'lucide-react';
import AudioPronounceButton from '@/components/AudioPronounceButton';
import { SENTENCE_TIPS, SENTENCE_TIPS_CATEGORIES } from '@/data/sentenceTips';

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTesterIndex, setActiveTesterIndex] = useState<number | null>(null);

  // Filtered tips
  const filteredTips = useMemo(() => {
    return SENTENCE_TIPS.filter((tip) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (tip.position !== selectedCategory) {
          return false;
        }
      }

      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPattern = tip.pattern.toLowerCase().includes(q);
        const matchesTranslit = tip.transliteration.toLowerCase().includes(q);
        const matchesMeaning = tip.meaning.toLowerCase().includes(q);
        const matchesFormula = tip.shortcutFormula.toLowerCase().includes(q);
        const matchesSummary = tip.summary.toLowerCase().includes(q);
        const matchesExamples = tip.examples.some(
          (ex) => ex.arabic.includes(q) || ex.bengali.toLowerCase().includes(q)
        );

        return (
          matchesPattern ||
          matchesTranslit ||
          matchesMeaning ||
          matchesFormula ||
          matchesSummary ||
          matchesExamples
        );
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Quick interactive tester list (top 6 high frequency shortcuts)
  const testerItems = useMemo(() => {
    return SENTENCE_TIPS.slice(0, 8);
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 font-sans pb-20 selection:bg-emerald-500 selection:text-white">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-850 text-white pt-10 pb-14 border-b border-stone-800 relative overflow-hidden">
        {/* Subtle Decorative Ambient Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          {/* Breadcrumbs & Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-400">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                মূলপাতা
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-medium">বাক্য বোঝার ৮০% টিপস</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-amber-950/80 border border-amber-600/50 px-3.5 py-1 rounded-full text-xs text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>প্যারেটো ৮০/২০ নিয়ম • কঠিন ছক ছাড়াই সরাসরি কুরআনের ভাষা উপলব্ধি</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>Tips & Shortcuts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 font-bengali">
              কুরআনের বাক্য বোঝার ৮০% সহজ শর্টকাট টিপস
            </h1>
            <p className="text-base sm:text-lg text-emerald-200/90 font-medium max-w-3xl leading-relaxed font-bengali">
              কঠিন ব্যাকরণ ছক মুখস্থ করার কোনো প্রয়োজন নেই! <span className="text-amber-300 font-bold">শব্দে X দেখলে অর্থ Y</span>—এই
              কয়েকটি অতি সহজ সূত্র জানা থাকলে কুরআনের যেকোনো বাক্য ও দোয়ার ৮০% গঠন আপনি প্রথম দেখাতেই সরাসরি ধরতে পারবেন।
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400 font-sans">{SENTENCE_TIPS.length}টি</div>
              <div className="text-xs text-stone-300 font-medium">গোল্ডেন শর্টকাট টিপস</div>
            </div>
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-amber-400 font-sans">
                {SENTENCE_TIPS.filter((t) => t.position === 'prefix').length}টি
              </div>
              <div className="text-xs text-stone-300 font-medium">শব্দের শুরুতে (Prefix)</div>
            </div>
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-sky-400 font-sans">
                {SENTENCE_TIPS.filter((t) => t.position === 'suffix').length}টি
              </div>
              <div className="text-xs text-stone-300 font-medium">শব্দের শেষে (Suffix)</div>
            </div>
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-purple-400 font-sans">৮০%</div>
              <div className="text-xs text-stone-300 font-medium">কুরআনিক বাক্য কভারেজ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Interactive "X দেখলে Y" Mini Quick Tester */}
        <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                  দ্রুত টেস্ট করুন: শব্দে X দেখলে অর্থ Y
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-bengali">
                নিচের যেকোনো চিহ্নে ক্লিক করে দেখুন অর্থ মনে করতে পারেন কি না:
              </p>
            </div>
            <span className="text-[11px] bg-emerald-800/80 border border-emerald-600/50 px-3 py-1 rounded-full text-emerald-200">
              ক্লিক করে অর্থ উন্মুক্ত করুন
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {testerItems.map((tip, idx) => {
              const isSelected = activeTesterIndex === idx;
              return (
                <button
                  key={tip.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setActiveTesterIndex(null);
                    } else {
                      setActiveTesterIndex(idx);
                    }
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] select-none ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md font-bold scale-[1.02]'
                      : 'bg-emerald-950/60 border-emerald-700/60 hover:border-amber-400/80 hover:bg-emerald-900/60 text-white'
                  }`}
                >
                  <span className="text-[11px] opacity-80">{tip.positionLabel}</span>
                  <div className="font-quran text-2xl font-bold my-0.5">{tip.pattern}</div>
                  <span className="text-xs font-semibold font-bengali">
                    {isSelected ? tip.meaning.split('।')[0] : 'অর্থ কী? ➔'}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTesterIndex !== null && (
            <div className="mt-4 p-4 rounded-xl bg-white/10 border border-amber-300/30 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-amber-300 font-sans mr-2">
                  {testerItems[activeTesterIndex].pattern} ({testerItems[activeTesterIndex].positionLabel}):
                </span>
                <span className="text-stone-100 font-bengali font-medium">
                  {testerItems[activeTesterIndex].shortcutFormula} — {testerItems[activeTesterIndex].summary}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTesterIndex(null)}
                className="text-xs text-stone-300 hover:text-white underline shrink-0 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          )}
        </section>

        {/* Filter and Search Bar */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="যেকোনো উপসর্গ, চিহ্ন বা অর্থ খুঁজুন (যেমন: বি-, আমাদের, তারা করেছে, জন্য, আল-)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-800 placeholder-stone-400 transition-all font-bengali"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200/60 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Clear Filter Button if filtered */}
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 flex items-center gap-1 underline underline-offset-2 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট করুন</span>
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" /> অবস্থান:
            </span>
            {SENTENCE_TIPS_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600 px-1 font-bengali">
          <span>
            দেখাচ্ছে <strong className="text-stone-900 font-sans">{filteredTips.length}</strong>টি গোল্ডেন শর্টকাট
          </span>
          <span className="text-stone-400">প্রতিটি কার্ডে বিস্তারিত উদাহরণ ও প্রো-টিপ দেওয়া আছে</span>
        </div>

        {/* Tips Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTips.map((tip) => (
            <article
              key={tip.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header: Pattern Badge + Frequency + Position */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 text-emerald-900 flex items-center justify-center font-quran text-2xl font-bold shrink-0 shadow-inner">
                      {tip.pattern}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mb-1">
                        {tip.positionLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 font-bengali">
                        {tip.ruleTitle}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-500 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg shrink-0 font-medium">
                    {tip.frequency}
                  </span>
                </div>

                {/* Golden Formula Box (X দেখলে Y) */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center gap-2 text-xs sm:text-sm text-amber-950 font-bengali">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold">{tip.shortcutFormula}</span>
                </div>

                {/* Summary / Rule Description */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-bengali">
                  {tip.summary}
                </p>

                {/* Practical Quranic Examples */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    কুরআনিক বাস্তব উদাহরণ:
                  </h4>
                  <div className="space-y-2">
                    {tip.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 hover:border-emerald-300 transition-colors flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-2" dir="rtl">
                          <div className="font-quran text-lg font-bold text-stone-900 leading-normal">
                            {ex.arabic}
                          </div>
                          <AudioPronounceButton text={ex.arabic} size="sm" />
                        </div>
                        <div className="flex items-baseline justify-between gap-2 text-xs text-stone-800 font-bengali" dir="ltr">
                          <span className="font-bold text-emerald-900">{ex.bengali}</span>
                          <span className="text-stone-500 text-[11px] font-mono shrink-0">{ex.breakdown}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tip Callout */}
                <div className="p-3 rounded-xl bg-stone-100/90 border border-stone-200 text-xs text-stone-700 flex items-start gap-2 font-bengali">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-900">মনে রাখার টিপ: </strong>
                    {tip.proTip}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3 font-bengali">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">কোনো টিপস পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              অনুগ্রহ করে ভিন্ন কোনো শব্দ বা উপসর্গ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              সব টিপস দেখুন
            </button>
          </div>
        )}

        {/* Bottom CTA: Practice on Duas */}
        <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              বাস্তব দোয়া ও আয়াতে প্রয়োগ করুন
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-bengali">
              এই শর্টকাটগুলো দিয়ে ৭৫টি কুরআনিক দোয়া বুঝুন
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-bengali leading-relaxed">
              এখন আপনি বাক্য গঠনের মূল ৮০% নিয়ম জানেন। সরাসরি কুরআনের দোয়া পাতায় গিয়ে প্রতিটি দোয়ার শব্দভিত্তিক খণ্ডগুলো
              নিজের চোখে যাচাই করে দেখুন!
            </p>
          </div>
          <Link
            href="/duas"
            className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 shrink-0"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>কুরআনের দোয়া পাতায় যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
