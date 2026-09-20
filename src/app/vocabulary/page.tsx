'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Filter,
  Sparkles,
  Layers,
  LayoutGrid,
  ArrowRight,
  ChevronDown,
  Flame,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ArrowDownAZ,
  ArrowUpDown,
} from 'lucide-react';
import { QURAN_ROOT_FAMILIES, RootFamily, DerivativeWord } from '@/data/quranVocabulary';
import QuranVerseLink from '@/components/QuranVerseLink';
import AudioPronounceButton from '@/components/AudioPronounceButton';

type SortOption = 'freq_desc' | 'freq_asc' | 'alphabetical';
type ViewMode = 'family' | 'words';

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRootId, setSelectedRootId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('freq_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('family');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [isRootsExpanded, setIsRootsExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const [hasRootsOverflow, setHasRootsOverflow] = useState(false);
  const rootListRef = useRef<HTMLDivElement>(null);

  const calculateThreeLinesHeight = useCallback(() => {
    if (!rootListRef.current) return;
    const container = rootListRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    // Group children by distinct line top offsets with 6px tolerance
    const lineTops: number[] = [];
    for (const child of children) {
      const top = child.offsetTop;
      if (!lineTops.some((t) => Math.abs(t - top) < 6)) {
        lineTops.push(top);
      }
    }

    lineTops.sort((a, b) => a - b);

    if (lineTops.length > 3) {
      setHasRootsOverflow(true);
      // Determine bounding bottom of line 3 (index 2)
      const thirdLineTop = lineTops[2];
      const thirdLineChildren = children.filter((c) => Math.abs(c.offsetTop - thirdLineTop) < 6);
      const maxBottom = Math.max(...thirdLineChildren.map((c) => c.offsetTop + c.offsetHeight));
      const targetHeight = maxBottom - container.offsetTop;
      setCollapsedHeight(targetHeight);
    } else {
      setHasRootsOverflow(false);
      setCollapsedHeight(null);
    }
  }, []);

  useEffect(() => {
    calculateThreeLinesHeight();

    const timeoutId = setTimeout(calculateThreeLinesHeight, 100);

    const container = rootListRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        calculateThreeLinesHeight();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', calculateThreeLinesHeight);

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', calculateThreeLinesHeight);
    };
  }, [calculateThreeLinesHeight]);

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

  const QURAN_TOTAL_WORDS = 77439;
  const coveragePercent = Math.min(
    100,
    parseFloat(((totalFrequency / QURAN_TOTAL_WORDS) * 100).toFixed(1))
  );

  // Filter and sort logic for families
  const filteredFamilies = useMemo(() => {
    const matched = QURAN_ROOT_FAMILIES.filter((family) => {
      if (selectedRootId !== 'all' && family.id !== selectedRootId) {
        return false;
      }
      return true;
    }).map((family) => {
      let filteredDerivatives = family.derivatives.filter((word) => {
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

      // Sort derivatives within each family
      filteredDerivatives = [...filteredDerivatives].sort((a, b) => {
        if (sortBy === 'freq_desc') {
          return (b.frequencyInQuran ?? 0) - (a.frequencyInQuran ?? 0);
        }
        if (sortBy === 'freq_asc') {
          return (a.frequencyInQuran ?? 0) - (b.frequencyInQuran ?? 0);
        }
        if (sortBy === 'alphabetical') {
          return a.arabic.localeCompare(b.arabic, 'ar');
        }
        return 0;
      });

      return {
        ...family,
        derivatives: filteredDerivatives,
      };
    }).filter((family) => family.derivatives.length > 0);

    // Sort families
    return matched.sort((a, b) => {
      if (sortBy === 'freq_desc') {
        return b.frequencyInQuran - a.frequencyInQuran;
      }
      if (sortBy === 'freq_asc') {
        return a.frequencyInQuran - b.frequencyInQuran;
      }
      if (sortBy === 'alphabetical') {
        return a.rootLettersArabic.localeCompare(b.rootLettersArabic, 'ar');
      }
      return 0;
    });
  }, [searchQuery, selectedRootId, selectedCategory, sortBy]);

  // Flattened words for 'words' view mode
  const allFilteredWords = useMemo(() => {
    const list: (DerivativeWord & {
      rootLettersArabic: string;
      rootMeaningBengali: string;
      rootFamilyId: string;
    })[] = [];

    filteredFamilies.forEach((family) => {
      family.derivatives.forEach((word) => {
        list.push({
          ...word,
          rootLettersArabic: family.rootLettersArabic,
          rootMeaningBengali: family.rootMeaningBengali,
          rootFamilyId: family.id,
        });
      });
    });

    return list.sort((a, b) => {
      if (sortBy === 'freq_desc') {
        return (b.frequencyInQuran ?? 0) - (a.frequencyInQuran ?? 0);
      }
      if (sortBy === 'freq_asc') {
        return (a.frequencyInQuran ?? 0) - (b.frequencyInQuran ?? 0);
      }
      if (sortBy === 'alphabetical') {
        return a.arabic.localeCompare(b.arabic, 'ar');
      }
      return 0;
    });
  }, [filteredFamilies, sortBy]);

  const totalMatches = allFilteredWords.length;

  const sortLabels: Record<SortOption, string> = {
    freq_desc: 'সর্বাধিক পুনরাবৃত্তি আগে (High → Low)',
    freq_asc: 'কম পুনরাবৃত্তি আগে (Low → High)',
    alphabetical: 'আরবি বর্ণানুক্রমিক (A → Z)',
  };

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
            কুরআনের মূল শব্দ পরিবার ও সর্বাধিক পুনরাবৃত্ত শব্দসমূহ। যেকোনো শব্দে ট্যাপ করে কুরআনের বাস্তব আয়াত ও ব্যাকরণগত রূপান্তর দেখুন।
          </p>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-4 text-center">
            <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-2xl">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">
                {totalRoots}টি
              </span>
              <span className="text-xs sm:text-sm text-stone-400">মূল শব্দ পরিবার</span>
            </div>
            <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-2xl">
              <span className="text-xl sm:text-2xl font-bold text-teal-300 block">
                {totalDerivatives}টি
              </span>
              <span className="text-xs sm:text-sm text-stone-400">সর্বাধিক ব্যবহৃত রূপ</span>
            </div>
            <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-2xl">
              <span className="text-xl sm:text-2xl font-bold text-amber-300 block">
                {totalFrequency.toLocaleString('bn-BD')}
              </span>
              <span className="text-xs sm:text-sm text-stone-400">কুরআনে পুনরাবৃত্তি</span>
            </div>
          </div>

          {/* 80% Vocabulary Target Progress Tracker */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="bg-stone-800/90 border border-emerald-500/30 rounded-2xl p-4 text-left shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-300">
                    কুরআনের ৮০% শব্দভাণ্ডার অর্জনের লক্ষ্যমাত্রা অর্জিত! 🎉
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-300">
                  {coveragePercent}% অর্জিত / ৮০%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-stone-700 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${Math.min(100, (coveragePercent / 80) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2">
                <span>বর্তমান ভাণ্ডার: {totalFrequency.toLocaleString('bn-BD')} শব্দ ({totalRoots}টি পরিবার)</span>
                <span className="text-emerald-400 font-semibold">৮০%+ লক্ষ্যমাত্রা সম্পন্ন (+১১,৭৪২ শব্দ)</span>
              </div>
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

          {/* Multi-line Root Words Section with 3-Line Clamping & Show More */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
                <Filter className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>কুরআনিক মূল ও ব্যাকরণিক শব্দ পরিবার ({QURAN_ROOT_FAMILIES.length}টি দল):</span>
                {selectedRootId !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedRootId('all')}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 underline font-semibold ml-1 cursor-pointer"
                  >
                    সকল রিসেট
                  </button>
                )}
              </div>
              {hasRootsOverflow && (
                <button
                  type="button"
                  onClick={() => setIsRootsExpanded((prev) => !prev)}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  <span>{isRootsExpanded ? 'সংক্ষেপ করুন' : 'সকল তালিকা দেখুন'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isRootsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
            </div>

            <div className="relative">
              <div
                ref={rootListRef}
                className="flex flex-wrap items-center gap-1.5 transition-[max-height] duration-300 ease-in-out overflow-hidden"
                style={{
                  maxHeight: isRootsExpanded
                    ? '2500px'
                    : collapsedHeight
                    ? `${collapsedHeight}px`
                    : '135px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedRootId('all')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedRootId === 'all'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs ring-2 ring-emerald-600/30'
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
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
                      selectedRootId === rf.id
                        ? 'bg-emerald-700 text-white font-bold shadow-xs ring-2 ring-emerald-600/30'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="font-quran text-base mr-1 font-bold" dir="rtl">
                      {rf.rootLettersArabic}
                    </span>
                    <span>({rf.derivatives.length})</span>
                  </button>
                ))}
              </div>

              {/* Bottom gradient fade when collapsed */}
              {!isRootsExpanded && hasRootsOverflow && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent" />
              )}
            </div>

            {/* Show More / Show Less Toggle Button for mobile & desktop */}
            {hasRootsOverflow && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRootsExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-4 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <span>
                    {isRootsExpanded
                      ? 'সংক্ষেপ করুন (Show Less)'
                      : 'আরও দেখুন (Show More)'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-emerald-700 transition-transform duration-300 ${
                      isRootsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Sorting & Category Control Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-stone-100">
            {/* Sort Mechanism */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700" /> সাজান:
              </span>
              <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy('freq_desc')}
                  title="সবচেয়ে বেশি ব্যবহৃত শব্দ ও মূল আগে"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    sortBy === 'freq_desc'
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>সর্বাধিক আগে (High → Low)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('freq_asc')}
                  title="কম ব্যবহৃত শব্দ ও মূল আগে"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    sortBy === 'freq_asc'
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ArrowUpNarrowWide className="w-3.5 h-3.5 text-stone-500" />
                  <span>কম আগে (Low → High)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('alphabetical')}
                  title="আরবি বর্ণানুক্রমিক সাজান"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    sortBy === 'alphabetical'
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ArrowDownAZ className="w-3.5 h-3.5 text-stone-500" />
                  <span>বর্ণানুক্রমিক (A → Z)</span>
                </button>
              </div>
            </div>

            {/* View Mode & Category Filters */}
            <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  সব রূপ
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('verb')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    selectedCategory === 'verb'
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  ক্রিয়া
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('noun')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    selectedCategory === 'noun'
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  বিশেষ্য
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('adjective')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    selectedCategory === 'adjective'
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  গুণবাচক
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('particle')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    selectedCategory === 'particle'
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  অব্যয়
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('pronoun')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    selectedCategory === 'pronoun'
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  সর্বনাম
                </button>
              </div>

              {/* View Mode Toggle: Family vs Flat Words */}
              <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('family')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'family'
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="মূল শব্দ পরিবারভিত্তিক গ্রুপ ভিউ"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>পরিবার</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('words')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'words'
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="সকল একক শব্দ তালিকা ভিউ"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>একক শব্দ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Sort Counter Bar */}
        <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>
              প্রদর্শিত: <strong className="text-stone-800 font-bold">{totalMatches}টি</strong> শব্দ
              {viewMode === 'family' && ` (${filteredFamilies.length}টি মূল পরিবার)`}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              {sortLabels[sortBy]}
            </span>
          </div>
          <span className="text-[13px] text-stone-400">
            কার্ডে ট্যাপ করে কুরআনের বাস্তব আয়াত ও উদাহরণ দেখুন
          </span>
        </div>

        {/* Empty State */}
        {totalMatches === 0 ? (
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
                setSortBy('freq_desc');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-medium text-xs mt-2"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : viewMode === 'family' ? (
          /* View Mode 1: Grouped by Root Family */
          <div className="space-y-8">
            {filteredFamilies.map((family) => {
              return (
                <div
                  key={family.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm transition-all"
                >
                  {/* Family Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="font-quran text-3xl sm:text-4xl text-emerald-400 font-bold tracking-widest px-3 py-1 bg-stone-800/80 rounded-xl border border-stone-700"
                          dir="rtl"
                        >
                          {family.rootLettersArabic}
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-stone-100">
                            {family.rootMeaningBengali}
                          </h2>
                          <span className="text-xs text-emerald-300 font-medium flex items-center gap-1 mt-0.5">
                            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
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

                  {/* Derivatives Grid inside Family */}
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
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-block text-[13px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium border border-stone-200">
                                  {word.grammarBengali}
                                </span>
                                {word.frequencyInQuran && (
                                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                                    <Flame className="w-3 h-3 text-amber-500 fill-amber-400" />
                                    প্রায় {word.frequencyInQuran.toLocaleString('bn-BD')} বার
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-stone-900 text-base sm:text-lg pt-1">
                                {word.meaningBengali}
                              </h3>
                            </div>

                            {/* Arabic Word Display */}
                            <div className="text-right flex items-center gap-2 justify-end">
                              <AudioPronounceButton text={word.arabic} label={`"${word.arabic}" এর উচ্চারণ শুনুন`} />
                              <span
                                className="font-quran text-3xl sm:text-4xl text-emerald-950 font-normal leading-relaxed block py-0.5"
                                dir="rtl"
                              >
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
                                    {word.exampleSurahBengali && (
                                      <QuranVerseLink
                                        reference={word.exampleSurahBengali}
                                        className="text-[13px] text-emerald-800 hover:text-emerald-950 font-sans font-medium"
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-start justify-between gap-2 pt-1">
                                    <AudioPronounceButton text={word.quranExample} label="আয়াতের তিলাওয়াত শুনুন" size="sm" />
                                    <p
                                      className="font-quran text-2xl text-emerald-950 leading-relaxed text-right py-1 flex-1"
                                      dir="rtl"
                                    >
                                      {word.quranExample}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-[13px] text-stone-400 hover:text-emerald-700 transition-colors">
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
        ) : (
          /* View Mode 2: Flat List of All Derivative Words sorted directly */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFilteredWords.map((word, index) => {
              const isExpanded = Boolean(expandedCards[word.id]);
              return (
                <div
                  key={word.id}
                  onClick={() => toggleExpand(word.id)}
                  className={`bg-white cursor-pointer transition-all rounded-2xl p-4 sm:p-5 border select-none ${
                    isExpanded
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                      : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      {/* Top Badges: Root & Frequency */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Rank Badge */}
                        <span className="text-[12px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                          #{index + 1}
                        </span>

                        {/* Root Pill */}
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          মূল: <span className="font-quran font-bold text-sm" dir="rtl">{word.rootLettersArabic}</span>
                        </span>

                        {/* Frequency Pill */}
                        {word.frequencyInQuran && (
                          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                            <Flame className="w-3 h-3 text-amber-500 fill-amber-400" />
                            প্রায় {word.frequencyInQuran.toLocaleString('bn-BD')} বার
                          </span>
                        )}
                      </div>

                      <div className="pt-0.5">
                        <span className="inline-block text-[13px] text-stone-500">
                          {word.grammarBengali}
                        </span>
                        <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                          {word.meaningBengali}
                        </h3>
                      </div>
                    </div>

                    {/* Arabic Word Display */}
                    <div className="text-right flex items-center gap-2 justify-end">
                      <AudioPronounceButton text={word.arabic} label={`"${word.arabic}" এর উচ্চারণ শুনুন`} />
                      <span
                        className="font-quran text-3xl sm:text-4xl text-emerald-950 font-normal leading-relaxed block py-0.5"
                        dir="rtl"
                      >
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
                            {word.exampleSurahBengali && (
                              <QuranVerseLink
                                reference={word.exampleSurahBengali}
                                className="text-[13px] text-emerald-800 hover:text-emerald-950 font-sans font-medium"
                              />
                            )}
                          </div>
                          <div className="flex items-start justify-between gap-2 pt-1">
                            <AudioPronounceButton text={word.quranExample} label="আয়াতের তিলাওয়াত শুনুন" size="sm" />
                            <p
                              className="font-quran text-2xl text-emerald-950 leading-relaxed text-right py-1 flex-1"
                              dir="rtl"
                            >
                              {word.quranExample}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[13px] text-stone-400 hover:text-emerald-700 transition-colors">
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
