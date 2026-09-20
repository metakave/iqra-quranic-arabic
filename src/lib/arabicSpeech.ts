// Robust Arabic Audio Pronunciation Helper (HTML5 Audio streaming with Web Speech API fallback)

let currentAudio: HTMLAudioElement | null = null;
let cachedArabicVoice: SpeechSynthesisVoice | null = null;

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function getBestArabicVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  if (cachedArabicVoice) return cachedArabicVoice;

  const voices = window.speechSynthesis.getVoices();
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

function trySpeechSynthesis(text: string, onStart?: () => void, onEnd?: () => void): void {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    const voice = getBestArabicVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('SpeechSynthesis failed:', err);
    onEnd?.();
  }
}

export interface PlayArabicAudioOptions {
  surah?: number | string;
  ayah?: number | string;
}

/**
 * Plays Arabic pronunciation reliably using HTML5 Audio (native MP3 stream)
 * with graceful fallback to browser SpeechSynthesis.
 */
export function playArabicSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  options?: PlayArabicAudioOptions
): boolean {
  if (typeof window === 'undefined') return false;

  // Stop any currently playing audio immediately
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {
      // ignore
    }
    currentAudio = null;
  }

  // Also stop any ongoing speech synthesis
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  const cleanText = text.split('/')[0].trim();
  if (!cleanText) {
    onEnd?.();
    return false;
  }

  let ended = false;
  const safeEnd = () => {
    if (!ended) {
      ended = true;
      currentAudio = null;
      onEnd?.();
    }
  };

  // Determine audio stream URL
  let audioUrl = '';

  const sNum = options?.surah ? parseInt(String(options.surah), 10) : NaN;
  const aNum = options?.ayah ? parseInt(String(options.ayah), 10) : NaN;

  if (!isNaN(sNum) && !isNaN(aNum) && sNum >= 1 && sNum <= 114 && aNum >= 1 && aNum <= 286) {
    // High-quality Mishary Alafasy Quran recitation via same-origin proxy
    audioUrl = `/api/audio?surah=${sNum}&ayah=${aNum}`;
  } else {
    // High quality Arabic word pronunciation stream via same-origin proxy (prevents Chrome cross-site block)
    audioUrl = `/api/audio?text=${encodeURIComponent(cleanText)}`;
  }

  try {
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    currentAudio = audio;

    // Immediately trigger onStart for responsive UI feedback
    onStart?.();

    audio.onended = safeEnd;

    audio.onerror = () => {
      // If same-origin proxy fails, try direct EveryAyah for verses or direct TTS for words
      let fallbackUrl = '';
      if (!isNaN(sNum) && !isNaN(aNum)) {
        const sPad = String(sNum).padStart(3, '0');
        const aPad = String(aNum).padStart(3, '0');
        fallbackUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`;
      } else {
        fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=ar&client=tw-ob`;
      }

      const fallbackAudio = new Audio(fallbackUrl);
      fallbackAudio.preload = 'auto';
      currentAudio = fallbackAudio;
      fallbackAudio.onended = safeEnd;
      fallbackAudio.onerror = () => {
        trySpeechSynthesis(cleanText, onStart, safeEnd);
      };
      fallbackAudio.play().catch(() => {
        trySpeechSynthesis(cleanText, onStart, safeEnd);
      });
    };

    // Safety timeout in case playback hangs
    setTimeout(() => {
      if (!ended) safeEnd();
    }, 15000);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('HTML5 audio play rejected, attempting fallback:', err);
        // If play was rejected, trigger fallback or speech synthesis
        audio.onerror?.(new Event('error'));
      });
    }

    return true;
  } catch (err) {
    console.warn('Audio construction failed, using speech synthesis fallback:', err);
    trySpeechSynthesis(cleanText, onStart, safeEnd);
    return true;
  }
}
