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
  unlockedModule: 2,
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
    return JSON.parse(saved);
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

  // Check if new module can be unlocked
  if (lessonId === 'module-01-lesson-01' && updated.unlockedModule < 2) {
    updated.unlockedModule = 2;
  }
  if (lessonId === 'module-02-lesson-10' && updated.unlockedModule < 3) {
    updated.unlockedModule = 3;
  }
  if (lessonId === 'module-03-lesson-15' && updated.unlockedModule < 4) {
    updated.unlockedModule = 4;
  }
  if (lessonId === 'module-04-lesson-20' && updated.unlockedModule < 5) {
    updated.unlockedModule = 5;
  }
  if (lessonId === 'module-05-lesson-25' && updated.unlockedModule < 6) {
    updated.unlockedModule = 6;
  }
  if (lessonId === 'module-06-lesson-30' && updated.unlockedModule < 7) {
    updated.unlockedModule = 7;
  }
  if (lessonId === 'module-07-lesson-35' && updated.unlockedModule < 8) {
    updated.unlockedModule = 8;
  }
  if (lessonId === 'module-08-lesson-40' && updated.unlockedModule < 9) {
    updated.unlockedModule = 9;
  }
  if (lessonId === 'module-09-lesson-45' && updated.unlockedModule < 10) {
    updated.unlockedModule = 10;
  }
  if (lessonId === 'module-10-lesson-50' && updated.unlockedModule < 11) {
    updated.unlockedModule = 11;
  }
  if (lessonId === 'module-11-lesson-55' && updated.unlockedModule < 12) {
    updated.unlockedModule = 12;
  }
  if (lessonId === 'module-12-lesson-60') {
    if (updated.unlockedModule < 13) {
      updated.unlockedModule = 13;
    }
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
  if (lessonId === 'module-13-lesson-65' && updated.unlockedModule < 14) {
    updated.unlockedModule = 14;
  }
  if (lessonId === 'module-14-lesson-70' && updated.unlockedModule < 15) {
    updated.unlockedModule = 15;
  }

  saveUserProfile(updated);
  return updated;
}

// Spaced Repetition System (SRS) Helpers - delegated to srs.ts
export { getSRSCards, updateSRSCard } from '@/lib/srs';
