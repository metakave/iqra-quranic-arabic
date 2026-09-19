export interface Chunk {
  arabicText: string;
  meaningBengali: string;
  roleBengali: string; // e.g. "মূল বিষয় (Subject)", "কার প্রাপ্য (Recipient)", "সম্বোধন"
  type: 'root' | 'prefix' | 'suffix' | 'particle' | 'noun';
  colorTag?: string; // emerald, amber, sky, violet
}

export interface Connector {
  fromText: string;
  toText: string;
  relationshipBengali: string;
}

export interface PracticeExercise {
  id: string;
  type: 'multiple_choice' | 'deconstruction' | 'cloze' | 'reflection';
  questionBengali: string;
  arabicPrompt: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanationBengali: string;
}

export interface ErrorDiagnosisItem {
  misconceptionBengali: string;
  teacherFeedbackBengali: string;
}

export interface LessonContent {
  id: string;
  moduleNumber: number;
  lessonNumber: number;
  titleBengali: string;
  subtitleBengali: string;
  estimatedMinutes: number;
  anchorAyah: {
    surahNumber: number;
    ayahNumber: number;
    surahNameBengali: string;
    arabicText: string;
    bengaliTranslation: string;
  };
  // Optional pre-learning diagnostic
  preCheck?: {
    promptBengali: string;
    diagnosticAyah: {
      arabicText: string;
      referenceBengali: string;
      guidingQuestions: string[];
    };
  };
  steps: {
    // 1. দেখুন (Look/Read)
    dekhun: {
      promptBengali: string;
      arabicText: string;
      guidingQuestionBengali: string;
    };
    // 2. ভাঙুন (Deconstruct chunks)
    bhangun: {
      promptBengali: string;
      chunks: Chunk[];
      teachingNoteBengali: string;
    };
    // 3. জুড়ুন (Connect relationships)
    judun: {
      promptBengali: string;
      connectors: Connector[];
      explanationBengali: string;
      contrastCheck?: {
        prompt: string;
        optionA: string;
        optionB: string;
        correctOption: 'A' | 'B';
        explanation: string;
      };
    };
    // নতুন অংশে প্রয়োগ (Transfer with support)
    transferApplication?: {
      titleBengali: string;
      arabicText: string;
      referenceBengali: string;
      promptBengali: string;
      vocabularySupport: Array<{ arabic: string; meaningBengali: string }>;
      solutionBengali: string;
      teachingNoteBengali: string;
    };
    // 4. বলুন (Typed reflection)
    bolun: {
      promptBengali: string;
      placeholderBengali: string;
      hintBengali: string;
    };
    // 5. মিলিয়ে নিন (Compare & feedback)
    miliyeNin: {
      modelExplanationBengali: string;
      grammaticalTakeawayBengali: string;
      commonMistakesBengali: string[];
    };
  };
  practiceExercises: PracticeExercise[];
  errorDiagnosisTable?: ErrorDiagnosisItem[];
  postPracticeScheduleBengali?: Array<{ timeWindow: string; taskBengali: string }>;
  xpReward: number;
}

export interface ModuleOverview {
  moduleNumber: number;
  weekNumber: number;
  titleBengali: string;
  coreGrammarBengali: string;
  observableOutcomeBengali: string;
  lessonCount: number;
  isCheckpoint?: boolean;
  checkpointTitle?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  arabicReadingLevel: 'beginner' | 'intermediate' | 'fluent_decoding';
  dailyTargetMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  totalXp: number;
  currentLevel: number;
  completedLessons: string[];
  unlockedModule: number;
  badges: Array<{
    id: string;
    titleBengali: string;
    descriptionBengali: string;
    icon: string;
    unlockedAt: string;
  }>;
}

export interface SRSCard {
  id: string;
  arabicPhrase: string;
  bengaliMeaning: string;
  attachmentNoteBengali: string;
  reference: string;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
}
