// Browser Web Speech API helper for Arabic pronunciation

let cachedArabicVoice: SpeechSynthesisVoice | null = null;

/**
 * Checks if the browser supports SpeechSynthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Finds the best available Arabic voice on the device
 */
export function getBestArabicVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  if (cachedArabicVoice) return cachedArabicVoice;

  const voices = window.speechSynthesis.getVoices();
  
  // Prefer Saudi Arabic (ar-SA), then any standard Arabic voice
  const saudiVoice = voices.find((v) => v.lang === 'ar-SA' || v.lang === 'ar_SA');
  if (saudiVoice) {
    cachedArabicVoice = saudiVoice;
    return saudiVoice;
  }

  const anyArabicVoice = voices.find((v) => v.lang.startsWith('ar'));
  if (anyArabicVoice) {
    cachedArabicVoice = anyArabicVoice;
    return anyArabicVoice;
  }

  return null;
}

/**
 * Plays the Arabic text pronunciation using browser SpeechSynthesis
 * @param text Arabic phrase with or without tashkeel
 * @param onStart Callback when speech starts
 * @param onEnd Callback when speech completes or errors
 * @returns boolean indicating if speech synthesis was successfully triggered
 */
export function playArabicSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return false;
  }

  // Cancel any ongoing speech so new clicks play immediately
  window.speechSynthesis.cancel();

  // Clean the text slightly for TTS (remove slashes if options like "يَعْلَمُ / تَعْلَمُونَ")
  const cleanText = text.split('/')[0].trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.82; // Slightly slower for crisp Quranic tajweed/harakat clarity
  utterance.pitch = 1.0;

  const voice = getBestArabicVoice();
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    // Interrupted errors happen normally on cancel()
    if (e.error !== 'interrupted') {
      console.warn('Arabic SpeechSynthesis error:', e);
    }
    onEnd?.();
  };

  // Workaround for Chrome bug where voice list might be async
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const reloadedVoice = getBestArabicVoice();
      if (reloadedVoice) utterance.voice = reloadedVoice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }

  return true;
}
