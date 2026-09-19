'use client';

import React, { useState } from 'react';
import { Chunk } from '@/types/curriculum';
import { Eye, CheckCircle2, Sparkles } from 'lucide-react';

interface ChunkBreakdownProps {
  chunks: Chunk[];
  teachingNoteBengali: string;
}

export default function ChunkBreakdown({
  chunks,
  teachingNoteBengali,
}: ChunkBreakdownProps) {
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [allRevealed, setAllRevealed] = useState(false);

  const toggleChunk = (idx: number) => {
    if (revealedIndices.includes(idx)) {
      setRevealedIndices(revealedIndices.filter((i) => i !== idx));
    } else {
      const next = [...revealedIndices, idx];
      setRevealedIndices(next);
      if (next.length === chunks.length) {
        setAllRevealed(true);
      }
    }
  };

  const handleRevealAll = () => {
    if (allRevealed) {
      setRevealedIndices([]);
      setAllRevealed(false);
    } else {
      setRevealedIndices(chunks.map((_, i) => i));
      setAllRevealed(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          💡 প্রতিটি আরবি অংশের ওপর স্পর্শ বা ক্লিক করে অর্থ ও ব্যাকরণিক ভূমিকা দেখুন:
        </p>
        <button
          type="button"
          onClick={handleRevealAll}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-4 flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{allRevealed ? 'সব ঢাকুন' : 'সব উন্মুক্ত করুন'}</span>
        </button>
      </div>

      {/* Interactive Horizontal Chunk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" dir="rtl">
        {chunks.map((chunk, idx) => {
          const isRevealed = revealedIndices.includes(idx) || allRevealed;

          const tagColorClasses: Record<string, string> = {
            emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            amber: 'bg-amber-100 text-amber-900 border-amber-300',
            sky: 'bg-sky-100 text-sky-900 border-sky-300',
            violet: 'bg-purple-100 text-purple-900 border-purple-300',
          };

          const activeColor = tagColorClasses[chunk.colorTag || 'emerald'];

          return (
            <div
              key={idx}
              onClick={() => toggleChunk(idx)}
              className={`cursor-pointer transition-all duration-200 rounded-2xl p-4 border text-center select-none flex flex-col justify-between min-h-[160px] ${
                isRevealed
                  ? 'bg-white border-emerald-400 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-stone-100/90 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              {/* Arabic chunk */}
              <div>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-600 font-sans mb-2" dir="ltr">
                  অংশ {idx + 1}
                </span>
                <h3 className="font-quran text-4xl sm:text-[38px] text-emerald-950 font-normal leading-relaxed py-1.5">
                  {chunk.arabicText}
                </h3>
              </div>

              {/* Revealable Bengali Breakdown */}
              <div className="mt-3 pt-3 border-t border-stone-100" dir="ltr">
                {isRevealed ? (
                  <div className="space-y-1.5 animate-fadeIn">
                    <p className="font-bold text-stone-900 text-base">
                      {chunk.meaningBengali}
                    </p>
                    <span
                      className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md border ${activeColor}`}
                    >
                      {chunk.roleBengali}
                    </span>
                  </div>
                ) : (
                  <div className="text-stone-400 text-xs flex items-center justify-center gap-1 py-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>অর্থ দেখতে ট্যাপ করুন</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher's Pedagogical Note */}
      {teachingNoteBengali && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-950 flex items-start gap-3 text-sm leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-900 mb-0.5">
              পর্যবেক্ষণ:
            </span>
            <p className="text-stone-700">{teachingNoteBengali}</p>
          </div>
        </div>
      )}
    </div>
  );
}
