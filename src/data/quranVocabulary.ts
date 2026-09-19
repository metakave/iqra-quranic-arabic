export interface DerivativeWord {
  id: string;
  arabic: string;
  meaningBengali: string;
  grammarBengali: string;
  category: 'past_verb' | 'present_verb' | 'imperative_verb' | 'noun' | 'adjective';
  quranExample?: string;
  exampleSurahBengali?: string;
}

export interface RootFamily {
  id: string;
  rootLettersArabic: string;
  rootMeaningBengali: string;
  frequencyInQuran: number;
  descriptionBengali: string;
  themeColor: 'emerald' | 'amber' | 'sky' | 'violet' | 'rose';
  derivatives: DerivativeWord[];
}

export const QURAN_ROOT_FAMILIES: RootFamily[] = [
  {
    id: 'root-qwl',
    rootLettersArabic: 'ق - و - ل',
    rootMeaningBengali: 'বলা / কথা বলা / উক্তি করা',
    frequencyInQuran: 1722,
    descriptionBengali: 'কুরআনের সর্বাধিক পুনরাবৃত্ত মূল শব্দগুলোর একটি। আল্লাহর নির্দেশ, নবীদের সম্বোধন এবং সংলাপ প্রকাশে এটি সর্বাধিক ব্যবহৃত।',
    themeColor: 'emerald',
    derivatives: [
      {
        id: 'qwl-1',
        arabic: 'قَالَ',
        meaningBengali: 'সে বলল / তিনি বললেন',
        grammarBengali: 'অতীতকালীন ক্রিয়া (فعل ماض)',
        category: 'past_verb',
        quranExample: 'وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:৩০',
      },
      {
        id: 'qwl-2',
        arabic: 'قَالُوا',
        meaningBengali: 'তারা বলল',
        grammarBengali: 'অতীতকালীন ক্রিয়া (বহুবচন)',
        category: 'past_verb',
        quranExample: 'قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:৩২',
      },
      {
        id: 'qwl-3',
        arabic: 'يَقُولُ',
        meaningBengali: 'সে বলে / বলবে',
        grammarBengali: 'বর্তমান/ভবিষ্যৎ ক্রিয়া (فعل مضارع)',
        category: 'present_verb',
        quranExample: 'وَمِنَ النَّاسِ مَنْ يَقُولُ',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:৮',
      },
      {
        id: 'qwl-4',
        arabic: 'قُلْ',
        meaningBengali: 'তুমি বলো / বলুন (আদেশ)',
        grammarBengali: 'আদেশবাচক ক্রিয়া (فعل أمر)',
        category: 'imperative_verb',
        quranExample: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        exampleSurahBengali: 'সূরা আল-ইখলাস ১১২:১',
      },
      {
        id: 'qwl-5',
        arabic: 'قَوْل',
        meaningBengali: 'কথা / উক্তি / বাণী',
        grammarBengali: 'মূল বিশেষ্য (مصدر)',
        category: 'noun',
        quranExample: 'وَقُولُوا لِلنَّاسِ حُسْنًا',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:৮৩',
      },
    ],
  },
  {
    id: 'root-kwn',
    rootLettersArabic: 'ك - و - ن',
    rootMeaningBengali: 'হওয়া / অস্তিত্বশীল হওয়া / ঘটা',
    frequencyInQuran: 1390,
    descriptionBengali: 'অস্তিত্ব ও অবস্থার রূপান্তর প্রকাশের মূল শব্দ। মহাবিশ্ব সৃষ্টিতে আল্লাহর পরম আদেশ ‘কুন’ (হও) এখান থেকেই এসেছে।',
    themeColor: 'sky',
    derivatives: [
      {
        id: 'kwn-1',
        arabic: 'كَانَ',
        meaningBengali: 'সে ছিল / তিনি হলেন',
        grammarBengali: 'অতীতকালীন ক্রিয়া (فعل ماض)',
        category: 'past_verb',
        quranExample: 'وَكَانَ اللَّهُ غَفُورًا رَحِيمًا',
        exampleSurahBengali: 'সূরা আন-নিসা ৪:৯৬',
      },
      {
        id: 'kwn-2',
        arabic: 'كَانُوا',
        meaningBengali: 'তারা ছিল',
        grammarBengali: 'অতীতকালীন ক্রিয়া (বহুবচন)',
        category: 'past_verb',
        quranExample: 'كَانُوا لَا يَتَنَاهَوْنَ عَنْ مُنْكَرٍ',
        exampleSurahBengali: 'সূরা আল-মায়িদাহ ৫:৭৯',
      },
      {
        id: 'kwn-3',
        arabic: 'يَكُونُ',
        meaningBengali: 'সে হয় / হবে',
        grammarBengali: 'বর্তমান/ভবিষ্যৎ ক্রিয়া (فعل مضارع)',
        category: 'present_verb',
        quranExample: 'أَنَّى يَكُونُ لِي غُلَامٌ',
        exampleSurahBengali: 'সূরা মারিয়াম ১৯:২০',
      },
      {
        id: 'kwn-4',
        arabic: 'كُنْ',
        meaningBengali: 'হও (সৃষ্টির পরম আদেশ)',
        grammarBengali: 'আদেশবাচক ক্রিয়া (فعل أمر)',
        category: 'imperative_verb',
        quranExample: 'إِذَا قَضَى أَمْرًا فَإِنَّمَا يَقُولُ لَهُ كُنْ فَيَكُونُ',
        exampleSurahBengali: 'সূরা আলে ইমরান ৩:৪৭',
      },
    ],
  },
  {
    id: 'root-alm',
    rootLettersArabic: 'ع - ل - م',
    rootMeaningBengali: 'জানা / জ্ঞান অর্জন করা / অবগত হওয়া',
    frequencyInQuran: 854,
    descriptionBengali: 'জ্ঞান, অনুধাবন ও শিক্ষার মূল শব্দ। আল্লাহ সুবহানাহু ওয়া তা‘আলার অন্যতম প্রধান গুণবাচক নাম ‘আল-আলীম’ (সর্বজ্ঞাত) এর অন্তর্ভুক্ত।',
    themeColor: 'amber',
    derivatives: [
      {
        id: 'alm-1',
        arabic: 'عَلِمَ',
        meaningBengali: 'সে জেনেছে / অবগত হয়েছে',
        grammarBengali: 'অতীতকালীন ক্রিয়া (فعل ماض)',
        category: 'past_verb',
        quranExample: 'عَلِمَ أَنْ سَيَكُونُ مِنْكُمْ مَرْضَى',
        exampleSurahBengali: 'সূরা আল-মুযযাম্মিল ৭৩:২০',
      },
      {
        id: 'alm-2',
        arabic: 'يَعْلَمُ',
        meaningBengali: 'সে জানে / জানবে',
        grammarBengali: 'বর্তমান/ভবিষ্যৎ ক্রিয়া (فعل مضارع)',
        category: 'present_verb',
        quranExample: 'يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:২৫৫ (আয়াতুল কুরসি)',
      },
      {
        id: 'alm-3',
        arabic: 'تَعْلَمُونَ',
        meaningBengali: 'তোমরা জানো',
        grammarBengali: 'বর্তমান/ভবিষ্যৎ ক্রিয়া (বহুবচন)',
        category: 'present_verb',
        quranExample: 'وَأَنْتُمْ تَعْلَمُونَ',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:২২',
      },
      {
        id: 'alm-4',
        arabic: 'عَلِيم',
        meaningBengali: 'সর্বজ্ঞাত / অতিশয় পরিজ্ঞাত',
        grammarBengali: 'গুণবাচক বিশেষ্য (اسم صفة)',
        category: 'adjective',
        quranExample: 'وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ',
        exampleSurahBengali: 'সূরা আন-নূর ২৪:৩৫',
      },
      {
        id: 'alm-5',
        arabic: 'عِلْم',
        meaningBengali: 'জ্ঞান / প্রজ্ঞা',
        grammarBengali: 'মূল বিশেষ্য (مصدر)',
        category: 'noun',
        quranExample: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا',
        exampleSurahBengali: 'সূরা ত্বা-হা ২০:১১৪',
      },
    ],
  },
  {
    id: 'root-abd',
    rootLettersArabic: 'ع - ب - د',
    rootMeaningBengali: 'ইবাদত করা / দাসত্ব করা / আনুগত্য প্রকাশ',
    frequencyInQuran: 275,
    descriptionBengali: 'বান্দা ও স্রষ্টার মধ্যকার চূড়ান্ত দাসত্ব ও আনুগত্যের সম্পর্কসূচক মূল শব্দ। সূরা আল-ফাতিহার ‘ইয়্যাক্বা না‘বুদু’ এখান থেকেই।',
    themeColor: 'violet',
    derivatives: [
      {
        id: 'abd-1',
        arabic: 'عَبَدَ',
        meaningBengali: 'সে ইবাদত করেছে',
        grammarBengali: 'অতীতকালীন ক্রিয়া (فعل ماض)',
        category: 'past_verb',
        quranExample: 'مَا كَانُوا يَعْبُدُونَ',
        exampleSurahBengali: 'সূরা আল-আন‘আম ৬:১০৮',
      },
      {
        id: 'abd-2',
        arabic: 'نَعْبُدُ',
        meaningBengali: 'আমরা ইবাদত করি',
        grammarBengali: 'বর্তমান/ভবিষ্যৎ ক্রিয়া (فعل مضارع)',
        category: 'present_verb',
        quranExample: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        exampleSurahBengali: 'সূরা আল-ফাতিহা ১:৫',
      },
      {
        id: 'abd-3',
        arabic: 'اعْبُدُوا',
        meaningBengali: 'তোমরা ইবাদত করো (আদেশ)',
        grammarBengali: 'আদেশবাচক ক্রিয়া (فعل أمر)',
        category: 'imperative_verb',
        quranExample: 'يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ',
        exampleSurahBengali: 'সূরা আল-বাকারা ২:২১',
      },
      {
        id: 'abd-4',
        arabic: 'عَبْد',
        meaningBengali: 'বান্দা / দাস / গোলাম',
        grammarBengali: 'একবচন বিশেষ্য (اسم مفرد)',
        category: 'noun',
        quranExample: 'سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا',
        exampleSurahBengali: 'সূরা আল-ইসরা ১৭:১',
      },
      {
        id: 'abd-5',
        arabic: 'عِبَاد',
        meaningBengali: 'বান্দাগণ / দাসমণ্ডলী',
        grammarBengali: 'বহুবচন বিশেষ্য (اسم جمع)',
        category: 'noun',
        quranExample: 'وَعِبَادُ الرَّحْمٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا',
        exampleSurahBengali: 'সূরা আল-ফুরকান ২৫:৬৩',
      },
    ],
  },
  {
    id: 'root-rhm',
    rootLettersArabic: 'ر - ح - م',
    rootMeaningBengali: 'দয়া করা / অনুগ্রহ করা / করুণা বর্ষণ',
    frequencyInQuran: 560,
    descriptionBengali: 'পরম দয়া ও অনন্ত স্নেহের মূল শব্দ। বিসমিল্লাহর আর-রহমান ও আর-রহীম এবং সমগ্র কুরআনের প্রধান বার্তা এই মূল ধারণার সাথে জড়িত।',
    themeColor: 'rose',
    derivatives: [
      {
        id: 'rhm-1',
        arabic: 'الرَّحْمٰن',
        meaningBengali: 'পরম করুণাময় / অনন্ত দয়ালু',
        grammarBengali: 'আল্লাহর অনন্য গুণবাচক নাম',
        category: 'adjective',
        quranExample: 'الرَّحْمٰنِ الرَّحِيمِ',
        exampleSurahBengali: 'সূরা আল-ফাতিহা ১:৩',
      },
      {
        id: 'rhm-2',
        arabic: 'الرَّحِيم',
        meaningBengali: 'অতি দয়ালু / পরম দাতা',
        grammarBengali: 'গুণবাচক নাম',
        category: 'adjective',
        quranExample: 'وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا',
        exampleSurahBengali: 'সূরা আল-আহযাব ৩৩:৪৩',
      },
      {
        id: 'rhm-3',
        arabic: 'رَحْمَة',
        meaningBengali: 'রহমত / দয়া / অনুগ্রহ',
        grammarBengali: 'বিশেষ্য (اسم)',
        category: 'noun',
        quranExample: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ',
        exampleSurahBengali: 'সূরা আল-আম্বিয়া ২১:১০৭',
      },
      {
        id: 'rhm-4',
        arabic: 'يَرْحَمُ',
        meaningBengali: 'তিনি দয়া করেন / অনুগ্রহ বর্ষণ করেন',
        grammarBengali: 'বর্তমান/ভবিষ্যৎ ক্রিয়া (فعل مضارع)',
        category: 'present_verb',
        quranExample: 'يَغْفِرُ لِمَنْ يَشَاءُ وَيَرْحَمُ مَنْ يَشَاءُ',
        exampleSurahBengali: 'সূরা আল-আনকাবূত ২৯:২১',
      },
    ],
  },
];
