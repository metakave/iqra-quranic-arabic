import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "কুরআনিক আরবি অনুশীলন ও ফ্ল্যাশকার্ড | SRS স্পেসড রিপিটেশন",
  description:
    "স্মরণ ব্যবধান (SRS) পদ্ধতির মাধ্যমে প্রতিদিন ৩০ মিনিটের স্বাধীন অনুশীলনে কুরআনের শব্দ ও বাক্যভঙ্গির অর্থ আয়ত্ত করুন।",
  keywords: [
    "কুরআন আরবি অনুশীলন",
    "কুরআন ফ্ল্যাশকার্ড",
    "SRS Quranic Arabic Bengali",
    "আরবি শব্দ মনে রাখার উপায়",
  ],
  alternates: {
    canonical: '/practice',
  },
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
