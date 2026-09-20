import type { Metadata } from "next";
import { Noto_Serif_Bengali, Amiri_Quran } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiriQuran = Amiri_Quran({
  variable: "--font-arabic-quran",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ইক্বরা কোরানের আরবী - IQRA Quranic Arabic | বাংলাভাষীদের জন্য ধাপে ধাপে কুরআনিক আরবি",
  description:
    "ছোট ছোট পাঠ, বাস্তব আয়াত এবং বৈজ্ঞানিক অনুশীলনের মাধ্যমে কুরআনের আরবি সরাসরি বুঝে পড়ার স্ব-শিক্ষণ প্ল্যাটফর্ম।",
  keywords: [
    "ইক্বরা কোরানের আরবী",
    "IQRA Quranic Arabic",
    "কুরআনিক আরবি",
    "Quranic Arabic Bengali",
    "কুরআন শিক্ষা",
    "Arabic Grammar in Bengali",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      dir="ltr"
      className={`${notoSerifBengali.variable} ${amiriQuran.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://verses.quran.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://verses.quran.com" />
      </head>
      <body className="min-h-full flex flex-col font-bengali bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-stone-200 bg-stone-100/70 py-8 px-4 text-center text-sm text-stone-600">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base">
                ق
              </span>
              <div className="text-left">
                <span className="font-bold text-stone-800 text-base block leading-tight">
                  ইক্বরা কোরানের আরবী
                </span>
                <span className="text-[12px] text-stone-500 font-sans tracking-wider uppercase block">
                  IQRA Quranic Arabic
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              ১২০টি পাঠের স্ব-শিক্ষণ পাঠ্যক্রম • পদ্ধতি: দেখুন → ভাঙুন → জোড়া দিন → বলুন → মিলিয়ে নিন
            </p>
            <p className="text-xs text-stone-400">
              © {new Date().getFullYear()} সকল স্বত্ব সংরক্ষিত
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
