-- ==============================================================================
-- ইক্বরা কোরানের আরবী (IQRA Quranic Arabic) - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create Profiles Table (Linked with Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT DEFAULT 'কুরআন শিক্ষার্থী',
    email TEXT,
    arabic_reading_level TEXT DEFAULT 'fluent_decoding' CHECK (arabic_reading_level IN ('fluent_decoding', 'intermediate', 'beginner')),
    daily_target_minutes INTEGER DEFAULT 30,
    streak_days INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    unlocked_module INTEGER DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create User Completed Lessons Table
CREATE TABLE IF NOT EXISTS public.user_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id TEXT NOT NULL,
    score INTEGER DEFAULT 5,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 3. Create Spaced Repetition (SRS) Flashcards Progress Table
CREATE TABLE IF NOT EXISTS public.user_srs_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id TEXT NOT NULL,
    box INTEGER DEFAULT 1,
    interval_days INTEGER DEFAULT 1,
    ease_factor NUMERIC(4, 2) DEFAULT 2.50,
    repetitions INTEGER DEFAULT 0,
    next_review_date DATE DEFAULT CURRENT_DATE,
    last_reviewed_at TIMESTAMPTZ,
    UNIQUE(user_id, card_id)
);

-- 4. Create User Badges & Achievements Table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_id TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description_bn TEXT,
    icon TEXT DEFAULT '🌱',
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Ensures learners can only view and edit their own progress
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_srs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- User Lessons Policies
CREATE POLICY "Users can view their own lesson progress"
    ON public.user_lessons FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
    ON public.user_lessons FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
    ON public.user_lessons FOR UPDATE
    USING (auth.uid() = user_id);

-- User SRS Cards Policies
CREATE POLICY "Users can view their own SRS cards"
    ON public.user_srs_cards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert or update their own SRS cards"
    ON public.user_srs_cards FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Badges Policies
CREATE POLICY "Users can view their own badges"
    ON public.user_badges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Automatic Profile Creation Trigger on Signup
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'কুরআন শিক্ষার্থী'),
        NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
