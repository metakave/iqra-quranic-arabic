import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "কুরআনের দোয়া ও ব্যাকরণিক বিশ্লেষণ | ৭৫টি শ্রেষ্ঠ কুরআনিক মুনাজাত",
  description:
    "কুরআনের অধ্যায় ও আয়াত ক্রমানুসারে সাজানো ৭৫টি অমর দোয়ার শব্দভিত্তিক বিশ্লেষণ, অর্থপূর্ণ খণ্ড, অডিও তেলাওয়াত এবং পাঠমালার আলোকে ব্যাকরণিক ব্যাখ্যা।",
  keywords: [
    "কুরআনের দোয়া",
    "কুরআনিক মুনাজাত",
    "রব্বানা দোয়া বাংলা অর্থসহ",
    "৪০ রব্বানা দোয়া",
    "নবীদের দোয়া ও আরজি",
    "কুরআনের দোয়ার ব্যাকরণ",
    "Dua in Quran with Bengali meaning",
    "Quranic supplications grammar",
  ],
  alternates: {
    canonical: '/duas',
  },
  openGraph: {
    title: "কুরআনের দোয়া ও ব্যাকরণিক বিশ্লেষণ | ৭৫টি শ্রেষ্ঠ কুরআনিক মুনাজাত",
    description: "কুরআনের ৭৫টি অমর দোয়ার শব্দভিত্তিক বিশ্লেষণ ও ব্যাকরণিক রহস্য।",
    url: '/duas',
  },
};

export default function DuasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
