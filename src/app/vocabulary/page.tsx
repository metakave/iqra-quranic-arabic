'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Filter,
  Sparkles,
  Layers,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { QURAN_ROOT_FAMILIES, RootFamily, DerivativeWord } from '@/data/quranVocabulary';

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRootId, setSelectedRootId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Compute statistics
  const totalRoots = QURAN_ROOT_FAMILIES.length;
  const totalDerivatives = QURAN_ROOT_FAMILIES.reduce(
    (sum, r) => sum + r.derivatives.length,
    0
  );
  const totalFrequency = QURAN_ROOT_FAMILIES.reduce(
    (sum, r) => sum + r.frequencyInQuran,
    0
  );

  // Filter logic
  const filteredFamilies = useMemo(() => {
    return QURAN_ROOT_FAMILIES.filter((family) => {
      if (selectedRootId !== 'all' && family.id !== selectedRootId) {
        return false;
      }
      return true;
    }).map((family) => {
      const filteredDerivatives = family.derivatives.filter((word) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'verb') {
            if (!['past_verb', 'present_verb', 'imperative_verb'].includes(word.category)) {
              return false;
            }
          } else if (word.category !== selectedCategory) {
            return false;
          }
        }

        // Search query filter (matches Arabic, Bengali meaning, grammar, or root)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesArabic = word.arabic.includes(q);
          const matchesMeaning = word.meaningBengali.toLowerCase().includes(q);
          const matchesGrammar = word.grammarBengali.toLowerCase().includes(q);
          const matchesRoot = family.rootLettersArabic.includes(q);
          const matchesRootMeaning = family.rootMeaningBengali.toLowerCase().includes(q);

          return matchesArabic || matchesMeaning || matchesGrammar || matchesRoot || matchesRootMeaning;
        }

        return true;
      });

      return {
        ...family,
        derivatives: filteredDerivatives,
      };
    }).filter((family) => family.derivatives.length > 0);
  }, [searchQuery, selectedRootId, selectedCategory]);

  const totalMatches = filteredFamilies.reduce(
    (sum, f) => sum + f.derivatives.length,
    0
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 text-white pt-12 pb-14 px-4 relative overflow-hidden border-b border-stone-700">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs sm:text-sm text-emerald-300 font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>কুরআনের ৮০% শব্দভাণ্ডার • মূল শব্দ পরিবারভিত্তিক অভিধান</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-100">
            কোরানের শব্দভান্ডার
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            কুরআনের বেশিরভাগ আয়াত মাত্র কয়েকটি উচ্চ-ফ্রিকোয়েন্সির মূল শব্দ (Root Words) এবং তাদের রূপান্তর দ্বারা গঠিত। নিচে মূল শব্দ পরিবার ও বাস্তব কুরআনিক উদাহরণসহ সাজানো হলো।
          </p>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-4 text-center">
            <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-2xl">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">
                {totalRoots}টি
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400">মূল শব্দ পরিবার</span>
            </div>
            <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-2xl">
              <span className="text-xl sm:text-2xl font-bold text-teal-300 block">
                {totalDerivatives}টি
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400">সর্বাধিক ব্যবহৃত রূপ</span>
            </div>
            <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-2xl">
              <span className="text-xl sm:text-2xl font-bold text-amber-400 block">
                {totalFrequency.toLocaleString('bn-BD')}+
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400">কুরআনে পুনরাবৃত্তি</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Controls & Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        {/* Search & Filter Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-lg space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আরবি শব্দ, মূল অক্ষর (যেমন: ق-و-ل) বা বাংলা অর্থ দিয়ে খুঁজুন..."
              className="w-full pl-12 pr-4 py-3.5 bg-stone-50 rounded-2xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 placeholder:text-stone-400 text-sm outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-2 py-1 rounded-md"
              >
                মুছুন
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-stone-100">
            {/* Root Word Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" /> মূল:
              </span>
              <button
                type="button"
                onClick={() => setSelectedRootId('all')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
                  selectedRootId === 'all'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                সকল ({totalDerivatives})
              </button>
              {QURAN_ROOT_FAMILIES.map((rf) => (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setSelectedRootId(rf.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
                    selectedRootId === rf.id
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span className="font-quran text-sm mr-1 font-bold">{rf.rootLettersArabic}</span>
                  <span>({rf.derivatives.length})</span>
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                সব রূপ
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('verb')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === 'verb'
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                ক্রিয়া (Verbs)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('noun')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === 'noun'
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                বিশেষ্য (Nouns)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('adjective')}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === 'adjective'
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                গুণবাচক (Adjectives)
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="py-4 px-2 flex items-center justify-between text-xs text-stone-500">
          <span>
            প্রদর্শিত হচ্ছে: <strong className="text-stone-800 font-bold">{totalMatches}টি</strong> শব্দ রূপ
          </span>
          <span className="text-[11px]">
            কার্ডে ট্যাপ করে কুরআনের বাস্তব আয়াত ও উদাহরণ দেখুন
          </span>
        </div>

        {/* Root Families List */}
        {filteredFamilies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">কোনো শব্দ পাওয়া যায়নি</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো শব্দ খুঁজে পাওয়া যায়নি। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedRootId('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-medium text-xs mt-2"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFamilies.map((family) => {
              return (
                <div
                  key={family.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm"
                >
                  {/* Family Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="font-quran text-3xl sm:text-4xl text-emerald-400 font-bold tracking-widest px-3 py-1 bg-stone-800/80 rounded-xl border border-stone-700" dir="rtl">
                          {family.rootLettersArabic}
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-stone-100">
                            {family.rootMeaningBengali}
                          </h2>
                          <span className="text-xs text-emerald-300 font-medium flex items-center gap-1 mt-0.5">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            কুরআনে পুনরাবৃত্তি: প্রায় {family.frequencyInQuran.toLocaleString('bn-BD')} বার
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-400 pt-1 leading-relaxed">
                        {family.descriptionBengali}
                      </p>
                    </div>

                    <div className="shrink-0 text-right sm:text-left">
                      <span className="inline-block text-xs bg-stone-800 text-stone-300 px-3 py-1 rounded-full border border-stone-700 font-medium">
                        {family.derivatives.length}টি রূপ
                      </span>
                    </div>
                  </div>

                  {/* Derivatives Grid */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-stone-50/50">
                    {family.derivatives.map((word) => {
                      const isExpanded = Boolean(expandedCards[word.id]);
                      return (
                        <div
                          key={word.id}
                          onClick={() => toggleExpand(word.id)}
                          className={`cursor-pointer transition-all rounded-2xl p-4 sm:p-5 border select-none ${
                            isExpanded
                              ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                              : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium border border-stone-200 mb-1.5">
                                {word.grammarBengali}
                              </span>
                              <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                                {word.meaningBengali}
                              </h3>
                            </div>

                            {/* Arabic Word Display */}
                            <div className="text-right">
                              <span className="font-quran text-3xl sm:text-4xl text-emerald-950 font-normal leading-relaxed block py-0.5" dir="rtl">
                                {word.arabic}
                              </span>
                            </div>
                          </div>

                          {/* Quranic Ayah Example (Expandable) */}
                          {word.quranExample && (
                            <div className="mt-3 pt-3 border-t border-stone-100">
                              {isExpanded ? (
                                <div className="space-y-2 animate-fadeIn bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70">
                                  <div className="text-xs text-emerald-800 font-bold flex items-center justify-between">
                                    <span>কুরআনিক আয়াত উদাহরণ:</span>
                                    <span className="text-[11px] text-stone-500 font-sans font-normal">
                                      {word.exampleSurahBengali}
                                    </span>
                                  </div>
                                  <p className="font-quran text-2xl text-emerald-950 leading-relaxed text-right py-1" dir="rtl">
                                    {word.quranExample}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-[11px] text-stone-400 hover:text-emerald-700 transition-colors">
                                  <span>আয়াতের উদাহরণ দেখতে ট্যাপ করুন</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Practice Callout */}
        <div className="mt-12 bg-gradient-to-br from-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>দৈনিক ৩০ মিনিটের স্মৃতি অনুশীলন</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              এই শব্দগুলো Spaced Repetition-এ অনুশীলন করবেন?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed">
              পাঠ ১ থেকে ৭ এবং এই মূল শব্দগুলোর ফ্ল্যাশকার্ড নিয়ে প্রতিদিন ৫–১০ মিনিট অনুশীলন করুন, যেন অর্থগুলো মনের মধ্যে স্থায়ী হয়।
            </p>
          </div>

          <Link
            href="/practice"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-emerald-950 font-bold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>দৈনিক অনুশীলন শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
