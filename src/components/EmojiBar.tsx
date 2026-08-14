import { Sparkles, HelpCircle } from "lucide-react";
import { EMOJI_ACTING_RULES } from "../data/presets";
import { EmojiActingRule, SupportedLanguage } from "../types";

interface EmojiBarProps {
  onInsertEmoji: (emoji: string) => void;
  language: SupportedLanguage;
  detectedEmojis?: string[];
}

export function EmojiBar({ onInsertEmoji, language, detectedEmojis = [] }: EmojiBarProps) {
  return (
    <div
      id="emoji-acting-bar"
      className="p-3.5 rounded-2xl bg-zinc-950/80 border border-yellow-500/30 space-y-2.5 shadow-inner"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍌</span>
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
            Emoji Acting Director (লাইনের শুরুতে ইমোজি দিলে ভয়েস সেভাবে অ্যাক্ট করবে)
          </span>
        </div>

        <span className="text-[11px] text-zinc-400">
          Click any emoji to insert at line start 👇
        </span>
      </div>

      {/* Grid of Emojis */}
      <div className="flex flex-wrap gap-1.5">
        {EMOJI_ACTING_RULES.map((rule: EmojiActingRule) => {
          const isUsed = detectedEmojis.includes(rule.emoji);
          const localizedName =
            language === "bengali"
              ? rule.bengaliName
              : language === "hindi"
              ? rule.hindiName
              : rule.name;

          return (
            <button
              key={rule.emoji}
              id={`emoji-btn-${rule.emoji}`}
              onClick={() => onInsertEmoji(rule.emoji)}
              title={`${rule.name}: ${rule.styleDescription}`}
              className={`group relative px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
                isUsed
                  ? "bg-yellow-500/20 border-yellow-400/80 text-yellow-200 ring-1 ring-yellow-400/50 scale-105"
                  : "bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-yellow-500/40 hover:text-white"
              }`}
            >
              <span className="text-base group-hover:scale-125 transition transform">
                {rule.emoji}
              </span>
              <span className="text-[11px] whitespace-nowrap">{localizedName}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Guide tooltip banner */}
      <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
        <span className="flex items-center gap-1 text-zinc-300">
          <span>💡 উদাহরণ:</span>
          <code className="text-yellow-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700">
            😭 আমি খুব কাঁদছি...
          </code>
          <span>বা</span>
          <code className="text-yellow-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700">
            😂 হাহাহা কি কান্ড!
          </code>
        </span>
        <span className="text-emerald-400 font-medium">
          ✓ লাইন বাই লাইন নিখুঁত ইমোশন অ্যাক্টিং
        </span>
      </div>
    </div>
  );
}
