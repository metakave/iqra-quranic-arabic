'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSRSCards, updateSRSCard, awardXp } from '@/lib/gamification';
import { SRSCard } from '@/types/curriculum';
import { RotateCw, CheckCircle2, XCircle, ArrowLeft, Zap, Sparkles, Clock } from 'lucide-react';
import QuranVerseLink from '@/components/QuranVerseLink';
import AudioPronounceButton from '@/components/AudioPronounceButton';

export default function PracticePage() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setCards(getSRSCards());
  }, []);

  const currentCard = cards[currentIndex];

  const handleReview = (remembered: boolean) => {
    if (!currentCard) return;

    updateSRSCard(currentCard.id, remembered);
    setIsFlipped(false);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setCompletedCount((prev) => prev + 1);
    } else {
      setCompletedCount((prev) => prev + 1);
      setIsFinished(true);
      awardXp(30); // +30 XP for 30-min independent practice
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ড্যাশবোর্ডে ফিরুন</span>
          </Link>

          <div className="flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>দৈনিক ৩০ মিনিটের পুনরাবৃত্তি (SRS)</span>
          </div>
        </div>

        {/* Practice Routine Card */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>অগ্রগতি: {completedCount} / {cards.length} কার্ড</span>
            <span>ব্যবধান পদ্ধতি: ১ → ৩ → ৭ → ১৪ → ৩০ দিন</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{
                width: `${cards.length ? (completedCount / cards.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {!isFinished && currentCard ? (
          <div className="space-y-6">
            {/* Flip Flashcard */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[320px] bg-white rounded-3xl p-8 border border-stone-200 shadow-md hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between text-center relative overflow-hidden"
            >
              <div className="flex justify-between items-center text-xs text-stone-400 font-sans">
                <span>স্মরণ ব্যবধান: {currentCard.intervalDays} দিন পর পর</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>উল্টাতে ট্যাপ করুন</span>
                </span>
              </div>

              {/* Arabic Phrase */}
              <div className="py-6 space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="font-quran text-5xl sm:text-6xl text-stone-900 font-normal leading-loose">
                    {currentCard.arabicPhrase}
                  </div>
                  <AudioPronounceButton text={currentCard.arabicPhrase} size="md" label="উচ্চারণ শুনুন" />
                </div>
                <div className="text-xs text-stone-500 font-sans">
                  <QuranVerseLink
                    reference={currentCard.reference}
                    className="text-stone-500 hover:text-emerald-700 font-medium transition-colors"
                  />
                </div>
              </div>

              {/* Backside content (Revealed on flip) */}
              <div className="min-h-[90px] border-t border-stone-100 pt-4">
                {isFlipped ? (
                  <div className="space-y-1 animate-fadeIn">
                    <h3 className="text-xl font-bold text-emerald-950">
                      {currentCard.bengaliMeaning}
                    </h3>
                    <p className="text-[17px] text-stone-700 leading-relaxed pt-1.5">
                      💡 <strong className="font-bold text-stone-900">নোট:</strong> {currentCard.attachmentNoteBengali}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-stone-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>অর্থ ও ব্যাকরণ দেখতে কার্ডে ট্যাপ করুন</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleReview(false)}
                className="p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 border border-stone-300 transition-colors"
              >
                <XCircle className="w-4 h-4 text-red-500" />
                <span>মনে পড়ছে না (পুনরায় শুরু)</span>
              </button>

              <button
                type="button"
                onClick={() => handleReview(true)}
                className="p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>মনে আছে (ব্যবধান বৃদ্ধি)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Finished State */
          <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-lg space-y-5">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl">
              ✓
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-stone-900">
                আজকের ৩০ মিনিটের অনুশীলন সম্পন্ন!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                আপনি সফলভাবে আজকের নির্ধারিত কুরআনিক শব্দ ও সংযুক্ত রূপগুলো পর্যালোচনা করেছেন।
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl inline-flex items-center gap-2 text-emerald-800 font-bold text-base">
              <Zap className="w-5 h-5 fill-emerald-600" />
              <span>+৩০ XP অর্জিত হয়েছে!</span>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm inline-block shadow-md transition-colors"
              >
                পাঠশালা ড্যাশবোর্ডে ফিরুন
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
