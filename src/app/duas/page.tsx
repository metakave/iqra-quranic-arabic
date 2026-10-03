'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  QURAN_SUPPLICATIONS,
  SUPPLICATION_CATEGORIES,
  SUPPLICATION_TYPES,
  QuranSupplication,
} from '@/data/quranSupplications';
import AudioPronounceButton from '@/components/AudioPronounceButton';
import QuranVerseLink from '@/components/QuranVerseLink';
import {
  Search,
  Filter,
  Bookmark,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Eye,
  RotateCcw,
  ArrowUpDown,
  Info,
  Layers,
} from 'lucide-react';

export default function DuasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSurah, setSelectedSurah] = useState<string>('all');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('iqra_quran_supplications_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [expandedAnalysisIds, setExpandedAnalysisIds] = useState<string[]>([]);
  const [revealedChunkKeys, setRevealedChunkKeys] = useState<Record<string, number[]>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const listTopRef = useRef<HTMLDivElement>(null);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('iqra_quran_supplications_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleAnalysis = (id: string) => {
    setExpandedAnalysisIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllAnalysis = (expand: boolean) => {
    if (expand) {
      setExpandedAnalysisIds(paginatedDuas.map((d) => d.id));
    } else {
      setExpandedAnalysisIds([]);
    }
  };

  const toggleChunk = (duaId: string, chunkIdx: number) => {
    setRevealedChunkKeys((prev) => {
      const current = prev[duaId] || [];
      const next = current.includes(chunkIdx)
        ? current.filter((i) => i !== chunkIdx)
        : [...current, chunkIdx];
      return { ...prev, [duaId]: next };
    });
  };

  const toggleAllChunksForDua = (dua: QuranSupplication) => {
    const current = revealedChunkKeys[dua.id] || [];
    const allIndices = dua.chunks.map((_, i) => i);
    const areAllRevealed = current.length === dua.chunks.length;

    setRevealedChunkKeys((prev) => ({
      ...prev,
      [dua.id]: areAllRevealed ? [] : allIndices,
    }));
  };

  const handleCopy = (dua: QuranSupplication, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${dua.arabicText}\n\n"${dua.bengaliTranslation}"\n— [সূরা ${dua.surahNameBengali} ${dua.surahNumber}:${dua.ayahNumber}]\n\nউৎস: ইক্বরা কোরানের আরবী (IQRA Quranic Arabic)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Surah list for dropdown filter
  const uniqueSurahs = useMemo(() => {
    const map = new Map<number, { number: number; nameBengali: string; nameArabic: string }>();
    QURAN_SUPPLICATIONS.forEach((d) => {
      if (!map.has(d.surahNumber)) {
        map.set(d.surahNumber, {
          number: d.surahNumber,
          nameBengali: d.surahNameBengali,
          nameArabic: d.surahNameArabic,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.number - b.number);
  }, []);

  // Filtered and Sorted supplications
  const filteredDuas = useMemo(() => {
    return QURAN_SUPPLICATIONS.filter((dua) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = SUPPLICATION_CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj && catObj.label !== 'all' && dua.category !== catObj.label) {
          return false;
        }
      }

      // Supplication type filter (Rabbana, Rabbi, Other)
      if (selectedType !== 'all' && dua.supplicationType !== selectedType) {
        return false;
      }

      // Surah filter
      if (selectedSurah !== 'all' && dua.surahNumber !== parseInt(selectedSurah, 10)) {
        return false;
      }

      // Bookmark filter
      if (onlyBookmarked && !bookmarkedIds.includes(dua.id)) {
        return false;
      }

      // Text query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesArabic = dua.arabicText.includes(q);
        const matchesTranslation = dua.bengaliTranslation.toLowerCase().includes(q);
        const matchesSurah = dua.surahNameBengali.toLowerCase().includes(q) || dua.surahNameArabic.includes(q);
        const matchesRef = `${dua.surahNumber}:${dua.ayahNumber}`.includes(q);
        const matchesGrammar =
          dua.grammarExplanation.coreBreakdownBengali.toLowerCase().includes(q) ||
          dua.grammarExplanation.whyItMeansWhatItMeansBengali.toLowerCase().includes(q) ||
          dua.grammarExplanation.lessonLinks.some((l) => l.toLowerCase().includes(q));

        return matchesArabic || matchesTranslation || matchesSurah || matchesRef || matchesGrammar;
      }

      return true;
    }).sort((a, b) => {
      if (sortAscending) {
        if (a.surahNumber !== b.surahNumber) return a.surahNumber - b.surahNumber;
        return a.ayahNumber - b.ayahNumber;
      } else {
        if (a.surahNumber !== b.surahNumber) return b.surahNumber - a.surahNumber;
        return b.ayahNumber - a.ayahNumber;
      }
    });
  }, [selectedCategory, selectedType, selectedSurah, onlyBookmarked, bookmarkedIds, searchQuery, sortAscending]);

  // Paginated records
  const totalPages = Math.ceil(filteredDuas.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedDuas =
    pageSize === -1
      ? filteredDuas
      : filteredDuas.slice((safeCurrentPage - 1) * pageSize, (safeCurrentPage - 1) * pageSize + pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    setCurrentPage(1);
  };

  const handleSurahChange = (val: string) => {
    setSelectedSurah(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedSurah('all');
    setOnlyBookmarked(false);
    setSortAscending(true);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Banner / Hero Header */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-850 to-emerald-950 text-white py-12 sm:py-16 px-4 border-b border-stone-800">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb & Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-400">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                মূলপাতা
              </Link>
              <span>/</span>
              <span className="text-emerald-400 font-medium">কুরআনের দোয়া ও ব্যাকরণ</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-700/60 px-3.5 py-1 rounded-full text-xs text-emerald-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>মডিউল ৭ • অনুরোধ, দোয়া ও নির্দেশের বাস্তব পাঠশালা</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 font-bengali">
              কুরআনের দোয়া ও ব্যাকরণিক বিশ্লেষণ
            </h1>
            <p className="text-base sm:text-lg text-emerald-300/90 font-medium max-w-3xl leading-relaxed">
              পবিত্র কুরআনের অধ্যায় ও আয়াত ক্রমানুসারে সাজানো ৭৫টি শ্রেষ্ঠ মুনাজাত ও প্রার্থনার অর্থপূর্ণ খণ্ড,
              শব্দের ব্যাকরণিক ভূমিকা এবং পাঠমালার আলোকে “কেন এমন অর্থ হলো” তার সুনির্দিষ্ট পাঠোদ্ধার।
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400 font-sans">{QURAN_SUPPLICATIONS.length}টি</div>
              <div className="text-xs text-stone-300 font-medium">মোট সংকলিত দোয়া</div>
            </div>
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-amber-400 font-sans">
                {QURAN_SUPPLICATIONS.filter((d) => d.supplicationType === 'rabbana').length}টি
              </div>
              <div className="text-xs text-stone-300 font-medium">রব্বানা (رَبَّنَا) মুনাজাত</div>
            </div>
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-sky-400 font-sans">
                {QURAN_SUPPLICATIONS.filter((d) => d.supplicationType === 'rabbi').length}টি
              </div>
              <div className="text-xs text-stone-300 font-medium">নবীদের রব্বি (رَبِّ) আরজি</div>
            </div>
            <div className="bg-stone-850/80 border border-stone-700/70 p-3.5 rounded-xl">
              <div className="text-2xl font-bold text-purple-400 font-sans">১ → ১১৪</div>
              <div className="text-xs text-stone-300 font-medium">অধ্যায় ও আয়াত ক্রম</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6" ref={listTopRef}>
        {/* Search, Filter Bar and Bookmarks */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          {/* Top Row: Search Input + Surah Dropdown + Bookmark toggle */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="আরবি আয়াত, বাংলা অর্থ, ব্যাকরণ বা সূরা খুঁজুন (যেমন: ২:২০১, সবর, ক্ষমা, আ-তিনা)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-800 placeholder-stone-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200/60 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Surah Dropdown Filter */}
            <div className="w-full md:w-56 shrink-0">
              <select
                value={selectedSurah}
                onChange={(e) => handleSurahChange(e.target.value)}
                aria-label="নির্দিষ্ট সূরা ফিল্টার করুন"
                className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">📖 সমস্ত সূরা ({uniqueSurahs.length}টি)</option>
                {uniqueSurahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    সূরা {s.nameBengali} ({s.number}) - {s.nameArabic}
                  </option>
                ))}
              </select>
            </div>

            {/* Bookmarks Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setOnlyBookmarked(!onlyBookmarked);
                setCurrentPage(1);
              }}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
                onlyBookmarked
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${onlyBookmarked ? 'fill-white' : 'text-amber-600'}`} />
              <span>পছন্দের দোয়া ({bookmarkedIds.length})</span>
            </button>

            {/* Sort Order Button */}
            <button
              type="button"
              onClick={() => {
                setSortAscending(!sortAscending);
                setCurrentPage(1);
              }}
              title="অধ্যায় ও আয়াতের ক্রম পরিবর্তন করুন"
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 transition-all shrink-0 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>{sortAscending ? 'সূরা ১ → ১১৪' : 'সূরা ১১৪ → ১'}</span>
            </button>
          </div>

          {/* Middle Row: Supplication Type Filter (Rabbana / Rabbi / All) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> দোয়ার ধরন:
            </span>
            {SUPPLICATION_TYPES.map((type) => {
              const isActive = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Category Filter Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" /> বিষয়বস্তু:
            </span>
            {SUPPLICATION_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}

            {(searchQuery ||
              selectedCategory !== 'all' ||
              selectedType !== 'all' ||
              selectedSurah !== 'all' ||
              onlyBookmarked) && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 flex items-center gap-1 underline underline-offset-2 ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ফিল্টার মুছুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Bulk Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">
              মোট {filteredDuas.length}টি দোয়া পাওয়া গেছে
            </span>
            {filteredDuas.length > 0 && pageSize !== -1 && (
              <span className="text-stone-400">
                (পৃষ্ঠা {safeCurrentPage} / {totalPages})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Expand / Collapse All Grammatical Analyses */}
            <button
              type="button"
              onClick={() => toggleAllAnalysis(expandedAnalysisIds.length === 0)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>
                {expandedAnalysisIds.length > 0 ? 'সকল ব্যাকরণ ঢাকুন' : 'সকল ব্যাকরণ উন্মুক্ত করুন'}
              </span>
            </button>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500">প্রতি পৃষ্ঠায়:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
                aria-label="প্রতি পৃষ্ঠায় দোয়ার সংখ্যা"
                className="py-1 px-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 cursor-pointer"
              >
                <option value={10}>১০টি</option>
                <option value={20}>২০টি</option>
                <option value={50}>৫০টি</option>
                <option value={-1}>সব ({filteredDuas.length}টি)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredDuas.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-800">কোনো দোয়া পাওয়া যায়নি</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                আপনার খোঁজা শব্দের সাথে কোনো দোয়ার মিল পাওয়া যায়নি। বানান পরিবর্তন করে চেষ্টা করুন অথবা ফিল্টারগুলো মুছে দিন।
              </p>
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* Dua Cards List */}
        <div className="space-y-6">
          {paginatedDuas.map((dua, index) => {
            const globalIndex = sortAscending
              ? (currentPage - 1) * (pageSize === -1 ? 0 : pageSize) + index + 1
              : filteredDuas.length - ((currentPage - 1) * (pageSize === -1 ? 0 : pageSize) + index);

            const isBookmarked = bookmarkedIds.includes(dua.id);
            const isAnalysisExpanded = expandedAnalysisIds.includes(dua.id);
            const revealedChunks = revealedChunkKeys[dua.id] || [];
            const areAllChunksRevealed = revealedChunks.length === dua.chunks.length;

            return (
              <article
                key={dua.id}
                id={dua.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card Header: Meta Badges & Actions */}
                <div className="bg-stone-50/90 border-b border-stone-100 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Rank Badge */}
                    <span className="inline-flex items-center gap-1 bg-stone-800 text-stone-100 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans">
                      #{globalIndex}
                    </span>

                    {/* Surah Reference Badge with Link */}
                    <QuranVerseLink
                      surah={dua.surahNumber}
                      ayah={dua.ayahNumber}
                      className="inline-flex items-center gap-1 bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-300/80 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors"
                    >
                      সূরা {dua.surahNameBengali} ({dua.surahNumber}:{dua.ayahNumber})
                    </QuranVerseLink>

                    {/* Supplication Type Badge */}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        dua.supplicationType === 'rabbana'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : dua.supplicationType === 'rabbi'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-purple-100 text-purple-900 border border-purple-300'
                      }`}
                    >
                      {dua.supplicationType === 'rabbana'
                        ? 'রব্বানা দোয়া'
                        : dua.supplicationType === 'rabbi'
                        ? 'রব্বি আরজি'
                        : 'কুরআনিক প্রার্থনা'}
                    </span>

                    {/* Category Tag */}
                    <span className="text-xs text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-md font-sans">
                      {dua.category}
                    </span>
                  </div>

                  {/* Right Action Icons: Audio, Bookmark, Copy */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Audio Recitation Button */}
                    <AudioPronounceButton
                      text={dua.arabicText}
                      surah={dua.surahNumber}
                      ayah={dua.ayahNumber}
                      size="sm"
                      label={`সূরা ${dua.surahNameBengali} ${dua.surahNumber}:${dua.ayahNumber} তেলাওয়াত শুনুন`}
                    />

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopy(dua, e)}
                      title="আয়াত ও অনুবাদ কপি করুন"
                      className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(dua.id, e)}
                      title={isBookmarked ? 'পছন্দ তালিকা হতে সরান' : 'পছন্দ তালিকায় যুক্ত করুন'}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Body: Arabic Ayah & Bengali Translation */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Arabic Text Display with Tajweed friendly typography */}
                  <div className="relative text-right" dir="rtl">
                    <p className="font-quran text-2xl sm:text-3xl lg:text-[2.1rem] leading-[2.3] text-stone-900 tracking-wide font-normal select-text">
                      {dua.arabicText}
                    </p>
                  </div>

                  {/* Bengali Translation */}
                  <div className="pt-2 border-t border-stone-100">
                    <p className="text-base sm:text-lg text-stone-800 font-bengali leading-relaxed">
                      “{dua.bengaliTranslation}”
                    </p>
                  </div>

                  {/* Interactive Word/Chunk Breakdown Section (ভাঙুন ও বুঝুন) */}
                  <div className="pt-3 space-y-3 bg-stone-50/70 p-4 rounded-xl border border-stone-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-900">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>শব্দভিত্তিক খণ্ড ও ভূমিকা (ভাঙুন ও বুঝুন):</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAllChunksForDua(dua)}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{areAllChunksRevealed ? 'সব অংশ ঢাকুন' : 'সব অংশ উন্মুক্ত করুন'}</span>
                      </button>
                    </div>

                    {/* Horizontal Interactive Chunk Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5" dir="rtl">
                      {dua.chunks.map((chunk, cIdx) => {
                        const isRevealed = revealedChunks.includes(cIdx) || areAllChunksRevealed;

                        const tagColors: Record<string, string> = {
                          emerald: 'bg-emerald-50 border-emerald-300 text-emerald-900',
                          amber: 'bg-amber-50 border-amber-300 text-amber-900',
                          sky: 'bg-sky-50 border-sky-300 text-sky-900',
                          violet: 'bg-purple-50 border-purple-300 text-purple-900',
                        };

                        const colorClass = tagColors[chunk.colorTag || 'emerald'];

                        return (
                          <div
                            key={cIdx}
                            onClick={() => toggleChunk(dua.id, cIdx)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between min-h-[110px] select-none ${
                              isRevealed
                                ? `${colorClass} shadow-xs ring-1 ring-emerald-500/20`
                                : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50/90'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1" dir="ltr">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-600 font-sans">
                                  অংশ {cIdx + 1}
                                </span>
                                <AudioPronounceButton text={chunk.arabicText} size="sm" />
                              </div>
                              <div className="font-quran text-lg sm:text-xl font-bold text-stone-900 leading-normal">
                                {chunk.arabicText}
                              </div>
                            </div>

                            <div className="mt-2 pt-1 border-t border-stone-200/60" dir="ltr">
                              {isRevealed ? (
                                <div className="space-y-0.5">
                                  <div className="text-xs font-semibold text-stone-800">
                                    {chunk.meaningBengali}
                                  </div>
                                  <div className="text-[11px] text-emerald-700 font-medium">
                                    {chunk.roleBengali}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[11px] text-stone-400 font-medium flex items-center justify-center gap-1 py-0.5">
                                  <span>ক্লিক করে ভূমিকা দেখুন</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expandable Deep Grammatical Analysis Drawer (কেন এমন অর্থ হলো?) */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleAnalysis(dua.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                        isAnalysisExpanded
                          ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                          : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className={`w-4 h-4 ${isAnalysisExpanded ? 'text-amber-400' : 'text-emerald-700'}`} />
                        <span>
                          {isAnalysisExpanded
                            ? 'ব্যাকরণিক বিশ্লেষণ সংকুচিত করুন'
                            : 'কেন এমন অর্থ হলো? ব্যাকরণিক রহস্য ও পাঠের সূত্র দেখুন'}
                        </span>
                      </div>
                      <span className="text-xs opacity-80">
                        {isAnalysisExpanded ? '▲ বন্ধ করুন' : '▼ বিস্তারিত দেখুন'}
                      </span>
                    </button>

                    {isAnalysisExpanded && (
                      <div className="mt-3 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50/40 via-white to-stone-50 border border-emerald-200/90 shadow-inner space-y-4">
                        {/* Connected Course Lessons Badges */}
                        <div>
                          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-2">
                            সংশ্লিষ্ট কোর্স পাঠমালা (Lesson Linkage):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {dua.grammarExplanation.lessonLinks.map((linkText, lIdx) => (
                              <span
                                key={lIdx}
                                className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs px-2.5 py-1 rounded-lg font-medium"
                              >
                                <BookOpen className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>{linkText}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Step-by-step grammatical breakdown */}
                        <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>মূল ব্যাকরণিক গঠন (Grammatical Breakdown):</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-bengali">
                            {dua.grammarExplanation.coreBreakdownBengali}
                          </p>
                        </div>

                        {/* Why it means what it means (কেন এমন অর্থ হলো?) */}
                        <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>কেন এমন অর্থ হলো? (Linguistic & Spiritual Wisdom):</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-bengali bg-white/80 p-3.5 rounded-lg border border-emerald-200/50">
                            {dua.grammarExplanation.whyItMeansWhatItMeansBengali}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination Bar */}
        {filteredDuas.length > 0 && pageSize !== -1 && totalPages > 1 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-stone-500">
              পৃষ্ঠা <span className="font-semibold text-stone-800">{currentPage}</span> / {totalPages} •{' '}
              দেখাচ্ছে {(currentPage - 1) * pageSize + 1} থেকে{' '}
              {Math.min(currentPage * pageSize, filteredDuas.length)} পর্যন্ত (মোট {filteredDuas.length}টি)
            </div>

            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>পূর্ববর্তী</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, and pages close to current
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const hasGap = prev && p - prev > 1;

                    return (
                      <React.Fragment key={p}>
                        {hasGap && <span className="px-1 text-xs text-stone-400">...</span>}
                        <button
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === p
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
