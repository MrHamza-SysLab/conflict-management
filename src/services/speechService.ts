import { CharacterId } from "../types";

let voices: SpeechSynthesisVoice[] = [];

const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

const findBestVoice = (gender: 'male' | 'female' | 'neutral'): SpeechSynthesisVoice | null => {
  // Priority: Google voices > Premium/Natural voices > System defaults
  const preferredKeywords = ['Google', 'Natural', 'Premium', 'Enhanced'];
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  
  if (englishVoices.length === 0) return null;

  // Filter by gender if possible (some voices have gender in name)
  const genderVoices = englishVoices.filter(v => {
    const name = v.name.toLowerCase();
    if (gender === 'female') return name.includes('female') || name.includes('samantha') || name.includes('zira') || name.includes('susan') || name.includes('linda');
    if (gender === 'male') return name.includes('male') || name.includes('david') || name.includes('mark') || name.includes('george') || name.includes('ravi');
    return true;
  });

  const candidates = genderVoices.length > 0 ? genderVoices : englishVoices;

  // Sort by preferred keywords
  return candidates.sort((a, b) => {
    const aScore = preferredKeywords.reduce((acc, kw) => acc + (a.name.includes(kw) ? 1 : 0), 0);
    const bScore = preferredKeywords.reduce((acc, kw) => acc + (b.name.includes(kw) ? 1 : 0), 0);
    return bScore - aScore;
  })[0];
};

export const speak = (text: string, character: CharacterId): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  let voice: SpeechSynthesisVoice | null = null;

  switch (character) {
    case 'ali':
      voice = findBestVoice('male');
      utterance.pitch = 0.85;
      utterance.rate = 0.95;
      break;
    case 'sara':
      voice = findBestVoice('female');
      utterance.pitch = 1.15;
      utterance.rate = 1.05;
      break;
    case 'manager':
      voice = findBestVoice('male');
      utterance.pitch = 0.9;
      utterance.rate = 1.1;
      break;
    default:
      voice = findBestVoice('neutral');
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
  }

  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
