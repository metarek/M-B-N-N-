export type SupportedLanguage = "bengali" | "english" | "hindi";

export interface EmojiActingRule {
  emoji: string;
  name: string;
  bengaliName: string;
  hindiName: string;
  styleDescription: string;
  badgeColor: string;
  exampleLine: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: "Male" | "Female" | "Neutral";
  description: string;
  bengaliVibe: string;
  color: string;
  tag?: string;
  isViral?: boolean;
}

export interface AudioItem {
  id: string;
  text: string;
  audioBase64: string;
  audioBlobUrl: string;
  voice: string;
  language: SupportedLanguage;
  createdAt: number;
  duration: number;
  totalChunks?: number;
}

export interface ScriptPreset {
  id: string;
  title: string;
  bengaliTitle: string;
  language: SupportedLanguage;
  text: string;
  recommendedVoice: string;
}
