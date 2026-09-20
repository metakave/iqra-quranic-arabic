import { SRSCard } from '@/types/curriculum';
import { INITIAL_SRS_CARDS } from '@/data/vocabularyBank';

const SRS_STORAGE_KEY = 'quranic_arabic_srs_cards';
const SRS_INTERVALS = [1, 3, 7, 14, 30];

export function getSRSCards(): SRSCard[] {
  if (typeof window === 'undefined') return INITIAL_SRS_CARDS;
  try {
    const saved = localStorage.getItem(SRS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(INITIAL_SRS_CARDS));
      return INITIAL_SRS_CARDS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_SRS_CARDS;
  }
}

export function updateSRSCard(cardId: string, remembered: boolean): void {
  const cards = getSRSCards();
  const index = cards.findIndex((c) => c.id === cardId);
  if (index === -1) return;

  const card = cards[index];
  let nextInterval: number;
  let reps = card.repetitions;

  if (remembered) {
    const currIdx = SRS_INTERVALS.indexOf(card.intervalDays);
    const nextIdx = Math.min(currIdx + 1, SRS_INTERVALS.length - 1);
    nextInterval = SRS_INTERVALS[nextIdx];
    reps += 1;
  } else {
    nextInterval = 1; // reset to day 1 on mistake
  }

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + nextInterval);

  cards[index] = {
    ...card,
    intervalDays: nextInterval,
    repetitions: reps,
    nextReviewDate: targetDate.toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(cards));
  }
}
