/**
 * Browser Speech Synthesis Helper
 * Speaks text using the browser's built-in Bengali/Hindi/English voice engine.
 */

export function speakWithBrowserVoice(
  text: string,
  language: "bengali" | "english" | "hindi",
  speed = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText || text);
      const langCode = language === "bengali" ? "bn-BD" : language === "hindi" ? "hi-IN" : "en-US";
      utterance.lang = langCode;
      utterance.rate = speed || 1.0;

      const availableVoices = window.speechSynthesis.getVoices();
      const voiceMatch = availableVoices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(langCode.substring(0, 2)) ||
          (langCode.startsWith("bn") && (v.lang.includes("bn") || v.name.includes("Bangla") || v.name.includes("Bengali")))
      );
      if (voiceMatch) {
        utterance.voice = voiceMatch;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
      resolve();
    }
  });
}


