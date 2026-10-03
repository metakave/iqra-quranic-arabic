import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "কুরআনের শব্দভান্ডার ও মূল পরিবার | সবচেয়ে বেশি ব্যবহৃত আরবি শব্দ",
  description:
    "কুরআনে সর্বাধিক পুনরাবৃত্ত আরবি মূল শব্দ (Root Families) ও তাদের বিভিন্ন রূপান্তর। বাংলা অর্থ, ব্যাকরণিক পরিচয় এবং কুরআনিক রেফারেন্সসহ ইন্টারঅ্যাক্টিভ অভিধান।",
  keywords: [
    "কুরআনের শব্দভান্ডার",
    "কুরআনের মূল শব্দ",
    "কুরআনিক শব্দার্থ",
    "Quranic vocabulary in Bengali",
    "Quran root words Bengali",
    "কুরআনে বেশি আসা শব্দ",
  ],
  alternates: {
    canonical: '/vocabulary',
  },
  openGraph: {
    title: "কুরআনের শব্দভান্ডার ও মূল পরিবার | সবচেয়ে বেশি ব্যবহৃত আরবি শব্দ",
    description: "কুরআনে সর্বাধিক পুনরাবৃত্ত আরবি মূল শব্দ এবং তাদের বাংলা অর্থ ও ব্যাকরণ।",
    url: '/vocabulary',
  },
};

export default function VocabularyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
