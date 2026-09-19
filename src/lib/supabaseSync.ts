import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile, SRSCard } from '@/types/curriculum';

/**
 * Fetches the user profile and progress from Supabase.
 * Returns null if Supabase is not configured or user is not logged in.
 */
export async function fetchRemoteUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return null;

    // Fetch completed lessons
    const { data: lessons } = await supabase
      .from('user_lessons')
      .select('lesson_id')
      .eq('user_id', userId);

    const completedLessons = lessons?.map((l) => l.lesson_id) || [];

    // Fetch badges
    const { data: badgesData } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    const badges =
      badgesData?.map((b) => ({
        id: b.badge_id,
        titleBengali: b.title_bn,
        descriptionBengali: b.description_bn || '',
        icon: b.icon,
        unlockedAt: b.unlocked_at,
      })) || [];

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email || '',
      arabicReadingLevel: profile.arabic_reading_level,
      dailyTargetMinutes: profile.daily_target_minutes,
      streakDays: profile.streak_days,
      lastActiveDate: profile.last_active_date,
      totalXp: profile.total_xp,
      currentLevel: profile.current_level,
      completedLessons,
      unlockedModule: profile.unlocked_module,
      badges,
    };
  } catch (err) {
    console.error('Error fetching remote profile:', err);
    return null;
  }
}

/**
 * Syncs a completed lesson to Supabase.
 */
export async function syncRemoteLessonCompletion(
  userId: string,
  lessonId: string,
  score: number = 5,
  earnedXp: number = 25
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    // 1. Record completed lesson
    await supabase.from('user_lessons').upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

    // 2. Increment user XP in profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_xp: (profile.total_xp || 0) + earnedXp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    }
  } catch (err) {
    console.error('Error syncing lesson completion:', err);
  }
}

/**
 * Syncs SRS card review to Supabase.
 */
export async function syncRemoteSrsReview(
  userId: string,
  card: SRSCard
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase.from('user_srs_cards').upsert(
      {
        user_id: userId,
        card_id: card.id,
        interval_days: card.intervalDays,
        repetitions: card.repetitions,
        next_review_date: card.nextReviewDate,
        last_reviewed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,card_id' }
    );
  } catch (err) {
    console.error('Error syncing SRS card review:', err);
  }
}
