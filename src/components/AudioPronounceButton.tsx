'use client';

import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { playArabicSpeech } from '@/lib/arabicSpeech';

interface AudioPronounceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  surah?: number | string;
  ayah?: number | string;
}

export default function AudioPronounceButton({
  text,
  size = 'sm',
  className = '',
  label = 'উচ্চারণ শুনুন',
  surah,
  ayah,
}: AudioPronounceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Safety fallback: ensure isSpeaking resets to false even if browser audio interrupts or fails silently
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isSpeaking) {
      timer = setTimeout(() => {
        setIsSpeaking(false);
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSpeaking]);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text || isSpeaking) return;

    const triggered = playArabicSpeech(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      { surah, ayah }
    );

    if (!triggered) {
      setIsSpeaking(false);
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonPadding = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={isSpeaking}
      title={label}
      aria-label={`${text} - ${label}`}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
        buttonPadding[size]
      } ${
        isSpeaking
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105 ring-2 ring-emerald-400/50 animate-pulse'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 border border-emerald-200/80 hover:scale-105 active:scale-95'
      } ${className}`}
    >
      <Volume2 className={`${iconSizes[size]} ${isSpeaking ? 'animate-bounce' : ''}`} />
    </button>
  );
}
