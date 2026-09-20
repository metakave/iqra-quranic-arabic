'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LessonContent } from '@/types/curriculum';
import ChunkBreakdown from '@/components/ChunkBreakdown';
import TypedReflection from '@/components/TypedReflection';
import StreakCelebration from '@/components/StreakCelebration';
import QuranVerseLink from '@/components/QuranVerseLink';
import { completeLesson } from '@/lib/gamification';
import {
  ArrowLeft,
  Award,
  Clock,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

interface LessonClientProps {
  lesson: LessonContent;
  lessonId?: string;
}

export default function LessonClient({ lesson }: LessonClientProps) {

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [contrastChoice, setContrastChoice] = useState<'A' | 'B' | null>(null);
  const [transferRevealed, setTransferRevealed] = useState(false);
  const [showPreCheck, setShowPreCheck] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedXp, setEarnedXp] = useState(50);
  const [currentStreak, setCurrentStreak] = useState(3);

  const stepsList = [
    { num: 1, label: 'দেখুন', desc: 'আয়াত পাঠ' },
    { num: 2, label: 'ভাঙুন', desc: 'অংশ বিশ্লেষণ' },
    { num: 3, label: 'জোড়া দিন', desc: 'সম্পর্ক ও নতুন প্রয়োগ' },
    { num: 4, label: 'বলুন ও মেলান', desc: 'নিজের ভাষায় অর্থ' },
    { num: 5, label: 'মূল্যায়ন', desc: 'পাঠশেষের ৫ প্রশ্ন' },
  ];

  const handleFinishLesson = () => {
    const updated = completeLesson(lesson.id, lesson.xpReward);
    setEarnedXp(lesson.xpReward);
    setCurrentStreak(updated.streakDays);
    setShowCelebration(true);
  };

  const handleAnswerSelect = (exerciseId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseId]: optionIndex,
    }));
  };

  const nextLessonMap: Record<string, string> = {
    'module-01-lesson-01': 'module-01-lesson-02',
    'module-01-lesson-02': 'module-01-lesson-03',
    'module-01-lesson-03': 'module-01-lesson-04',
    'module-01-lesson-04': 'module-01-lesson-05',
    'module-01-lesson-05': 'module-02-lesson-06',
    'module-02-lesson-06': 'module-02-lesson-07',
    'module-02-lesson-07': 'module-02-lesson-08',
    'module-02-lesson-08': 'module-02-lesson-09',
    'module-02-lesson-09': 'module-02-lesson-10',
    'module-02-lesson-10': 'module-03-lesson-11',
    'module-03-lesson-11': 'module-03-lesson-12',
    'module-03-lesson-12': 'module-03-lesson-13',
    'module-03-lesson-13': 'module-03-lesson-14',
    'module-03-lesson-14': 'module-03-lesson-15',
    'module-03-lesson-15': 'module-04-lesson-16',
    'module-04-lesson-16': 'module-04-lesson-17',
    'module-04-lesson-17': 'module-04-lesson-18',
    'module-04-lesson-18': 'module-04-lesson-19',
    'module-04-lesson-19': 'module-04-lesson-20',
    'module-04-lesson-20': 'module-05-lesson-21',
    'module-05-lesson-21': 'module-05-lesson-22',
    'module-05-lesson-22': 'module-05-lesson-23',
    'module-05-lesson-23': 'module-05-lesson-24',
    'module-05-lesson-24': 'module-05-lesson-25',
    'module-05-lesson-25': 'module-06-lesson-26',
    'module-06-lesson-26': 'module-06-lesson-27',
    'module-06-lesson-27': 'module-06-lesson-28',
    'module-06-lesson-28': 'module-06-lesson-29',
    'module-06-lesson-29': 'module-06-lesson-30',
    'module-06-lesson-30': 'module-07-lesson-31',
    'module-07-lesson-31': 'module-07-lesson-32',
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Progress & Lesson Breadcrumb */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm sm:text-base text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ড্যাশবোর্ডে ফিরুন</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
              মডিউল {lesson.moduleNumber} • পাঠ {lesson.lessonNumber}
            </span>
            <span className="text-sm text-stone-500 hidden sm:flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>পরিকল্পিত {lesson.estimatedMinutes} মিনিট</span>
            </span>
          </div>
        </div>

        {/* 5-Step Progress Indicators */}
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
          {stepsList.map((step) => {
            const isActive = activeStep === step.num;
            const isDone = activeStep > step.num;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`flex-1 min-w-[75px] py-2 px-2.5 rounded-xl text-center transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-sans">{step.num}.</span>
                  <span className="text-sm">{step.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Lesson Header Banner */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2.5">
            <div className="flex items-center gap-2">
              <QuranVerseLink
                surah={lesson.anchorAyah.surahNumber}
                ayah={lesson.anchorAyah.ayahNumber}
                className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold uppercase tracking-wider"
              >
                {lesson.anchorAyah.surahNameBengali} ({lesson.anchorAyah.surahNumber}:{lesson.anchorAyah.ayahNumber})
              </QuranVerseLink>
              <span className="text-sm text-stone-400">•</span>
              <span className="text-sm text-stone-300">
                পদ্ধতি: দেখুন → ভাঙুন → জোড়া দিন → বলুন → মিলিয়ে নিন
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
              {lesson.titleBengali}
            </h1>
            <p className="text-base sm:text-[17px] text-stone-200 max-w-2xl leading-relaxed">
              {lesson.subtitleBengali}
            </p>
          </div>
        </div>

        {/* Optional Pre-check Diagnostic (পর্দা ৩: শেখার আগের ছোট যাচাই) */}
        {lesson.preCheck && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowPreCheck(!showPreCheck)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                  ?
                </span>
                <span className="font-bold text-base text-stone-800">
                  শেখার আগের ছোট যাচাই (ঐচ্ছিক প্রাক-মূল্যায়ন)
                </span>
              </div>
              {showPreCheck ? (
                <ChevronUp className="w-5 h-5 text-stone-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-400" />
              )}
            </button>

            {showPreCheck && (
              <div className="p-5 border-t border-stone-100 bg-stone-50/60 space-y-4 animate-fadeIn">
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {lesson.preCheck.promptBengali}
                </p>

                <div className="p-4 rounded-xl bg-white border border-stone-200 text-center space-y-1">
                  <div className="font-quran text-4xl sm:text-[42px] text-emerald-950 leading-relaxed">
                    {lesson.preCheck.diagnosticAyah.arabicText}
                  </div>
                  <div className="text-sm text-stone-500 font-sans">
                    <QuranVerseLink
                      reference={lesson.preCheck.diagnosticAyah.referenceBengali}
                      className="text-emerald-700 hover:text-emerald-900 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-sm sm:text-[15px] text-stone-700 bg-amber-50/70 p-4 rounded-xl border border-amber-200/60">
                  <span className="font-bold block text-amber-900 mb-1.5 text-sm sm:text-base">
                    নিজেকে প্রশ্ন করুন (নম্বর কাটার বিষয় নেই):
                  </span>
                  {lesson.preCheck.diagnosticAyah.guidingQuestions.map((q, i) => (
                    <p key={i}>{q}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Content based on Active Step */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
          {/* STEP 1: দেখুন (Look/Read) */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  ধাপ ১ • দেখুন (সরাসরি আরবি পাঠ)
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-1">
                  আয়াতটি মনোযোগ দিয়ে পড়ুন
                </h2>
                <p className="text-base text-stone-600 mt-1">
                  {lesson.steps.dekhun.promptBengali}
                </p>
              </div>

              {/* Uncut Quranic Verse Display */}
              <div className="quran-verse-card p-8 text-center my-6">
                <div className="font-quran text-4xl sm:text-5xl text-stone-900 mb-4 leading-loose">
                  {lesson.steps.dekhun.arabicText}
                </div>
                <div className="text-sm text-stone-500 flex items-center justify-center gap-1.5 font-sans">
                  <span>কুরআন শরীফ •</span>
                  <QuranVerseLink
                    surah={lesson.anchorAyah.surahNumber}
                    ayah={lesson.anchorAyah.ayahNumber}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
                  >
                    {lesson.anchorAyah.surahNameBengali} ({lesson.anchorAyah.surahNumber}:{lesson.anchorAyah.ayahNumber})
                  </QuranVerseLink>
                </div>
              </div>

              {/* Guiding Question */}
              <div className="p-4.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 text-base">
                    চিন্তার সূত্র (Guiding Question):
                  </h4>
                  <p className="text-stone-700 text-base mt-1 leading-relaxed">
                    {lesson.steps.dekhun.guidingQuestionBengali}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base transition-colors"
                >
                  পরবর্তী ধাপ: ভাঙুন (৩টি অংশ বিশ্লেষণ) →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ভাঙুন (Chunk Breakdown) */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  ধাপ ২ • ভাঙুন (অর্থপূর্ণ অংশ বিশ্লেষণ)
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-1">
                  টুকরো চিনে অর্থ বুঝুন
                </h2>
                <p className="text-base text-stone-600 mt-1">
                  {lesson.steps.bhangun.promptBengali}
                </p>
              </div>

              <ChunkBreakdown
                chunks={lesson.steps.bhangun.chunks}
                teachingNoteBengali={lesson.steps.bhangun.teachingNoteBengali}
              />

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50"
                >
                  ← পূর্ববর্তী ধাপ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base transition-colors"
                >
                  পরবর্তী ধাপ: জোড়া দিন (সম্পর্ক ও নতুন প্রয়োগ) →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: জোড়া দিন & নতুন অংশে প্রয়োগ (Connectors & Transfer Application) */}
          {activeStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  ধাপ ৩ • জোড়া দিন (অংশ জুড়ে পূর্ণ অর্থ ও নতুন প্রয়োগ)
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-1">
                  অংশগুলো কীভাবে পরস্পরের সাথে সম্পর্কিত?
                </h2>
                <p className="text-base text-stone-600 mt-1">
                  {lesson.steps.judun.promptBengali}
                </p>
              </div>

              {/* Relationship Connectors */}
              <div className="space-y-3.5">
                {lesson.steps.judun.connectors.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="font-quran text-2xl sm:text-3xl text-emerald-950 font-normal py-0.5 leading-relaxed" dir="rtl">
                      {c.fromText}
                    </div>
                    <div className="text-stone-800 text-sm sm:text-base bg-white px-3.5 py-2 rounded-xl border border-stone-200 font-medium">
                      💡 {c.relationshipBengali}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contrast Check (বিভ্রান্তি দূরীকরণ) */}
              {lesson.steps.judun.contrastCheck && (
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                    <Sparkles className="w-4.5 h-4.5 text-amber-600" />
                    <span>অর্থের সূক্ষ্ম পার্থক্য যাচাই:</span>
                  </div>
                  <p className="text-sm sm:text-base text-stone-800">
                    {lesson.steps.judun.contrastCheck.prompt}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setContrastChoice('A')}
                      className={`p-3.5 rounded-xl border text-sm sm:text-base text-left font-medium transition-all ${
                        contrastChoice === 'A'
                          ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-xs'
                          : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
                      }`}
                    >
                      {lesson.steps.judun.contrastCheck.optionA}
                    </button>

                    <button
                      type="button"
                      onClick={() => setContrastChoice('B')}
                      className={`p-3.5 rounded-xl border text-sm sm:text-base text-left font-medium transition-all ${
                        contrastChoice === 'B'
                          ? 'bg-amber-700 text-white border-amber-800 font-bold shadow-xs'
                          : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
                      }`}
                    >
                      {lesson.steps.judun.contrastCheck.optionB}
                    </button>
                  </div>

                  {contrastChoice && (
                    <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-sm sm:text-base text-stone-700 leading-relaxed animate-fadeIn">
                      <strong>ফলাফল: </strong>
                      {contrastChoice === lesson.steps.judun.contrastCheck.correctOption ? (
                        <span className="text-emerald-800 font-bold">✓ সঠিক! </span>
                      ) : (
                        <span className="text-amber-800 font-bold">পুনরায় ভাবুন: </span>
                      )}
                      {lesson.steps.judun.contrastCheck.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Transfer Application Widget (পর্দা ৯ • নতুন অংশে প্রয়োগ) */}
              {lesson.steps.transferApplication && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border border-emerald-300 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                      {lesson.steps.transferApplication.titleBengali}
                    </span>
                    <span className="text-sm text-stone-500 font-sans">
                      <QuranVerseLink
                        reference={lesson.steps.transferApplication.referenceBengali}
                        className="text-emerald-800 hover:text-emerald-950 font-medium"
                      />
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center">
                    <div className="font-quran text-4xl sm:text-5xl text-emerald-950 font-normal py-1 leading-relaxed">
                      {lesson.steps.transferApplication.arabicText}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-stone-700">
                    {lesson.steps.transferApplication.promptBengali}
                  </p>

                  {/* Vocabulary assistance cards */}
                  <div className="grid grid-cols-3 gap-2 text-center" dir="rtl">
                    {lesson.steps.transferApplication.vocabularySupport.map((v, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-emerald-200 text-center"
                      >
                        <span className="font-quran text-2xl text-emerald-900 block leading-relaxed">
                          {v.arabic}
                        </span>
                        <span className="text-sm text-stone-700 font-sans block mt-1 font-medium" dir="ltr">
                          = {v.meaningBengali}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    {!transferRevealed ? (
                      <button
                        type="button"
                        onClick={() => setTransferRevealed(true)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs"
                      >
                        উত্তর দেখুন (আসমানসমূহ ও পৃথিবীর রব)
                      </button>
                    ) : (
                      <div className="p-4 bg-white rounded-2xl border border-emerald-300 text-base sm:text-lg text-emerald-950 font-bold animate-fadeIn">
                        ✓ সমাধান: “{lesson.steps.transferApplication.solutionBengali}”
                        <div className="text-base sm:text-lg font-normal text-stone-700 mt-2.5 space-y-2 leading-relaxed">
                          {(lesson.steps.transferApplication.teachingNoteBengali.includes('\n')
                            ? lesson.steps.transferApplication.teachingNoteBengali.split('\n')
                            : lesson.steps.transferApplication.teachingNoteBengali
                                .split(/(?=\s+(?:[১-৯]|\d+)\.\s+)/)
                                .map((s) => s.trim())
                                .filter(Boolean)
                          ).map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50"
                >
                  ← পূর্ববর্তী ধাপ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base transition-colors"
                >
                  পরবর্তী ধাপ: বলুন ও মেলান →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: বলুন ও মিলিয়ে নিন (Typed reflection) */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  ধাপ ৪ ও ৫ • বলুন ও মিলিয়ে নিন
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-1">
                  নিজের ভাষায় অর্থ লিখুন
                </h2>
                <p className="text-base text-stone-600 mt-1">
                  অনুবাদ না দেখে, আরবির তিনটি অংশের সম্পর্ক জুড়ে দিয়ে নিজের ভাষায় অর্থ সংক্ষেপে লিখুন।
                </p>
              </div>

              <TypedReflection
                promptBengali={lesson.steps.bolun.promptBengali}
                placeholderBengali={lesson.steps.bolun.placeholderBengali}
                hintBengali={lesson.steps.bolun.hintBengali}
                modelExplanationBengali={lesson.steps.miliyeNin.modelExplanationBengali}
                grammaticalTakeawayBengali={lesson.steps.miliyeNin.grammaticalTakeawayBengali}
                commonMistakesBengali={lesson.steps.miliyeNin.commonMistakesBengali}
              />

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50"
                >
                  ← পূর্ববর্তী ধাপ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base transition-colors"
                >
                  পরবর্তী ধাপ: পাঠশেষের ৫ প্রশ্ন →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: পাঠশেষের ৫ প্রশ্ন ও মূল্যায়ন */}
          {activeStep === 5 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                  পাঠশেষের মূল্যায়ন • ৫ প্রশ্ন
                </span>
                <h2 className="text-2xl font-bold text-stone-900 mt-1">
                  আজকের পাঠের জ্ঞান যাচাই
                </h2>
                <p className="text-base text-stone-600 mt-1">
                  প্রতিটি প্রশ্নের উত্তর দিন। ৪–৫টি সঠিক হলে আপনি পরবর্তী পাঠের জন্য প্রস্তুত।
                </p>
              </div>

              <div className="space-y-6">
                {lesson.practiceExercises.map((exercise, idx) => {
                  const selected = selectedAnswers[exercise.id];
                  const hasAnswered = selected !== undefined;
                  const isCorrect = selected === exercise.correctAnswerIndex;

                  return (
                    <div
                      key={exercise.id}
                      className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-500 uppercase">
                          প্রশ্ন {idx + 1}
                        </span>
                        {hasAnswered && (
                          <span
                            className={`text-sm font-bold px-2.5 py-1 rounded-md ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isCorrect ? '✓ সঠিক উত্তর' : '✗ পুনরায় দেখুন'}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                        {exercise.questionBengali}
                      </h4>

                      {exercise.arabicPrompt && (
                        <div className="font-quran text-3xl sm:text-[38px] text-emerald-950 p-3.5 bg-white rounded-xl border border-stone-200 inline-block leading-relaxed">
                          {exercise.arabicPrompt}
                        </div>
                      )}

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {exercise.options?.map((opt, optIdx) => {
                          const isOptSelected = selected === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleAnswerSelect(exercise.id, optIdx)}
                              className={`p-3.5 rounded-xl border text-sm sm:text-base text-left font-medium transition-all ${
                                isOptSelected
                                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-semibold'
                                  : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                              }`}
                            >
                              <span className="font-sans font-semibold mr-2">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className="p-3.5 rounded-xl bg-stone-100 text-sm sm:text-base text-stone-700 leading-relaxed">
                          💡 <strong>ব্যাখ্যা:</strong> {exercise.explanationBengali}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Error Diagnosis Help Table (ভুল অনুযায়ী ছোট সহায়তা) */}
              {lesson.errorDiagnosisTable && (
                <div className="p-5 sm:p-6 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-3.5">
                  <div className="flex items-center gap-2 text-stone-800 font-bold text-base">
                    <AlertCircle className="w-5 h-5 text-emerald-700" />
                    <span>ভুল অনুযায়ী শিক্ষকের ছোট সহায়তা নির্দেশিকা:</span>
                  </div>

                  <div className="divide-y divide-stone-200 text-sm sm:text-base">
                    {lesson.errorDiagnosisTable.map((d, i) => (
                      <div key={i} className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <span className="font-semibold text-stone-700">
                          ভুল ধারণা: {d.misconceptionBengali}
                        </span>
                        <span className="text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md">
                          পরামর্শ: {d.teacherFeedbackBengali}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Lesson CTA */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm sm:text-base text-stone-600">
                  সম্পূর্ণ পাঠ শেষ করলে <strong className="text-emerald-700">+{lesson.xpReward} XP</strong> অর্জন করবেন।
                </div>

                <button
                  type="button"
                  onClick={handleFinishLesson}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Award className="w-5 h-5 text-amber-300" />
                  <span>পাঠ সম্পন্ন করুন (+{lesson.xpReward} XP)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gamification Confetti Modal */}
      <StreakCelebration
        isOpen={showCelebration}
        xpEarned={earnedXp}
        streakDays={currentStreak}
        onClose={() => setShowCelebration(false)}
        nextLessonId={nextLessonMap[lesson.id]}
      />
    </div>
  );
}
