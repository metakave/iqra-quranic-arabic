import { UserProfile } from '@/types/curriculum';

const STORAGE_KEY = 'quranic_arabic_user_profile';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'guest-learner-1',
  name: 'কুরআন শিক্ষার্থী',
  email: 'learner@example.com',
  arabicReadingLevel: 'fluent_decoding',
  dailyTargetMinutes: 30,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXp: 150,
  currentLevel: 2,
  completedLessons: ['module-01-lesson-01'],
  unlockedModule: 24,
  badges: [
    {
      id: 'b-first-step',
      titleBengali: 'প্রথম কদম',
      descriptionBengali: 'প্রথম পাঠ সফলভাবে সম্পন্ন করেছেন',
      icon: '🌱',
      unlockedAt: '2026-09-18',
    },
    {
      id: 'b-streak-3',
      titleBengali: 'ধারাবাহিক প্রচেষ্টা',
      descriptionBengali: 'টানা ৩ দিন কুরআন অনুধাবন অনুশীলন',
      icon: '🔥',
      unlockedAt: '2026-09-19',
    },
  ],
};

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER_PROFILE));
      return DEFAULT_USER_PROFILE;
    }
    const profile: UserProfile = JSON.parse(saved);
    if (!profile.unlockedModule || profile.unlockedModule < 24) {
      profile.unlockedModule = 24;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
    return profile;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}

export function calculateLevel(totalXp: number): { level: number; nextLevelXp: number; currentLevelMinXp: number } {
  // Simple progressive level brackets
  const brackets = [
    { level: 1, min: 0, max: 100 },
    { level: 2, min: 100, max: 250 },
    { level: 3, min: 250, max: 500 },
    { level: 4, min: 500, max: 850 },
    { level: 5, min: 850, max: 1300 },
    { level: 6, min: 1300, max: 1900 },
    { level: 7, min: 1900, max: 2600 },
    { level: 8, min: 2600, max: 3500 },
    { level: 9, min: 3500, max: 4600 },
    { level: 10, min: 4600, max: 6000 },
  ];

  for (const b of brackets) {
    if (totalXp < b.max) {
      return { level: b.level, nextLevelXp: b.max, currentLevelMinXp: b.min };
    }
  }

  return { level: 10, nextLevelXp: 10000, currentLevelMinXp: 4600 };
}

export function awardXp(amount: number): UserProfile {
  const profile = getUserProfile();
  const today = new Date().toISOString().split('T')[0];

  // Update streak if not active yet today
  let streak = profile.streakDays;
  if (profile.lastActiveDate !== today) {
    const lastDate = new Date(profile.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1; // streak reset
    }
  }

  const updatedXp = profile.totalXp + amount;
  const { level } = calculateLevel(updatedXp);

  const updatedProfile: UserProfile = {
    ...profile,
    totalXp: updatedXp,
    currentLevel: level,
    streakDays: streak,
    lastActiveDate: today,
  };

  saveUserProfile(updatedProfile);
  return updatedProfile;
}

export function completeLesson(lessonId: string, xpReward: number): UserProfile {
  const profile = getUserProfile();
  const completed = new Set(profile.completedLessons);
  const isFirstTime = !completed.has(lessonId);
  completed.add(lessonId);

  const updated = awardXp(isFirstTime ? xpReward : Math.round(xpReward / 2));
  updated.completedLessons = Array.from(completed);

  // Dynamic module unlock checking
  const match = lessonId.match(/^module-(\d+)-lesson-(\d+)$/);
  if (match) {
    const modNum = parseInt(match[1], 10);
    const lesNum = parseInt(match[2], 10);
    if (lesNum === modNum * 5 && updated.unlockedModule < modNum + 1) {
      updated.unlockedModule = modNum + 1;
    }
  }

  if (lessonId === 'module-12-lesson-60') {
    const hasBadge = updated.badges.some((b) => b.id === 'b-midterm-mastery');
    if (!hasBadge) {
      updated.badges.push({
        id: 'b-midterm-mastery',
        titleBengali: 'অর্ধ-কুরআন অভিযাত্রী',
        descriptionBengali: '২৪ সপ্তাহের প্রথম ৫০% মাইলফলক (৬০টি পাঠ) সফলভাবে সম্পন্ন করেছেন',
        icon: '👑',
        unlockedAt: new Date().toISOString().split('T')[0],
      });
    }
  }

  saveUserProfile(updated);
  return updated;
}

// Spaced Repetition System (SRS) Helpers - delegated to srs.ts
export { getSRSCards, updateSRSCard } from '@/lib/srs';
