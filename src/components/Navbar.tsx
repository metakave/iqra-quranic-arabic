'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Zap, BookOpen, Clock, User, Compass, BookMarked } from 'lucide-react';
import { getUserProfile } from '@/lib/gamification';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile } from '@/types/curriculum';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [googleUser, setGoogleUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
    // Listen to storage changes to update live
    const handleStorage = () => setProfile(getUserProfile());
    window.addEventListener('storage', handleStorage);

    // Sync authenticated Supabase user
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setGoogleUser(user);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setGoogleUser(session?.user ?? null);
      });
      return () => {
        window.removeEventListener('storage', handleStorage);
        subscription.unsubscribe();
      };
    }

    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'পাঠশালা', icon: BookOpen },
    { href: '/vocabulary', label: 'শব্দভান্ডার', icon: BookMarked },
    { href: '/practice', label: 'অনুশীলন', icon: Clock },
    { href: '/#curriculum', label: 'পাঠ্যক্রম', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            ق
          </div>
          <div>
            <span className="font-bold text-lg sm:text-xl text-stone-100 tracking-tight block leading-tight">
              ইক্বরা কোরানের আরবী
            </span>
            <span className="text-[12px] text-emerald-400 font-sans tracking-wider uppercase hidden sm:block">
              IQRA Quranic Arabic
            </span>
          </div>
        </Link>

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-emerald-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400/80" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Gamification Pills & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <div
            title="ধারাবাহিক পড়ার দিন"
            className="flex items-center gap-1 bg-amber-950/70 border border-amber-800/70 px-2.5 py-1 rounded-full text-amber-300 text-xs sm:text-sm font-semibold streak-glow"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{profile?.streakDays ?? 1} দিন</span>
          </div>

          {/* XP Badge */}
          <div
            title="অর্জিত জ্ঞান পয়েন্ট (XP)"
            className="flex items-center gap-1 bg-emerald-950/70 border border-emerald-800/70 px-2.5 py-1 rounded-full text-emerald-300 text-xs sm:text-sm font-semibold"
          >
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>{profile?.totalXp ?? 50} XP</span>
          </div>

          {/* User Button */}
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-stone-200 transition-colors"
          >
            {googleUser?.user_metadata?.avatar_url || googleUser?.user_metadata?.picture ? (
              <img
                src={googleUser.user_metadata.avatar_url || googleUser.user_metadata.picture}
                alt="User"
                className="w-4 h-4 rounded-full border border-emerald-400 object-cover"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="hidden sm:inline">
              {googleUser?.user_metadata?.full_name?.split(' ')[0] ||
                (profile?.name && profile.name !== 'কুরআন শিক্ষার্থী' ? profile.name.split(' ')[0] : 'প্রোফাইল')}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Sub Navigation Bar */}
      <div className="md:hidden border-t border-stone-800 bg-stone-950 px-3 py-2 flex items-center justify-around text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 py-1 px-2 rounded-md ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-stone-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
