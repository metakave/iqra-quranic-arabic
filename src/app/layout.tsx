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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quranicarabic.metakave.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ইক্বরা কোরানের আরবী - কোনো মুখস্থ ছক ছাড়াই কুরআনের আরবী সরাসরি শেখার আধুনিক প্ল্যাটফর্ম",
    template: "%s | ইক্বরা কোরানের আরবী (IQRA Quranic Arabic)",
  },
  description:
    "বাংলাভাষীদের জন্য বৈজ্ঞানিক স্ব-শিক্ষণ প্ল্যাটফর্ম। কোনো মুখস্থ ছক ছাড়াই অর্থপূর্ণ খণ্ড, বাস্তব আয়াত এবং বৈজ্ঞানিক অনুশীলনের সাহায্যে কুরআনের আরবী সরাসরি বুঝে পড়ার ১২০টি পাঠের সমন্বিত কোর্স।",
  keywords: [
    "কুরআনের আরবী শিক্ষা",
    "কোরআনের আরবি ভাষা শিক্ষা",
    "বুঝে বুঝে কুরআন পড়া",
    "কুরআন বোঝার সহজ উপায়",
    "ইক্বরা কোরানের আরবী",
    "IQRA Quranic Arabic",
    "কুরআনিক আরবি কোর্স বাংলা",
    "কুরআনের দোয়া ও ব্যাকরণিক বিশ্লেষণ",
    "রব্বানা দোয়া বাংলা অর্থসহ",
    "কুরআনের শব্দভান্ডার",
    "কুরআন শিক্ষা",
    "Quranic Arabic in Bengali",
    "Learn Quranic Arabic Bengali",
    "Quran Bangla Course",
    "Arabic Grammar in Bengali",
    "Understand Quran without translation",
  ],
  authors: [{ name: "IQRA Quranic Arabic Team", url: siteUrl }],
  creator: "ইক্বরা কোরানের আরবী (IQRA Quranic Arabic)",
  publisher: "MetaKave",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: siteUrl,
    title: "ইক্বরা কোরানের আরবী - কোনো মুখস্থ ছক ছাড়াই কুরআনের আরবী সরাসরি শেখার আধুনিক প্ল্যাটফর্ম",
    description:
      "মুখস্থ ছকের ঝামেলা ছাড়াই ছোট ছোট পাঠ ও বাস্তব আয়াতের সাহায্যে কুরআনের আরবী সরাসরি অনুধাবন করুন। ১২০টি পাঠ, কুরআনের দোয়া সংকলন ও ইন্টারেক্টিভ শব্দভান্ডার।",
    siteName: "ইক্বরা কোরানের আরবী (IQRA Quranic Arabic)",
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: "ইক্বরা কোরানের আরবী লোগো",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ইক্বরা কোরানের আরবী - IQRA Quranic Arabic",
    description:
      "কোনো মুখস্থ ছক ছাড়াই কুরআনের আরবী সরাসরি শেখার আধুনিক পদ্ধতি। ১২০টি পাঠ ও ৭৫টি কুরআনিক দোয়ার বিশ্লেষণ।",
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
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
