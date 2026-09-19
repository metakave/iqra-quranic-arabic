'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { awardXp } from '@/lib/gamification';

interface TypedReflectionProps {
  promptBengali: string;
  placeholderBengali: string;
  hintBengali: string;
  modelExplanationBengali: string;
  grammaticalTakeawayBengali: string;
  commonMistakesBengali: string[];
  onComplete?: () => void;
}

export default function TypedReflection({
  promptBengali,
  placeholderBengali,
  hintBengali,
  modelExplanationBengali,
  grammaticalTakeawayBengali,
  commonMistakesBengali,
  onComplete,
}: TypedReflectionProps) {
  const [inputText, setInputText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsSubmitted(true);
    awardXp(15); // +15 XP for deliberate typed reflection
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Question & Prompt */}
      <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
        <p className="text-base text-stone-800 font-semibold mb-2 leading-relaxed">
          {promptBengali}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500">
            বিনা দ্বিধায় লিখুন—ভুল হওয়া শেখার অন্যতম গুরুত্বপূর্ণ ধাপ।
          </span>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'ইঙ্গিত ঢাকুন' : 'ইঙ্গিত দেখুন'}</span>
          </button>
        </div>
        {showHint && (
          <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs text-emerald-900 leading-relaxed">
            💡 <strong>ইঙ্গিত:</strong> {hintBengali}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSubmitted}
            rows={3}
            placeholder={placeholderBengali}
            className="w-full p-4 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 bg-white placeholder:text-stone-400 text-sm leading-relaxed outline-none transition-all disabled:bg-stone-100 disabled:text-stone-700"
          />
        </div>

        {!isSubmitted ? (
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>নিজের মতামত জমা দিন ও মিলিয়ে নিন (+১৫ XP)</span>
          </button>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>আপনার উত্তর জমা হয়েছে! এবার নিচের প্রামাণ্য ব্যাখ্যার সাথে মিলিয়ে নিন।</span>
          </div>
        )}
      </form>

      {/* Step 5: মিলিয়ে নিন (Revealed after submission) */}
      {isSubmitted && (
        <div className="mt-8 space-y-5 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-6 w-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <h4 className="font-bold text-emerald-950 text-base">
                ধাপ ৫: মিলিয়ে নিন (আদর্শ ব্যাখ্যা ও বিশ্লেষণ)
              </h4>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 mb-4 shadow-2xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-1">
                অনুমোদিত বাংলা ভাবার্থ:
              </span>
              <p className="text-base text-stone-900 font-medium leading-relaxed">
                “{modelExplanationBengali}”
              </p>
            </div>

            {/* Grammatical Takeaway */}
            <div className="bg-emerald-100/60 p-4 rounded-xl text-emerald-950 text-sm leading-relaxed mb-4">
              <strong className="block text-emerald-900 mb-1">
                📌 মূল ব্যাকরণিক শিক্ষণীয় (Key Takeaway):
              </strong>
              <p>{grammaticalTakeawayBengali}</p>
            </div>

            {/* Common Mistakes */}
            {commonMistakesBengali.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl text-amber-950 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>সাধারণ ভুল (যা এড়িয়ে চলবেন):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  {commonMistakesBengali.map((mistake, i) => (
                    <li key={i}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
