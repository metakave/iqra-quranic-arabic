'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

const BENGALI_DIGITS: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export function bengaliToEnglishNumber(input: string | number): string {
  return String(input).replace(/[০-৯]/g, (char) => BENGALI_DIGITS[char] ?? char);
}

export function buildQuranComUrl(surah: number | string, ayah: number | string): string {
  const cleanSurah = parseInt(bengaliToEnglishNumber(surah), 10);
  const cleanAyah = parseInt(bengaliToEnglishNumber(ayah), 10);
  return `https://quran.com/${cleanSurah}/${cleanAyah}`;
}

export interface ParsedVerseMatch {
  raw: string;
  index: number;
  length: number;
  surah: number;
  ayah: number;
  url: string;
}

export function parseQuranVerseReferences(text: string): ParsedVerseMatch[] {
  const REF_REGEX = /([০-৯\d]+)\s*[:ঃ]\s*([০-৯\d]+)(?:[–-]([০-৯\d]+))?/g;
  const matches: ParsedVerseMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = REF_REGEX.exec(text)) !== null) {
    const surah = parseInt(bengaliToEnglishNumber(match[1]), 10);
    const ayah = parseInt(bengaliToEnglishNumber(match[2]), 10);

    // Surahs: 1 to 114, Ayahs: 1 to 286 (Al-Baqarah has max 286 ayahs)
    if (!isNaN(surah) && !isNaN(ayah) && surah >= 1 && surah <= 114 && ayah >= 1 && ayah <= 286) {
      matches.push({
        raw: match[0],
        index: match.index,
        length: match[0].length,
        surah,
        ayah,
        url: `https://quran.com/${surah}/${ayah}`,
      });
    }
  }

  return matches;
}

interface QuranVerseLinkProps {
  surah?: number | string;
  ayah?: number | string;
  reference?: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export default function QuranVerseLink({
  surah,
  ayah,
  reference,
  children,
  className = '',
  showIcon = true,
}: QuranVerseLinkProps) {
  // Case 1: Direct Surah and Ayah numbers provided
  if (surah !== undefined && ayah !== undefined) {
    const cleanSurah = parseInt(bengaliToEnglishNumber(surah), 10);
    const cleanAyah = parseInt(bengaliToEnglishNumber(ayah), 10);

    if (!isNaN(cleanSurah) && !isNaN(cleanAyah)) {
      const url = `https://quran.com/${cleanSurah}/${cleanAyah}`;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1 hover:underline transition-colors ${className}`}
          title={`Quran.com এ সূরা ${cleanSurah}, আয়াত ${cleanAyah} দেখুন`}
        >
          {children ? <span>{children}</span> : <span>{surah}:{ayah}</span>}
          {showIcon && <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />}
        </a>
      );
    }
  }

  // Case 2: Reference string provided (or children string)
  const textContent = reference ?? (typeof children === 'string' ? children : '');

  if (textContent) {
    const matches = parseQuranVerseReferences(textContent);

    // No valid Quran reference pattern found -> render as-is
    if (matches.length === 0) {
      return <span className={className}>{children ?? textContent}</span>;
    }

    // Exactly 1 reference found and no custom children -> make entire badge clickable
    if (matches.length === 1 && !children) {
      const single = matches[0];
      return (
        <a
          href={single.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1 hover:underline transition-colors ${className}`}
          title={`Quran.com এ সূরা ${single.surah}, আয়াত ${single.ayah} দেখুন`}
        >
          <span>{textContent}</span>
          {showIcon && <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />}
        </a>
      );
    }

    // Multiple references found in string (or children provided) -> link each reference
    const segments: React.ReactNode[] = [];
    let lastIdx = 0;

    matches.forEach((m, idx) => {
      if (m.index > lastIdx) {
        segments.push(textContent.slice(lastIdx, m.index));
      }
      segments.push(
        <a
          key={`quran-ref-${idx}-${m.surah}-${m.ayah}`}
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-0.5 text-emerald-700 hover:text-emerald-900 underline font-medium transition-colors"
          title={`Quran.com এ সূরা ${m.surah}, আয়াত ${m.ayah} দেখুন`}
        >
          <span>{m.raw}</span>
          {showIcon && <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />}
        </a>
      );
      lastIdx = m.index + m.length;
    });

    if (lastIdx < textContent.length) {
      segments.push(textContent.slice(lastIdx));
    }

    return <span className={className}>{segments}</span>;
  }

  // Fallback
  return <span className={className}>{children}</span>;
}
